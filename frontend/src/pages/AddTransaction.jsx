import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  Wallet,
  Calendar,
  FileText,
  IndianRupee,
  Save,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react"

import { createTransaction } from "../utils/api"

const EXPENSE_CATEGORIES = [
  { name: "Food & Dining", emoji: "🍔", color: "from-pink-500 to-red-500" },
  { name: "Transport", emoji: "🚗", color: "from-blue-500 to-cyan-500" },
  { name: "Shopping", emoji: "🛍️", color: "from-yellow-500 to-orange-500" },
  { name: "Entertainment", emoji: "🎬", color: "from-purple-500 to-indigo-500" },
  { name: "Healthcare", emoji: "💊", color: "from-green-500 to-emerald-500" },
  { name: "Education", emoji: "📚", color: "from-violet-500 to-fuchsia-500" },
  { name: "Utilities", emoji: "⚡", color: "from-cyan-500 to-sky-500" },
  { name: "Rent", emoji: "🏠", color: "from-red-500 to-rose-500" },
  { name: "Travel", emoji: "✈️", color: "from-pink-500 to-purple-500" },
  { name: "Other", emoji: "💰", color: "from-slate-500 to-gray-500" }
]

const INCOME_CATEGORIES = [
  { name: "Salary", emoji: "💼" },
  { name: "Freelance", emoji: "💻" },
  { name: "Investment", emoji: "📈" },
  { name: "Business", emoji: "🏢" },
  { name: "Gift", emoji: "🎁" },
  { name: "Other", emoji: "💰" }
]

