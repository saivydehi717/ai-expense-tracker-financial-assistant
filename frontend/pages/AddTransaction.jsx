import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTransaction } from '../utils/api'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants'
import toast from 'react-hot-toast'
import { PlusCircle } from 'lucide-react'

export default function AddTransaction() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense',
    category: '', date: new Date().toISOString().split('T')[0], note: ''
  })

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {})
    }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) {
      toast.error('Please fill all required fields')
      return
    }
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      toast.error('Amount must be a positive number')
      return
    }
    setLoading(true)
    try {
      await createTransaction({ ...form, amount: parseFloat(form.amount) })
      toast.success('Transaction added successfully! 🎉')
      navigate('/')
    } catch (e) {
      toast.error('Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
        <p className="text-gray-400 text-sm mt-1">Record a new income or expense</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        {/* Type Toggle */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Transaction Type *</label>
          <div className="flex gap-3">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => setForm(prev => ({ ...prev, type: t, category: '' }))}
                className={`flex-1 py-3 rounded-xl font-semibold capitalize transition-all border ${
                  form.type === t
                    ? t === 'expense'
                      ? 'bg-accent/20 border-accent/40 text-accent'
                      : 'bg-success/20 border-success/40 text-success'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {t === 'expense' ? '💸 Expense' : '💰 Income'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Title *</label>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="e.g., Lunch at Café, Monthly Salary"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Amount (₹) *</label>
            <input
              name="amount" value={form.amount} onChange={handleChange}
              type="number" placeholder="0.00" min="0" step="0.01"
              className="input-field"
            />
          </div>
          {/* Date */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Date *</label>
            <input name="date" value={form.date} onChange={handleChange} type="date" className="input-field" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Note (optional)</label>
          <textarea
            name="note" value={form.note} onChange={handleChange}
            placeholder="Any additional details..."
            rows={3} className="input-field resize-none"
          />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><PlusCircle size={20} /> Add Transaction</>
          )}
        </button>
      </div>
    </div>
  )
}