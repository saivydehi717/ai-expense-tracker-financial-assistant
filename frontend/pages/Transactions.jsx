import { useState, useEffect } from 'react'
import { getTransactions, deleteTransaction } from '../utils/api'
import TransactionItem from '../components/TransactionItem'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTransactions()
      setTransactions(res.data)
    } catch (e) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = [...transactions]
    if (search) result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    if (typeFilter) result = result.filter(t => t.type === typeFilter)
    if (categoryFilter) result = result.filter(t => t.category === categoryFilter)
    setFiltered(result)
  }, [transactions, search, typeFilter, categoryFilter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    try {
      await deleteTransaction(id)
      toast.success('Deleted!')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <p className="text-gray-400 text-sm mt-1">{filtered.length} records found</p>
      </div>
      <div className="glass-card p-4 flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..." className="input-field pl-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-40">
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field w-48">
          <option value="">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || typeFilter || categoryFilter) && (
          <button onClick={() => { setSearch(''); setTypeFilter(''); setCategoryFilter('') }}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl hover:border-white/20 transition-all">
            Clear
          </button>
        )}
      </div>
      <div className="glass-card divide-y divide-white/5">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-gray-400">No transactions found</p>
            <p className="text-gray-600 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map(t => <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}