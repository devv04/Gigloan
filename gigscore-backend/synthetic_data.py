"""
Synthetic Data Generator for GigScore
======================================
Generates 90 days of realistic transaction data for 3 Indian gig worker
profiles, each designed to demonstrate a different risk tier.

Target GigScore Ranges:
- Raju Sharma (Zomato):       720-760 → Low Risk (Green)
- Priya Mehta (Freelance):    580-640 → Moderate Risk (Orange)
- Arjun Nair (Urban Company): 420-500 → High Risk (Red)
"""

import json
import os
import random
import calendar
from datetime import datetime, timedelta

# ============================================================
# GENERATION CONSTANTS
# ============================================================
DAYS_HISTORY: int = 90
END_DATE: datetime = datetime(2026, 3, 26)
START_DATE: datetime = END_DATE - timedelta(days=DAYS_HISTORY)


def get_random_date_in_month(year: int, month: int) -> datetime:
    """Return a random date within the given year and month."""
    days_in_month = calendar.monthrange(year, month)[1]
    day = random.randint(1, days_in_month)
    return datetime(year, month, day)


def generate_raju() -> dict:
    """
    Profile 1: Raju Sharma — Zomato Rider
    Target GigScore: ~720-760 (Low Risk)

    Characteristics:
    - Consistent weekly payouts with low variance
    - Growing income (+5% month-on-month)
    - 24 months tenure (excellent)
    - Low expense ratio (~35-40%)
    """
    transactions: list[dict] = []
    current_date = START_DATE
    month_tracker = -1
    month_index = 0

    while current_date <= END_DATE:
        if current_date.month != month_tracker:
            month_tracker = current_date.month
            month_index += 1

            # Fixed monthly costs
            transactions.append({
                "date": f"{current_date.year}-{current_date.month:02d}-02",
                "description": "House Rent",
                "amount": 4500,
                "type": "debit",
                "category": "rent"
            })
            transactions.append({
                "date": f"{current_date.year}-{current_date.month:02d}-05",
                "description": "Bike EMI - Bajaj Finance",
                "amount": 2100,
                "type": "debit",
                "category": "emi"
            })

            # 2-3 bonuses per month (surge incentives)
            for _ in range(random.randint(2, 3)):
                b_date = get_random_date_in_month(current_date.year, current_date.month)
                if START_DATE <= b_date <= END_DATE:
                    transactions.append({
                        "date": b_date.strftime("%Y-%m-%d"),
                        "description": "Zomato Surge Bonus",
                        "amount": random.randint(400, 800),
                        "type": "credit",
                        "category": "bonus"
                    })

        # Weekly payouts every 7 days — CONSISTENT with low variance (±10%)
        if (current_date - START_DATE).days % 7 == 0:
            growth_mult = 1.0 + (0.05 * month_index)  # +5% per month
            base_payout = int(5200 * growth_mult)
            variance = random.uniform(0.92, 1.08)  # Tight ±8% variance for consistency
            transactions.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "description": "Zomato Weekly Payout",
                "amount": int(base_payout * variance),
                "type": "credit",
                "category": "platform_income"
            })

        # Daily expenses — LOW frequency and amount (maintaining ~35% expense ratio)
        if random.random() > 0.6:  # Only 40% chance of daily expense
            exp_type = random.choice(["Fuel - HPCL", "Food / Snacks", "Mobile Recharge", "Grocery"])
            cat_map = {"Fuel - HPCL": "fuel", "Food / Snacks": "food",
                       "Mobile Recharge": "recharge", "Grocery": "grocery"}
            transactions.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "description": exp_type,
                "amount": random.randint(40, 250),  # Low daily expenses
                "type": "debit",
                "category": cat_map[exp_type]
            })

        current_date += timedelta(days=1)

    return {
        "worker_id": "raju",
        "name": "Raju Sharma",
        "platform": "Zomato",
        "tenure_months": 24,
        "transactions": sorted(transactions, key=lambda x: x['date'], reverse=True)
    }


