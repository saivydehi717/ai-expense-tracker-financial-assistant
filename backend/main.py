from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from routers import expenses, analytics, ai_chat

app = FastAPI(title="AI Expense Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(ai_chat.router, prefix="/api/chat", tags=["AI Chat"])

@app.get("/")
def root():
    return {"message": "AI Expense Tracker API is running"}