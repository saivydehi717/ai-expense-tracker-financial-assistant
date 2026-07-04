import { useState, useEffect } from 'react'
import { getCategoryAnalytics, getMonthlyTrends, getSummary } from '../utils/api'
import { formatCurrency, CATEGORY_COLORS } from '../utils/constants'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

export default function Analytics() {
  const [categories, setCategories] = useState([])
  const [monthly, setMonthly] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCategoryAnalytics(), getMonthlyTrends(), getSummary()])
      .then(([c, m, s]) => {
        setCategories(c.data)
        setMonthly(m.data)
        setSummary(s.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const tooltipStyle = {
    contentStyle: { background: '#16213E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const savingsRate = summary?.total_income > 0
    ? (((summary.total_income - summary.total_expense) / summary.total_income) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">Visual breakdown of your finances</p>
      </div>
      {summary && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Savings Rate</span>
            <span className={`font-bold text-lg ${savingsRate >= 0 ? 'text-success' : 'text-accent'}`}>
              {savingsRate}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${savingsRate >= 0 ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${Math.min(Math.abs(savingsRate), 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You saved {formatCurrency(summary.balance)} out of {formatCurrency(summary.total_income)} earned
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
          {categories.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No expense data</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} innerRadius={45}>
                  {categories.map((e, i) => <Cell key={i} fill={CATEGORY_COLORS[e.category] || '#6C63FF'} />)}
                </Pie>
                <Tooltip formatter={(v) => [`Rs${v.toLocaleString('en-IN')}`, '']} {...tooltipStyle} />
                <Legend formatter={(v) => <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Top Expenses</h3>
          {categories.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No expense data</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categories.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `Rs${v}`} />
                <YAxis dataKey="category" type="category" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={90} />
                <Tooltip formatter={(v) => [`Rs${v.toLocaleString('en-IN')}`, 'Amount']} {...tooltipStyle} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {categories.slice(0, 6).map((e, i) => <Cell key={i} fill={CATEGORY_COLORS[e.category] || '#6C63FF'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">Monthly Income vs Expenses</h3>
        {monthly.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={v => `Rs${v}`} />
              <Tooltip formatter={(v, n) => [`Rs${Number(v).toLocaleString('en-IN')}`, n]} {...tooltipStyle} />
              <Legend formatter={(v) => <span style={{ color: '#9CA3AF', fontSize: '12px', textTransform: 'capitalize' }}>{v}</span>} />
              <Bar dataKey="income" fill="#43D9A2" radius={[4,4,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#FF6584" radius={[4,4,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}