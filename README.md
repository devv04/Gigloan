
# 🚀 GigScore (formerly Gigloan)

**GigSKore** is an AI-powered financial health and alternative credit-scoring platform designed specifically for the Indian gig economy. By analyzing alternative data streams—like platform payouts, transaction trends, and expense ratios—we empower Zomato riders, Urban Company technicians, and freelancers to build credit and unlock fair loan opportunities without relying on traditional CIBIL scores.


## ✨ Core Features

- **Alternative Credit Scoring Engine:** Generates a dynamic "GigScore" (up to 850) based on realistic gig worker metrics such as platform tenure, payout consistency, and expense-to-income ratios.
- **Account Aggregator Simulation:** Realistic UI flow that connects the user's bank account to draw in continuous transaction data.
- **Financial Dashboard:** A premium, fully-animated dashboard displaying real-time financial health, tax savings, loan eligibility, and risk levels.
- **AI Financial Coach:** A smart, conversational AI assistant (powered by Google Gemini 2.5) that uses the worker's exact financial profile to give personalized, actionable advice in conversational English / Hinglish.
- **Synthetic Data Generation:** Includes a robust Python engine (`synthetic_data.py`) out of the box that creates 90-day transaction realistic prototypes for varying risk profiles.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Lucide Icons (Responsive, highly-animated glassmorphic design)
- **Backend:** Python, Flask, Pandas (Statistical scoring, API routing, rate-limiting)
- **Generative AI:** `google-generativeai` package using Gemini Flash models
- **Architecture Flow:** React Frontend ⟷ Flask RESTful API ⟷ Gemini AI / Scoring Engine

---

## ⚙️ Local Development Setup

### 1. Clone the repository

git clone https://github.com/your-username/GigSKore.git
cd GigSKore


### 2. Set up the Python Backend
Open a terminal and navigate to the backend folder:
cd gigscore-backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install the dependencies
pip install -r requirements.txt


### 3. Environment Variables
In the **root directory** of the project (`GigSKore/`), create a `.env` file and add your Google Gemini API key:

# .env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here


### 4. Run the Backend Server
From the `gigscore-backend` directory, start the API:
python app.py

> The Flask server will run at `http://localhost:5000`

### 5. Start the React Frontend
Open a **new terminal tab** from the root `GigSKore/` directory:

npm install
npm run dev

> The Vite development server will open your app at `http://localhost:5173`

---

## 📊 How the Scoring Engine Works

The backend `scoring_engine.py` dynamically calculates a user's risk profile using weighted categories:
- **Income Consistency (35%):** Analyzes variance and frequency of weekly payouts.
- **Income Trend (25%):** Rewards users with growing monthly incomes month-over-month.
- **Tenure (20%):** Higher scores for those who have weathered the platform for >12 months.
- **Expense Ratio (20%):** Checks daily expenditures to ensure borrowers aren't over-leveraged.

Users are categorized into three distinct buckets: **Low Risk (Green), Moderate Risk (Orange), and High Risk / Building Credit (Red)**.

---

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