export default function AddTransaction() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().split("T")[0],
    note: ""
  })

  const categories =
    form.type === "expense"
      ? EXPENSE_CATEGORIES
      : INCOME_CATEGORIES

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const selectCategory = (cat) => {
    setForm({
      ...form,
      category: cat
    })
  }

  const changeType = (type) => {
    setForm({
      ...form,
      type,
      category:
        type === "expense"
          ? "Food & Dining"
          : "Salary"
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    try {

      await createTransaction({
        ...form,
        amount: Number(form.amount)
      })

      navigate("/")

    } catch (err) {

      console.log(err)
      alert("Unable to save transaction.")

    } finally {

      setLoading(false)

    }

  }
  return (

<div className="min-h-screen bg-gradient-to-br from-[#070B1A] via-[#111827] to-[#1E1B4B] py-10 px-5">

<form
onSubmit={handleSubmit}
className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
>

{/* Header */}

<div className="relative px-10 py-8 border-b border-white/10">

<div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/10 to-cyan-600/20"></div>

<div className="relative flex items-center justify-between">

<div className="flex items-center gap-5">

<button
type="button"
onClick={() => navigate(-1)}
className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
>

<ArrowLeft className="text-white"/>

</button>

<div>

<h1 className="text-5xl font-black text-white">

Add Transaction

</h1>

<p className="text-gray-300 mt-2 text-lg">

Record a new
<span className="text-green-400 font-semibold"> income </span>
or
<span className="text-pink-400 font-semibold"> expense</span>

</p>

</div>

</div>

<div className="hidden md:block text-8xl">
💰
</div>

</div>

</div>

{/* Body */}

<div className="p-10 space-y-10">

{/* Transaction Type */}

<div>

<h2 className="text-white font-bold text-xl mb-5">

1. Transaction Type

</h2>

<div className="grid md:grid-cols-2 gap-6">

<button
type="button"
onClick={() => changeType("expense")}
className={`rounded-3xl p-6 border transition-all duration-300 ${
form.type==="expense"
?
"bg-gradient-to-r from-pink-500 to-rose-600 border-pink-400 shadow-xl shadow-pink-500/40 scale-105"
:
"bg-white/5 border-white/10 hover:border-pink-400"
}`}
>

<div className="flex items-center justify-between">

<div className="flex items-center gap-4">

<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">

<ArrowDownCircle size={34} className="text-white"/>

</div>

<div className="text-left">

<h3 className="text-white text-2xl font-bold">

Expense

</h3>

<p className="text-pink-100">

Money you spend

</p>

</div>

</div>

{form.type==="expense" &&

<div className="text-3xl">
✅
</div>

}

</div>

</button>

<button
type="button"
onClick={() => changeType("income")}
className={`rounded-3xl p-6 border transition-all duration-300 ${
form.type==="income"
?
"bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 shadow-xl shadow-green-500/40 scale-105"
:
"bg-white/5 border-white/10 hover:border-green-400"
}`}
>

<div className="flex items-center justify-between">

<div className="flex items-center gap-4">

<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">

<ArrowUpCircle size={34} className="text-white"/>

</div>

<div className="text-left">

<h3 className="text-white text-2xl font-bold">

Income

</h3>

<p className="text-green-100">

Money you receive

</p>

</div>

</div>

{form.type==="income" &&

<div className="text-3xl">
✅
</div>

}

</div>

</button>

</div>

</div>

{/* Title */}

<div>

<label className="block text-white font-semibold text-xl mb-4">

2. Transaction Title

</label>

<div className="relative">

<FileText
size={22}
className="absolute left-6 top-1/2 -translate-y-1/2 text-violet-400"
/>

<input
type="text"
name="title"
value={form.title}
onChange={handleChange}
placeholder="Lunch, Salary, Freelance Project..."
className="w-full h-16 rounded-2xl bg-[#141A2F] border border-violet-500/30 focus:border-violet-400 outline-none text-white text-lg pl-16 pr-6"
/>

</div>

</div>
{/* Amount + Date */}

<div className="grid md:grid-cols-2 gap-6">

  {/* Amount */}

  <div>

    <label className="block text-white font-semibold text-xl mb-4">

      3. Amount (₹)

    </label>

    <div className="relative">

      <IndianRupee
        size={22}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-green-400"
      />

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="0.00"
        className="w-full h-16 rounded-2xl bg-[#141A2F] border border-green-500/30 focus:border-green-400 outline-none text-white text-lg pl-16 pr-6"
        required
      />

    </div>

  </div>

  {/* Date */}

  <div>

    <label className="block text-white font-semibold text-xl mb-4">

      4. Date

    </label>

    <div className="relative">

      <Calendar
        size={22}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full h-16 rounded-2xl bg-[#141A2F] border border-blue-500/30 focus:border-blue-400 outline-none text-white text-lg pl-16 pr-6"
      />

    </div>

  </div>

</div>

{/* Categories */}

<div>

  <label className="block text-white font-semibold text-xl mb-5">

    5. Category

  </label>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

    {categories.map((cat) => (

      <button
        key={cat.name}
        type="button"
        onClick={() => selectCategory(cat.name)}
        className={`rounded-2xl p-5 transition-all duration-300 border text-left hover:scale-105 ${
          form.category === cat.name
            ? `bg-gradient-to-r ${cat.color} border-white shadow-xl`
            : "bg-[#141A2F] border-white/10 hover:border-violet-400"
        }`}
      >

        <div className="flex items-center gap-3">

          <span className="text-3xl">

            {cat.emoji}

          </span>

          <span className="font-semibold text-white">

            {cat.name}

          </span>

        </div>

      </button>

    ))}

  </div>

</div>

{/* Note */}

<div>

  <label className="block text-white font-semibold text-xl mb-4">

    6. Note (Optional)

  </label>

  <textarea
    rows="5"
    name="note"
    value={form.note}
    onChange={handleChange}
    placeholder="Add a note about this transaction..."
    className="w-full rounded-2xl bg-[#141A2F] border border-violet-500/30 focus:border-violet-400 outline-none text-white p-5 resize-none"
  />

</div>
      {/* Action Buttons */}

      <div className="flex flex-col md:flex-row justify-end gap-5 pt-6 border-t border-white/10">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
        >

          {loading ? (

            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>

          ) : (

            <>
              <Save size={22} />
              Save Transaction
            </>

          )}

        </button>

      </div>

    </div>

  </form>

  {/* Bottom Decoration */}

  <div className="max-w-5xl mx-auto mt-8">

    <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 p-[1px]">

      <div className="rounded-3xl bg-[#0B1120] px-8 py-6 flex flex-col md:flex-row items-center justify-between">

        <div>

          <h3 className="text-2xl font-bold text-white">
            💡 Smart Finance Tip
          </h3>

          <p className="text-gray-300 mt-2">
            Record every transaction daily. Small expenses become big savings when tracked consistently.
          </p>

        </div>

        <div className="text-7xl mt-5 md:mt-0">
          💎
        </div>

      </div>

    </div>

  </div>

</div>

)

}