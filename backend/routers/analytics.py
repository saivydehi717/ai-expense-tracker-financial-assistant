from fastapi import APIRouter
from database.db import get_db

router = APIRouter()

# -----------------------------
# Spending by Category
# -----------------------------
@router.get("/by-category")
def spending_by_category():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT category, SUM(amount) as total
        FROM transactions
        WHERE type = 'expense'
        GROUP BY category
        ORDER BY total DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "category": row["category"],
            "total": round(row["total"], 2)
        }
        for row in rows
    ]


# -----------------------------
# Monthly Income vs Expense
# -----------------------------
@router.get("/monthly")
def monthly_trends():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            strftime('%Y-%m', date) as month,
            type,
            SUM(amount) as total
        FROM transactions
        GROUP BY month, type
        ORDER BY month ASC
    """)

    rows = cursor.fetchall()
    conn.close()

    monthly = {}

    for row in rows:
        month = row["month"]

        if month not in monthly:
            monthly[month] = {
                "month": month,
                "income": 0,
                "expense": 0
            }

        monthly[month][row["type"]] = round(row["total"], 2)

    return list(monthly.values())


# -----------------------------
# Recent Transactions
# -----------------------------
@router.get("/recent")
def recent_transactions():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM transactions
        ORDER BY date DESC, created_at DESC
        LIMIT 5
    """)

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


# -----------------------------
# Financial Health Score
# -----------------------------
@router.get("/health-score")
def financial_health_score():

    conn = get_db()
    cursor = conn.cursor()

    # Total Income
    cursor.execute("""
        SELECT COALESCE(SUM(amount),0) AS total
        FROM transactions
        WHERE type='income'
    """)
    income = cursor.fetchone()["total"]

    # Total Expense
    cursor.execute("""
        SELECT COALESCE(SUM(amount),0) AS total
        FROM transactions
        WHERE type='expense'
    """)
    expense = cursor.fetchone()["total"]

    conn.close()

    if income == 0:
        return {
            "score": 0,
            "status": "No Data",
            "income": 0,
            "expense": expense,
            "savings": 0,
            "savings_rate": 0
        }

    savings = income - expense
    savings_rate = (savings / income) * 100

    score = 0

    # Savings Rate (40 Marks)
    if savings_rate >= 30:
        score += 40
    elif savings_rate >= 20:
        score += 30
    elif savings_rate >= 10:
        score += 20
    else:
        score += 10

    # Expense Control (30 Marks)
    if expense <= income:
        score += 30
    else:
        score += 10

    # Income Stability (30 Marks)
    score += 30

    # Status
    if score >= 80:
        status = "Excellent"
        color = "green"
    elif score >= 60:
        status = "Good"
        color = "blue"
    elif score >= 40:
        status = "Average"
        color = "orange"
    else:
        status = "Poor"
        color = "red"

    return {
        "score": score,
        "status": status,
        "color": color,
        "income": round(income, 2),
        "expense": round(expense, 2),
        "savings": round(savings, 2),
        "savings_rate": round(savings_rate, 2)
    }