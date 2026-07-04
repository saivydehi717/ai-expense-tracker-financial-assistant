import { useState, useEffect } from "react"
import { getCategoryAnalytics, getMonthlyTrends, getSummary } from "../utils/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = { "Food & Dining": "#FF6584", "Transport": "#6C63FF", "Shopping": "#FFB347", "Entertainment": "#43D9A2", "Healthcare": "#4FC3F7", "Education": "#CE93D8", "Utilities": "#80CBC4", "Rent": "#FF8A65", "Travel": "#F06292", "Other": "#90A4AE" }

export default function Analytics() {
  const [categories, setCategories] = useState([])
  const [monthly, setMonthly] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCategoryAnalytics(), getMonthlyTrends(), getSummary()])
      .then(([c, m, s]) => { setCategories(c.data); setMonthly(m.data); setSummary(s.data) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const savingsRate = summary?.total_income > 0 ? (((summary.total_income - summary.total_expense) / summary.total_income) * 100).toFixed(1) : 0
  const tooltipStyle = { contentStyle: { background: "#1A1A2E", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "12px", color: "#fff" } }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">Visual breakdown of your finances</p>
      </div>

      {summary && (
        <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(79,70,229,0.08))", border: "1px solid rgba(108,99,255,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">Savings Rate</p>
              <p className="text-gray-400 text-xs mt-0.5">How much you saved from your income</p>
            </div>
            <span className="text-3xl font-black" style={{ color: savingsRate >= 0 ? "#43D9A2" : "#FF6584" }}>{savingsRate}%</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-3 rounded-full transition-all duration-1000" style={{ width: Math.min(Math.abs(savingsRate), 100) + "%", background: savingsRate >= 0 ? "linear-gradient(90deg, #43D9A2, #16A34A)" : "linear-gradient(90deg, #FF6584, #FF4365)", boxShadow: savingsRate >= 0 ? "0 0 10px #43D9A250" : "0 0 10px #FF658450" }} />
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-xs text-gray-500">Income: <span className="text-emerald-400 font-semibold">Rs {summary.total_income?.toLocaleString("en-IN")}</span></p>
            <p className="text-xs text-gray-500">Expenses: <span className="text-rose-400 font-semibold">Rs {summary.total_expense?.toLocaleString("en-IN")}</span></p>
            <p className="text-xs text-gray-500">Saved: <span className="text-violet-400 font-semibold">Rs {summary.balance?.toLocaleString("en-IN")}</span></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="font-bold text-white text-lg mb-5">Spending by Category</h3>
          {categories.length === 0 ? <div className="flex flex-col items-center justify-center h-48 gap-3"><p className="text-4xl">??</p><p className="text-gray-500 text-sm">No expense data yet</p></div> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={95} innerRadius={50} paddingAngle={3}>
                  {categories.map((e, i) => <Cell key={i} fill={COLORS[e.category] || "#6C63FF"} />)}
                </Pie>
                <Tooltip formatter={(v) => ["Rs " + v.toLocaleString("en-IN"), ""]} {...tooltipStyle} />
                <Legend formatter={(v) => <span style={{ color: "#9CA3AF", fontSize: "11px" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="font-bold text-white text-lg mb-5">Top Expenses</h3>
          {categories.length === 0 ? <div className="flex flex-col items-center justify-center h-48 gap-3"><p className="text-4xl">??</p><p className="text-gray-500 text-sm">No expense data yet</p></div> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categories.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={v => "Rs" + v} />
                <YAxis dataKey="category" type="category" tick={{ fill: "#9CA3AF", fontSize: 11 }} width={90} />
                <Tooltip formatter={(v) => ["Rs " + v.toLocaleString("en-IN"), "Amount"]} {...tooltipStyle} />
                <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                  {categories.slice(0, 6).map((e, i) => <Cell key={i} fill={COLORS[e.category] || "#6C63FF"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="font-bold text-white text-lg mb-5">Monthly Income vs Expenses</h3>
        {monthly.length === 0 ? <div className="flex flex-col items-center justify-center h-48 gap-3"><p className="text-4xl">??</p><p className="text-gray-500 text-sm">No data yet</p></div> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} tickFormatter={v => "Rs" + v} />
              <Tooltip formatter={(v, n) => ["Rs " + Number(v).toLocaleString("en-IN"), n]} {...tooltipStyle} />
              <Legend formatter={(v) => <span style={{ color: "#9CA3AF", fontSize: "12px", textTransform: "capitalize" }}>{v}</span>} />
              <Bar dataKey="income" fill="#43D9A2" radius={[6,6,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#FF6584" radius={[6,6,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
