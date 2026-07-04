from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: str
    category: str
    date: str
    note: Optional[str] = ""

class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    type: str
    category: str
    date: str
    note: str
    created_at: str

class ChatMessage(BaseModel):
    message: str