def generate_priya() -> dict:
    """
    Profile 2: Priya Mehta — Freelance Designer
    Target GigScore: ~580-640 (Moderate Risk)

    Characteristics:
    - Irregular income timing (2 big chunks OR 5 small ones)
    - Flat income trend (no growth)
    - 8 months tenure (fair)
    - Higher expense ratio (~55-65%)
    """
    transactions: list[dict] = []
    current_date = START_DATE
    month_tracker = -1

    while current_date <= END_DATE:
        if current_date.month != month_tracker:
            month_tracker = current_date.month

            # Fixed costs
            transactions.append({
                "date": f"{current_date.year}-{current_date.month:02d}-03",
                "description": "House Rent - Koramangala",
                "amount": 12000,
                "type": "debit",
                "category": "rent"
            })

            # Irregular income — sometimes 2 big, sometimes 4-5 small
            mode = random.choice(["chunks", "scattered"])
            if mode == "chunks":
                for _ in range(2):
                    t_date = get_random_date_in_month(current_date.year, current_date.month)
                    if START_DATE <= t_date <= END_DATE:
                        transactions.append({
                            "date": t_date.strftime("%Y-%m-%d"),
                            "description": "Upwork Client Transfer",
                            "amount": int(17000 * random.uniform(0.85, 1.15)),
                            "type": "credit",
                            "category": "platform_income"
                        })
            else:
                for _ in range(random.randint(4, 5)):
                    t_date = get_random_date_in_month(current_date.year, current_date.month)
                    if START_DATE <= t_date <= END_DATE:
                        transactions.append({
                            "date": t_date.strftime("%Y-%m-%d"),
                            "description": "Client Transfer - Design Project",
                            "amount": int(6800 * random.uniform(0.75, 1.25)),
                            "type": "credit",
                            "category": "platform_income"
                        })

            # Higher lifestyle expenses — food delivery, shopping, transport
            for _ in range(random.randint(18, 25)):
                exp_date = get_random_date_in_month(current_date.year, current_date.month)
                if START_DATE <= exp_date <= END_DATE:
                    desc = random.choice([
                        "Swiggy Order", "Amazon Shopping", "Uber Trip",
                        "Grocery - BigBasket", "Zara Purchase", "Starbucks"
                    ])
                    transactions.append({
                        "date": exp_date.strftime("%Y-%m-%d"),
                        "description": desc,
                        "amount": random.randint(200, 1200),
                        "type": "debit",
                        "category": random.choice(["food", "other", "grocery"])
                    })

        current_date += timedelta(days=1)

    return {
        "worker_id": "priya",
        "name": "Priya Mehta",
        "platform": "Freelance Designer",
        "tenure_months": 8,
        "transactions": sorted(transactions, key=lambda x: x['date'], reverse=True)
    }


def generate_arjun() -> dict:
    """
    Profile 3: Arjun Nair — Urban Company Technician
    Target GigScore: ~420-500 (High Risk / Building Credit)

    Characteristics:
    - Declining income (-10% per month)
    - Very short tenure (3 months)
    - High expense ratio (~75%+)
    - New to platform = high churn risk
    """
    transactions: list[dict] = []
    current_date = START_DATE
    month_tracker = -1
    month_index = 0
    month_multiplier = 1.0

    while current_date <= END_DATE:
        if current_date.month != month_tracker:
            if month_tracker != -1:
                month_multiplier -= 0.10  # Aggressive -10% monthly decline
            month_tracker = current_date.month
            month_index += 1

            # Rent
            transactions.append({
                "date": f"{current_date.year}-{current_date.month:02d}-05",
                "description": "Room Rent - Shared PG",
                "amount": 5500,
                "type": "debit",
                "category": "rent"
            })

        # Weekly payouts — declining
        if (current_date - START_DATE).days % 7 == 0:
            base = int(3100 * max(month_multiplier, 0.3))  # Floor at 30%
            variance = random.uniform(0.85, 1.15)
            transactions.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "description": "Urban Company Weekly Payout",
                "amount": int(base * variance),
                "type": "credit",
                "category": "platform_income"
            })

        # HIGH daily expenses — 75% chance, higher amounts
        if random.random() > 0.25:
            desc = random.choice([
                "Tools / Hardware", "Auto Fare", "Food - Dhaba",
                "Informal Loan Repayment", "Phone Repair", "Cigarettes"
            ])
            transactions.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "description": desc,
                "amount": random.randint(150, 700),
                "type": "debit",
                "category": "other"
            })

        current_date += timedelta(days=1)

    return {
        "worker_id": "arjun",
        "name": "Arjun Nair",
        "platform": "Urban Company",
        "tenure_months": 3,
        "transactions": sorted(transactions, key=lambda x: x['date'], reverse=True)
    }


def main() -> None:
    """Generate all 3 synthetic profiles and write to /data/ directory."""
    os.makedirs("data", exist_ok=True)

    profiles = [generate_raju(), generate_priya(), generate_arjun()]

    for p in profiles:
        filepath = f"data/{p['worker_id']}.json"
        with open(filepath, "w") as f:
            json.dump(p, f, indent=2)
        print(f"  ✓ Generated {p['name']} → {filepath}")

    print("\n✅ All synthetic profiles generated in /data/ directory.")


if __name__ == "__main__":
    main()
