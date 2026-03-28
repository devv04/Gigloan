"""
GigScore Flask REST API
=======================
Serves the GigScore credit scoring engine over HTTP for the React frontend.

Endpoints:
    GET  /api/health              → System health check
    GET  /api/profiles            → List all demo worker profiles
    GET  /api/score/<worker_id>   → Full score + dashboard data for a worker
    POST /api/score/custom        → Score arbitrary transaction data

All responses are JSON. CORS is enabled for frontend cross-origin requests.
"""

import os
import json
import time
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from scoring_engine import GigScoreEngine
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# ============================================================
# APP CONFIGURATION
# ============================================================
app = Flask(__name__)
CORS(app)

# Request logging — judges can see API calls in the terminal
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

engine = GigScoreEngine()
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# Gemini AI setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel("gemini-2.5-flash")


# ============================================================
# REQUEST LOGGING MIDDLEWARE
# ============================================================
@app.before_request
def log_request_info():
    """Log every incoming API request to the terminal for demo visibility."""
    logger.info(f"→ {request.method} {request.path}")


@app.after_request
def log_response_info(response):
    """Log the response status for every API call."""
    logger.info(f"← {response.status_code} {request.path}")
    return response


# ============================================================
# API ENDPOINTS
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    Used by monitoring systems and frontend to verify API availability.

    Returns:
        JSON: {"status": "ok", "version": "1.0", "engine": "GigScoreEngine"}
    """
    return jsonify({
        "status": "ok",
        "version": "1.0",
        "engine": "GigScoreEngine v1.0"
    }), 200


@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    """
    Return summary of all available worker profiles for the demo selection screen.
    Each profile includes a pre-computed GigScore preview.

    Returns:
        JSON: Array of profile summaries with id, name, platform, score preview.
    """
    profiles_summary = []

    for filename in ['raju.json', 'priya.json', 'arjun.json']:
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            logger.warning(f"Profile file {filename} not found in {DATA_DIR}")
            continue

        with open(filepath, 'r') as f:
            data = json.load(f)

        # Run scoring engine to get preview stats
        result = engine.calculate(
            data.get('transactions', []),
            data.get('tenure_months', 0)
        )

        profiles_summary.append({
            "id": data.get("worker_id"),
            "name": data.get("name"),
            "platform": data.get("platform"),
            "tenure": f"{data.get('tenure_months')} months",
            "avgIncome": result["avgIncome"],
            "statusBadge": result["statusBadge"],
            "statusColor": result["statusColor"],
            "score": result["score"]
        })

    logger.info(f"  Returned {len(profiles_summary)} profiles")
    return jsonify(profiles_summary), 200


@app.route('/api/score/<worker_id>', methods=['GET'])
def get_worker_score(worker_id: str):
    """
    Load a worker's transaction data from /data/, run the GigScore engine,
    and return the complete dashboard payload.

    Args:
        worker_id: The worker identifier (e.g., "raju", "priya", "arjun")

    Returns:
        JSON: Full score breakdown, cash flow, transactions, loan offer.
        404: If the worker_id doesn't match any profile file.
        500: If scoring calculation fails.
    """
    filepath = os.path.join(DATA_DIR, f"{worker_id}.json")
    if not os.path.exists(filepath):
        return jsonify({"error": f"Profile '{worker_id}' not found"}), 404

    try:
        with open(filepath, 'r') as f:
            data = json.load(f)

        result = engine.calculate(
            data.get('transactions', []),
            data.get('tenure_months', 0)
        )

        # Merge basic profile metadata into the result
        result["id"] = data.get("worker_id")
        result["name"] = data.get("name")
        result["platform"] = data.get("platform")
        result["tenure"] = f"{data.get('tenure_months')} months"
        result["lastUpdated"] = "Just now"

        logger.info(f"  Scored {data.get('name')}: GigScore={result['score']}")
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error scoring {worker_id}: {str(e)}")
        return jsonify({"error": "Failed to calculate score"}), 500


@app.route('/api/score/custom', methods=['POST'])
def calculate_custom_score():
    """
    Accept arbitrary transaction data and return a GigScore.
    This endpoint demonstrates that the engine works on ANY data,
    not just hardcoded profiles — important for judge credibility.

    Expected JSON body:
        {
            "transactions": [...],
            "tenure_months": 12
        }

    Returns:
        JSON: Full score breakdown for the custom data.
        400: If the request body is malformed.
    """
    try:
        body = request.get_json()
        if not body or 'transactions' not in body:
            return jsonify({
                "error": "Missing 'transactions' array in request body"
            }), 400

        tenure = body.get('tenure_months', 0)
        transactions = body.get('transactions', [])

        result = engine.calculate(transactions, tenure)
        logger.info(f"  Custom score calculated: GigScore={result['score']}")
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Custom score error: {str(e)}")
        return jsonify({"error": "Invalid request payload"}), 400


@app.route('/api/ai-coach', methods=['POST'])
def ai_coach():
    """
    Proxy Gemini AI requests through the backend to manage rate limits.
    Expects JSON body: { systemPrompt, history, message }
    """
    try:
        body = request.get_json()
        system_prompt = body.get('systemPrompt', '')
        history = body.get('history', [])
        message = body.get('message', '')

        if not message:
            return jsonify({"error": "No message provided"}), 400

        # Build the chat with system instruction
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=system_prompt
        )

        # Convert history to Gemini format
        gemini_history = []
        for msg in history:
            gemini_history.append({
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [msg["text"]]
            })

        chat = model.start_chat(history=gemini_history)

        # Retry with backoff for rate limits
        max_retries = 4
        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    wait_time = (2 ** attempt) * 2  # 4s, 8s, 16s
                    logger.info(f"  AI Coach: retry #{attempt}, waiting {wait_time}s...")
                    time.sleep(wait_time)

                response = chat.send_message(message)
                reply = response.text
                logger.info(f"  AI Coach responded ({len(reply)} chars)")
                return jsonify({"reply": reply}), 200

            except Exception as retry_err:
                err_str = str(retry_err)
                if "429" in err_str and attempt < max_retries - 1:
                    continue  # Retry on rate limit
                raise  # Re-raise other errors or final retry

    except Exception as e:
        logger.error(f"AI Coach error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ============================================================
# ENTRY POINT
# ============================================================
if __name__ == '__main__':
    print("\n" + "=" * 50)
    print("  GigScore Engine API v1.0")
    print("  Running on http://localhost:5000")
    print("=" * 50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
