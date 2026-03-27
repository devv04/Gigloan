# GigScore Engine Backend

This is the Python Flask backend for the GigScore application, powering the micro-credit scoring engine for Indian gig workers. 

## Structure
- `app.py`: Main Flask API
- `scoring_engine.py`: GigScore calculation logic
- `synthetic_data.py`: Dataset generator
- `data/`: Contains JSON synthetic data for profiles
- `requirements.txt`: Dependencies

## How to run
1. Initialize the virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate # (or .\venv\Scripts\Activate on Windows)
   pip install -r requirements.txt
   ```
2. Generate synthetic data:
   ```bash
   python synthetic_data.py
   ```
3. Start the Flask APIs:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

## API Endpoints

### 1. `GET /api/health`
Check if the API is running correctly.
```bash
curl http://localhost:5000/api/health
```

### 2. `GET /api/profiles`
Returns a list of all existing worker profiles for demo selection.
```bash
curl http://localhost:5000/api/profiles
```

### 3. `GET /api/score/<worker_id>`
Loads the worker's transactions from the `/data/` folder, runs the `GigScoreEngine`, and returns the full score breakdown.
```bash
curl http://localhost:5000/api/score/raju
```
**Sample Response Segment:**
```json
{
  "avgIncome": "₹21,500",
  "cashFlow": [
    { "expense": 12500, "income": 20400, "month": "Dec" }
  ],
  "loanEligibility": "₹17,000",
  "score": 752,
  "scoreBreakdown": {
    "consistency": {"color": "positive", "score": 80, "text": "Based on payout variance"},
    "trend": {"color": "positive", "score": 100, "text": "14.2% recent growth"}
  }
}
```

### 4. `POST /api/score/custom`
Accepts raw transaction JSON in request body, runs the scoring engine on it, and returns the computed score details.

## Scoring Formula Details
The `GigScoreEngine` maps financial health onto a 300 to 850 score distribution, analogous to a CIBIL score. 

### Weighted Criteria:
1. **Income Consistency (35%)**: Calculates the Coefficient of Variation (CoV) of monthly income from core platform earnings. Lower CoV indicates higher stability.
2. **Income Trend (25%)**: Evaluates percentage growth between earliest and latest recorded month. Positive growth yields higher scores.
3. **Platform Tenure (20%)**: Longer tenure (over 24 months) gives the maximum score in this category.
4. **Expense Ratio (20%)**: Calculates the percentage ratio of operational/personal expenses against total income. A ratio under 40% is considered optimal.

The weighted percentage acts as a coefficient to map against the 300-850 range limit.
