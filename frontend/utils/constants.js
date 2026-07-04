export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Rent",
  "Travel",
  "Other"
]

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other"
]

export const CATEGORY_COLORS = {
  "Food & Dining": "#FF6584",
  "Transport": "#6C63FF",
  "Shopping": "#FFB347",
  "Entertainment": "#43D9A2",
  "Healthcare": "#4FC3F7",
  "Education": "#CE93D8",
  "Utilities": "#80CBC4",
  "Rent": "#FF8A65",
  "Travel": "#F06292",
  "Salary": "#43D9A2",
  "Freelance": "#6C63FF",
  "Investment": "#FFB347",
  "Business": "#4FC3F7",
  "Other": "#90A4AE",
}

export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`