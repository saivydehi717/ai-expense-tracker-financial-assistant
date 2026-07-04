import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Filter,
  Plus,
  Wallet,
  Calendar,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { motion } from "framer-motion";

import {
  getTransactions,
  deleteTransaction
} from "../utils/api";

const COLORS = {
  "Food & Dining": "#FF5A7A",
  Transport: "#6366F1",
  Shopping: "#F59E0B",
  Entertainment: "#A855F7",
  Healthcare: "#06B6D4",
  Education: "#10B981",
  Utilities: "#3B82F6",
  Rent: "#EF4444",
  Travel: "#EC4899",
  Salary: "#22C55E",
  Other: "#94A3B8"
};

const EMOJI = {
  "Food & Dining":"🍔",
  Transport:"🚗",
  Shopping:"🛍️",
  Entertainment:"🎬",
  Healthcare:"💊",
  Education:"📚",
  Utilities:"⚡",
  Rent:"🏠",
  Travel:"✈️",
  Salary:"💼",
  Freelance:"💻",
  Investment:"📈",
  Business:"🏢",
  Gift:"🎁",
  Other:"💰"
};

export default function Transactions(){

const [transactions,setTransactions]=useState([])
const [filtered,setFiltered]=useState([])

const [search,setSearch]=useState("")
const [typeFilter,setTypeFilter]=useState("All")
const [categoryFilter,setCategoryFilter]=useState("All")

const [loading,setLoading]=useState(true)

const [page,setPage]=useState(1)

const PER_PAGE=6

useEffect(()=>{

loadTransactions()

},[])

async function loadTransactions(){

try{

const res=await getTransactions()

setTransactions(res.data)
setFiltered(res.data)

}catch(err){

console.log(err)

}

finally{

setLoading(false)

}

}

useEffect(()=>{

let data=[...transactions]

if(search){

data=data.filter(item=>

item.title.toLowerCase().includes(search.toLowerCase())

)

}

if(typeFilter!=="All"){

data=data.filter(item=>item.type===typeFilter)

}

if(categoryFilter!=="All"){

data=data.filter(item=>item.category===categoryFilter)

}

setFiltered(data)

setPage(1)

},[search,typeFilter,categoryFilter,transactions])

const totalPages=Math.ceil(filtered.length/PER_PAGE)

const current=filtered.slice(

(page-1)*PER_PAGE,

page*PER_PAGE

)

if(loading){

return(

<div className="flex justify-center items-center h-screen">

<div className="w-14 h-14 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"/>

</div>

)

}

return(

<div className="space-y-8">

{/* Header */}

<div className="flex flex-col md:flex-row justify-between items-center gap-6">

<div className="flex items-center gap-5">

<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-600/40">

<Wallet className="text-white" size={38}/>

</div>

<div>

<h1 className="text-5xl font-extrabold text-white">

Transactions

</h1>

<p className="text-gray-400 mt-2 text-lg">

View and manage all your transactions

</p>

</div>

</div>

<Link

to="/add"

className="bg-gradient-to-r from-violet-600 to-blue-600 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-violet-500/40 flex items-center gap-3"

>

<Plus size={22}/>

Add Transaction

</Link>

</div>

{/* Search */}

<div className="rounded-3xl border border-violet-500/30 bg-[#111827]/70 backdrop-blur-xl p-6">

<div className="grid lg:grid-cols-3 gap-5">

<div className="relative lg:col-span-1">

<Search

size={22}

className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"

/>

<input

type="text"

placeholder="Search transactions..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full bg-[#1A1F36] border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"

/>

</div>

<select

value={typeFilter}

onChange={(e)=>setTypeFilter(e.target.value)}

className="bg-[#1A1F36] border border-white/10 rounded-2xl px-5 py-4 text-white"

>

<option>All</option>

<option value="income">Income</option>

<option value="expense">Expense</option>

</select>

<select

value={categoryFilter}

onChange={(e)=>setCategoryFilter(e.target.value)}

className="bg-[#1A1F36] border border-white/10 rounded-2xl px-5 py-4 text-white"

>

<option>All</option>

{Object.keys(COLORS).map(cat=>(

<option key={cat}>{cat}</option>

))}

</select>

</div>

</div>
{/* Transaction List */}

<div className="space-y-5">

  {current.length === 0 ? (

    <div className="rounded-3xl bg-[#111827] border border-white/10 py-20 text-center">

      <Wallet className="mx-auto text-gray-500 mb-5" size={60} />

      <h2 className="text-2xl font-bold text-white">
        No Transactions Found
      </h2>

      <p className="text-gray-400 mt-2">
        Try changing your search or filters.
      </p>

    </div>

  ) : (

    current.map((item, index) => (

      <motion.div

        key={item.id}

        initial={{ opacity: 0, y: 25 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ delay: index * 0.08 }}

        className="group rounded-3xl overflow-hidden"

      >

        <div className="bg-[#111827] border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-600/20">

          <div className="flex items-center justify-between p-6">

            {/* Left */}

            <div className="flex items-center gap-5">

              <div

                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"

                style={{

                  background:

                    COLORS[item.category] + "20",

                  border:

                    "1px solid " + COLORS[item.category]

                }}

              >

                {EMOJI[item.category] || "💰"}

              </div>

              <div>

                <h2 className="text-xl font-bold text-white">

                  {item.title}

                </h2>

                <div className="flex flex-wrap items-center gap-3 mt-2">

                  <span className="flex items-center gap-1 text-gray-400 text-sm">

                    <Tag size={14} />

                    {item.category}

                  </span>

                  <span className="flex items-center gap-1 text-gray-400 text-sm">

                    <Calendar size={14} />

                    {item.date}

                  </span>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="text-right">

              <h2

                className={`text-2xl font-extrabold ${
                  item.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}

              >

                {item.type === "income" ? "+" : "-"}

                ₹{item.amount.toLocaleString("en-IN")}

              </h2>

              <span

                className={`inline-flex mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
                  item.type === "income"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}

              >

                {item.type.toUpperCase()}

              </span>

            </div>

          </div>

          {/* Bottom Buttons */}

          <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-3">

            <button

              className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"

            >

              Edit

            </button>

            <button

              onClick={async () => {

                if (window.confirm("Delete this transaction?")) {

                  await deleteTransaction(item.id)

                  loadTransactions()

                }

              }}

              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"

            >

              Delete

            </button>

          </div>

        </div>

      </motion.div>

    ))

  )}

</div>
{/* Pagination */}

{filtered.length > PER_PAGE && (

<div className="flex justify-center items-center gap-4 mt-10">

<button

disabled={page===1}

onClick={()=>setPage(page-1)}

className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-violet-600 disabled:opacity-40 flex items-center justify-center transition"

>

<ChevronLeft size={20}/>

</button>

<span className="text-white font-semibold text-lg">

Page {page} of {totalPages}

</span>

<button

disabled={page===totalPages}

onClick={()=>setPage(page+1)}

className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-violet-600 disabled:opacity-40 flex items-center justify-center transition"

>

<ChevronRight size={20}/>

</button>

</div>

)}

{/* Statistics */}

<div className="grid md:grid-cols-3 gap-6 mt-10">

<div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500 to-green-700 shadow-xl">

<p className="text-green-100">

Income Transactions

</p>

<h2 className="text-4xl font-bold text-white mt-3">

{transactions.filter(t=>t.type==="income").length}

</h2>

</div>

<div className="rounded-3xl p-6 bg-gradient-to-br from-red-500 to-rose-700 shadow-xl">

<p className="text-red-100">

Expense Transactions

</p>

<h2 className="text-4xl font-bold text-white mt-3">

{transactions.filter(t=>t.type==="expense").length}

</h2>

</div>

<div className="rounded-3xl p-6 bg-gradient-to-br from-violet-600 to-blue-700 shadow-xl">

<p className="text-violet-100">

Total Records

</p>

<h2 className="text-4xl font-bold text-white mt-3">

{transactions.length}

</h2>

</div>

</div>

{/* Summary */}

<div className="mt-10 rounded-3xl overflow-hidden bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-8">

<div className="flex flex-col md:flex-row justify-between items-center gap-8">

<div>

<h2 className="text-3xl font-bold text-white">

Financial Summary

</h2>

<p className="text-violet-100 mt-3">

Track every income and expense to stay financially healthy.

</p>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="bg-white/10 rounded-2xl px-8 py-5">

<p className="text-violet-100">

Income

</p>

<h3 className="text-3xl font-bold text-green-300">

₹{transactions
.filter(t=>t.type==="income")
.reduce((a,b)=>a+b.amount,0)
.toLocaleString("en-IN")}

</h3>

</div>

<div className="bg-white/10 rounded-2xl px-8 py-5">

<p className="text-violet-100">

Expense

</p>

<h3 className="text-3xl font-bold text-red-300">

₹{transactions
.filter(t=>t.type==="expense")
.reduce((a,b)=>a+b.amount,0)
.toLocaleString("en-IN")}

</h3>

</div>

</div>

</div>

</div>

</div>

)

}