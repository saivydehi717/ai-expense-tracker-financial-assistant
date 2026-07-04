from fastapi import APIRouter, HTTPException
from models.schemas import ChatMessage
from database.db import get_db
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_financial_context():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COALESCE(SUM(amount),0) FROM transactions WHERE type='income'")
    income = cursor.fetchone()[0]
    cursor.execute("SELECT COALESCE(SUM(amount),0) FROM transactions WHERE type='expense'")
    expense = cursor.fetchone()[0]
    cursor.execute("""
        SELECT category, SUM(amount) as total
        FROM transactions WHERE type='expense'
        GROUP BY category ORDER BY total DESC LIMIT 5
    """)
    top_cats = cursor.fetchall()
    cursor.execute("""
        SELECT title, amount, type, category, date
        FROM transactions ORDER BY date DESC LIMIT 10
    """)
    recent = cursor.fetchall()
    conn.close()

    context = f"""
    USER FINANCIAL SUMMARY:
    - Total Income: ₹{round(income, 2)}
    - Total Expenses: ₹{round(expense, 2)}
    - Current Balance: ₹{round(income - expense, 2)}

    TOP SPENDING CATEGORIES:
    {chr(10).join([f"- {r['category']}: ₹{round(r['total'],2)}" for r in top_cats])}

    RECENT TRANSACTIONS (last 10):
    {chr(10).join([f"- {r['date']} | {r['type'].upper()} | {r['title']} | {r['category']} | ₹{r['amount']}" for r in recent])}
    """
    return context

@router.post("/")
async def chat_with_ai(body: ChatMessage):
    try:
        context = get_financial_context()
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are a smart personal financial assistant. You have access to the user's real expense data below.
Answer their question helpfully, give specific insights based on their actual data, and suggest improvements.
Be friendly, concise, and use ₹ for currency.

{context}

User Question: {body.message}
"""
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")