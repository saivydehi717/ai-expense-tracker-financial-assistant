import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, ArrowRight, Bot } from 'lucide-react'
import { getSummary, getRecentTransactions, getCategoryAnalytics } from '../utils/api'
import SummaryCards from '../components/SummaryCards'
import TransactionItem from '../components/TransactionItem'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORY_COLORS } from '../utils/constants'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r, c] = await Promise.all([getSummary(), getRecentTransactions(), getCategoryAnalytics()])
        setSummary(s.data)
        setRecent(r.data)
        setCategories(c.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Your financial overview</p>
        </div>
        <Link to="/add" className="btn-primary">
          <PlusCircle size={18} /> Add Transaction
        </Link>
      </div>
      <SummaryCards summary={summary} />
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Transactions</h3>
            <Link to="/transactions" className="text-primary text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No transactions yet</p>
              <Link to="/add" className="text-primary text-sm hover:underline mt-2 block">Add your first one</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map(t => <TransactionItem key={t.id} transaction={t} />)}
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
          {categories.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm">No expense data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {categories.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.category] || '#6C63FF'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ background: '#16213E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(val) => <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <Link to="/chat" className="glass-card p-5 flex items-center gap-4 border-primary/30 hover:border-primary/60 transition-all cursor-pointer block">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bot size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">Ask your AI Financial Assistant</p>
          <p className="text-sm text-gray-400">Get personalized insights powered by Gemini</p>
        </div>
        <ArrowRight size={20} className="text-primary" />
      </Link>
    </div>
  )
}