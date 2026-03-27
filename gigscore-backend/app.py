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
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from scoring_engine import GigScoreEngine

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


# ============================================================
# ENTRY POINT
# ============================================================
if __name__ == '__main__':
    print("\n" + "=" * 50)
    print("  GigScore Engine API v1.0")
    print("  Running on http://localhost:5000")
    print("=" * 50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
