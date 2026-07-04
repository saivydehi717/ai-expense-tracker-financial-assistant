import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Sparkles,
  Bot,
  ArrowRight,
  PlusCircle
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

import {
  getSummary,
  getRecentTransactions,
  getCategoryAnalytics,
  getMonthlyTrends,
  getHealthScore
} from "../utils/api";

const COLORS = {
  "Food & Dining": "#FF6584",
  Transport: "#3B82F6",
  Shopping: "#F59E0B",
  Entertainment: "#8B5CF6",
  Healthcare: "#10B981",
  Education: "#06B6D4",
  Utilities: "#14B8A6",
  Rent: "#EF4444",
  Travel: "#EC4899",
  Other: "#9CA3AF"
};

const EMOJI = {
  "Food & Dining": "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Healthcare: "💊",
  Education: "📚",
  Utilities: "⚡",
  Rent: "🏠",
  Travel: "✈️",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Business: "🏢",
  Gift: "🎁",
  Other: "💰"
};

export default function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [health, setHealth] = useState(null);

  const [aiInsight, setAiInsight] = useState(
    "Analyzing your financial habits..."
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadDashboard() {

      try {

        const [
          summaryRes,
          recentRes,
          categoryRes,
          monthlyRes,
          healthRes
        ] = await Promise.all([
          getSummary(),
          getRecentTransactions(),
          getCategoryAnalytics(),
          getMonthlyTrends(),
          getHealthScore()
        ]);

        setSummary(summaryRes.data);
        setRecent(recentRes.data);
        setCategories(categoryRes.data);
        setMonthly(monthlyRes.data);
        setHealth(healthRes.data);

        const income = summaryRes.data.total_income || 0;
        const expense = summaryRes.data.total_expense || 0;
        const balance = summaryRes.data.balance || 0;

        if (income === 0) {

          setAiInsight(
            "Start adding income and expenses to receive personalized AI insights."
          );

        } else if (expense > income) {

          setAiInsight(
            "⚠️ Your expenses are higher than your income. Consider reducing unnecessary spending."
          );

        } else if (balance > income * 0.30) {

          setAiInsight(
            "🎉 Excellent! You are saving more than 30% of your income."
          );

        } else if (categoryRes.data.length > 0) {

          setAiInsight(
            `💡 Most of your spending is on ${categoryRes.data[0].category}. Consider reducing it to improve your savings.`
          );

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    }

    loadDashboard();

  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="text-gray-400 mt-1">
            AI Powered Expense Tracking Dashboard
          </p>

        </div>

        <Link
          to="/add"
          className="bg-gradient-to-r from-sky-500 to-blue-700 hover:scale-105 transition-all px-6 py-3 rounded-2xl text-white flex items-center gap-2 shadow-lg"
        >
          <PlusCircle size={20}/>
          Add Transaction
        </Link>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* Balance */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 p-7 shadow-xl hover:scale-105 transition">

          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>

          <div className="flex justify-between items-center">

            <div>

              <p className="text-blue-100">
                Total Balance
              </p>

              <h2 className="text-4xl font-bold text-white mt-3">
                ₹{summary?.balance?.toLocaleString("en-IN")}
              </h2>

            </div>

            <Wallet size={36} className="text-white"/>

          </div>

          <p className="text-blue-100 mt-6">
            Income − Expense
          </p>

        </div>
                {/* Income */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-7 shadow-xl hover:scale-105 transition">

          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>

          <div className="flex justify-between items-center">

            <div>

              <p className="text-green-100">
                Total Income
              </p>

              <h2 className="text-4xl font-bold text-white mt-3">
                ₹{summary?.total_income?.toLocaleString("en-IN")}
              </h2>

            </div>

            <TrendingUp size={36} className="text-white"/>

          </div>

          <p className="text-green-100 mt-6">
            Money Received
          </p>

        </div>

        {/* Expense */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 p-7 shadow-xl hover:scale-105 transition">

          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>

          <div className="flex justify-between items-center">

            <div>

              <p className="text-red-100">
                Total Expense
              </p>

              <h2 className="text-4xl font-bold text-white mt-3">
                ₹{summary?.total_expense?.toLocaleString("en-IN")}
              </h2>

            </div>

            <TrendingDown size={36} className="text-white"/>

          </div>

          <p className="text-red-100 mt-6">
            Money Spent
          </p>

        </div>

      </div>

      {/* Health Score + AI Insight */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Financial Health */}

        <div className="rounded-3xl bg-slate-900 border border-slate-700 p-7">

          <div className="flex items-center gap-3 mb-6">

            <ShieldCheck className="text-green-400"/>

            <h2 className="text-xl font-bold text-white">
              Financial Health Score
            </h2>

          </div>

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-6xl font-bold text-green-400">
                {health?.score}
              </h1>

              <p className="text-gray-300 mt-3">
                {health?.status}
              </p>

            </div>

            <div className="w-36 h-36 rounded-full border-[12px] border-green-500 flex items-center justify-center">

              <span className="text-2xl font-bold text-white">
                {health?.score}%
              </span>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">

            <div>

              <p className="text-gray-400 text-sm">
                Savings
              </p>

              <h3 className="text-green-400 font-bold">
                ₹{health?.savings?.toLocaleString("en-IN")}
              </h3>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Savings Rate
              </p>

              <h3 className="text-cyan-400 font-bold">
                {health?.savings_rate}%
              </h3>

            </div>

          </div>

        </div>

        {/* AI Insight */}

        <div className="rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-7 relative overflow-hidden">

          <div className="absolute w-44 h-44 rounded-full bg-white/10 -right-10 -top-10"></div>

          <div className="relative">

            <div className="flex items-center gap-3 mb-6">

              <Bot className="text-white"/>

              <h2 className="text-xl font-bold text-white">
                AI Financial Insight
              </h2>

            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">

              <p className="text-white leading-8">
                {aiInsight}
              </p>

            </div>

            <Link
              to="/chat"
              className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >

              <Sparkles size={18}/>

              Open AI Assistant

            </Link>

          </div>

        </div>

      </div>
            {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Monthly Trends */}
        <div className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Monthly Income vs Expense
          </h2>

          {monthly.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No Data Available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthly}>

                <defs>
                  <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>

                  <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>

                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                />

                <YAxis
                  stroke="#94A3B8"
                />

                <Tooltip/>

                <Legend/>

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  fill="url(#incomeColor)"
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  fill="url(#expenseColor)"
                />

              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* Pie Chart */}
        <div className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Spending by Category
          </h2>

          {categories.length === 0 ? (

            <div className="h-72 flex items-center justify-center text-gray-500">
              No Expense Data
            </div>

          ) : (

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={categories}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >

                  {categories.map((item, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[item.category] || "#6366F1"}
                    />
                  ))}

                </Pie>

                <Tooltip/>

                <Legend/>

              </PieChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

      {/* Recent Transactions */}

      <div className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-xl">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold text-white">
            Recent Transactions
          </h2>

          <Link
            to="/transactions"
            className="text-violet-400 hover:text-violet-300"
          >
            View All →
          </Link>

        </div>

        {recent.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No Transactions Available
          </div>

        ) : (

          <div className="space-y-3">

            {recent.map(item => (

              <div
                key={item.id}
                className="flex justify-between items-center bg-slate-800 rounded-2xl p-4 hover:bg-slate-700 transition"
              >

                <div className="flex items-center gap-4">

                  <div className="text-3xl">
                    {EMOJI[item.category] || "💰"}
                  </div>

                  <div>

                    <h3 className="text-white font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {item.category}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p
                    className={`font-bold ${
                      item.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"} ₹{item.amount}
                  </p>

                  <p className="text-gray-500 text-xs">
                    {item.date}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
            {/* Quick Actions */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/add"
          className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-700 p-6 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <PlusCircle size={34} className="text-white mb-4" />

          <h3 className="text-white font-bold text-xl">
            Add Transaction
          </h3>

          <p className="text-violet-200 mt-2 text-sm">
            Record a new income or expense.
          </p>

        </Link>

        <Link
          to="/transactions"
          className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-6 hover:scale-105 transition-all duration-300 shadow-lg"
        >

          <Wallet size={34} className="text-white mb-4"/>

          <h3 className="text-white font-bold text-xl">
            All Transactions
          </h3>

          <p className="text-cyan-100 mt-2 text-sm">
            View and manage every transaction.
          </p>

        </Link>

        <Link
          to="/chat"
          className="rounded-3xl bg-gradient-to-r from-pink-600 to-purple-700 p-6 hover:scale-105 transition-all duration-300 shadow-lg"
        >

          <Bot size={34} className="text-white mb-4"/>

          <h3 className="text-white font-bold text-xl">
            AI Financial Advisor
          </h3>

          <p className="text-pink-100 mt-2 text-sm">
            Ask AI anything about your spending.
          </p>

        </Link>

      </div>


      {/* Smart Tips */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-8">

        <div className="flex items-center gap-3 mb-6">

          <Sparkles className="text-yellow-400"/>

          <h2 className="text-2xl font-bold text-white">
            Smart Financial Tips
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-800 rounded-2xl p-5">

            <h4 className="text-green-400 font-bold mb-2">
              Save First
            </h4>

            <p className="text-gray-300 text-sm">
              Save at least 20% of every month's income before spending.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-5">

            <h4 className="text-blue-400 font-bold mb-2">
              Track Daily
            </h4>

            <p className="text-gray-300 text-sm">
              Recording every expense helps identify unnecessary spending.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-5">

            <h4 className="text-pink-400 font-bold mb-2">
              AI Recommendation
            </h4>

            <p className="text-gray-300 text-sm">
              Use the AI Assistant regularly for personalized financial insights.
            </p>

          </div>

        </div>

      </div>


      {/* AI Banner */}

      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-8 shadow-2xl">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Your AI Financial Assistant is Ready 🚀
            </h2>

            <p className="text-violet-100 mt-3 max-w-2xl">
              Ask questions like:
            </p>

            <ul className="text-violet-100 mt-4 space-y-2">

              <li>• Where did I spend the most money?</li>

              <li>• How can I save more this month?</li>

              <li>• Show my financial health.</li>

              <li>• Give budgeting suggestions.</li>

            </ul>

          </div>

          <Link
            to="/chat"
            className="bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition flex items-center gap-2"
          >

            <Sparkles size={22}/>

            Open AI Assistant

            <ArrowRight size={20}/>

          </Link>

        </div>

      </div>


      {/* Footer */}

      <div className="text-center py-8">

        <p className="text-gray-500">
          AI Expense Tracker & Financial Assistant
        </p>

        <p className="text-gray-600 text-sm mt-2">
          Built with ❤️ using React, FastAPI, SQLite and Gemini AI
        </p>

      </div>

    </div>

  )

}