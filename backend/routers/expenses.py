from fastapi import APIRouter, HTTPException
from typing import List, Optional
from database.db import get_db
from models.schemas import TransactionCreate

router = APIRouter()

@router.get("/")
def get_transactions(type: Optional[str] = None, category: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM transactions WHERE 1=1"
    params = []
    if type:
        query += " AND type = ?"
        params.append(type)
    if category:
        query += " AND category = ?"
        params.append(category)
    query += " ORDER BY date DESC, created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/")
def create_transaction(transaction: TransactionCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transactions (title, amount, type, category, date, note)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (transaction.title, transaction.amount, transaction.type,
          transaction.category, transaction.date, transaction.note))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row)

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM transactions WHERE id = ?", (transaction_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")
    cursor.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
    conn.commit()
    conn.close()
    return {"message": "Transaction deleted successfully"}

@router.get("/summary")
def get_summary():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type='income'")
    total_income = cursor.fetchone()[0]
    cursor.execute("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type='expense'")
    total_expense = cursor.fetchone()[0]
    conn.close()
    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "balance": round(total_income - total_expense, 2)
    }