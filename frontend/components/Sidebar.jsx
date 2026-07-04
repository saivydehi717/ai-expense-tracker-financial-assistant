import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BarChart2, MessageSquareText, Wallet } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/add', icon: PlusCircle, label: 'Add Transaction' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/transactions', icon: Wallet, label: 'Transactions' },
  { to: '/chat', icon: MessageSquareText, label: 'AI Assistant' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-white/5 flex flex-col p-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl">💰</div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight">AI Expense</h1>
          <p className="text-xs text-gray-500">Financial Assistant</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="glass-card p-4 text-center">
        <p className="text-xs text-gray-500">Powered by</p>
        <p className="text-sm font-semibold text-primary">Gemini AI ✨</p>
      </div>
    </aside>
  )
}