import { Trash2 } from 'lucide-react'
import { formatCurrency, CATEGORY_COLORS } from '../utils/constants'

export default function TransactionItem({ transaction, onDelete }) {
  const isExpense = transaction.type === 'expense'
  const color = CATEGORY_COLORS[transaction.category] || '#90A4AE'

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
      {/* Category dot */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: color + '20', border: `1px solid ${color}40` }}
      >
        {getCategoryEmoji(transaction.category)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{transaction.title}</p>
        <p className="text-xs text-gray-500">{transaction.category} · {transaction.date}</p>
      </div>

      {/* Amount */}
      <p className={`font-bold text-base ${isExpense ? 'text-accent' : 'text-success'}`}>
        {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
      </p>

      {/* Delete */}
      {onDelete && (
        <button
          onClick={() => onDelete(transaction.id)}
          className="btn-danger opacity-0 group-hover:opacity-100 ml-2"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}

function getCategoryEmoji(category) {
  const map = {
    'Food & Dining': '🍔', 'Transport': '🚗', 'Shopping': '🛍️',
    'Entertainment': '🎬', 'Healthcare': '💊', 'Education': '📚',
    'Utilities': '⚡', 'Rent': '🏠', 'Travel': '✈️',
    'Salary': '💼', 'Freelance': '💻', 'Investment': '📈',
    'Business': '🏢', 'Gift': '🎁', 'Other': '💰',
  }
  return map[category] || '💰'
}