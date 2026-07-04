import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/constants'

export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Balance',
      value: summary?.balance ?? 0,
      icon: Wallet,
      color: summary?.balance >= 0 ? 'text-success' : 'text-accent',
      bg: summary?.balance >= 0 ? 'bg-success/10 border-success/20' : 'bg-accent/10 border-accent/20',
    },
    {
      label: 'Total Income',
      value: summary?.total_income ?? 0,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10 border-success/20',
    },
    {
      label: 'Total Expenses',
      value: summary?.total_expense ?? 0,
      icon: TrendingDown,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`glass-card p-6 border ${bg}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</p>
        </div>
      ))}
    </div>
  )
}