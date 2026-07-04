import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BarChart2, MessageSquareText, Wallet, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { to: '/add', icon: PlusCircle, label: 'Add Transaction', emoji: '➕' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics', emoji: '📊' },
  { to: '/transactions', icon: Wallet, label: 'Transactions', emoji: '💳' },
  { to: '/chat', icon: MessageSquareText, label: 'AI Assistant', emoji: '🤖' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      style={{ background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%)', borderRight: '1px solid rgba(108,99,255,0.15)' }}>

      {/* Glow Effect Top */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-30"
        style={{ background: 'radial-gradient(ellipse at top left, #6C63FF40, transparent)' }} />

      {/* Logo */}
      <div className="relative p-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #4F46E5)', boxShadow: '0 0 20px #6C63FF50' }}>
            💰
            <div className="absolute inset-0 rounded-xl animate-pulse opacity-50"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #4F46E5)', filter: 'blur(8px)', zIndex: -1 }} />
          </div>
          <div>
            <h1 className="font-black text-lg text-white leading-tight tracking-wide">AI Expense</h1>
            <p className="text-xs font-medium" style={{ color: '#6C63FF' }}>Financial Assistant</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #6C63FF50, transparent)' }} />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navItems.map(({ to, icon: Icon, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group overflow-hidden ${
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(79,70,229,0.15))',
              border: '1px solid rgba(108,99,255,0.4)',
              boxShadow: '0 0 20px rgba(108,99,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
            } : {
              border: '1px solid transparent'
            }}
          >
            {({ isActive }) => (
              <>
                {/* Hover bg */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.03)' }} />
                )}

                {/* Active glow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #6C63FF, #4F46E5)', boxShadow: '0 0 10px #6C63FF' }} />
                )}

                <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #6C63FF30, #4F46E520)',
                    boxShadow: '0 0 12px #6C63FF30'
                  } : {}}>
                  <Icon size={17} className={isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'} />
                </div>

                <span className="relative">{label}</span>

                {isActive && (
                  <Sparkles size={12} className="ml-auto text-primary opacity-70" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Card */}
      <div className="p-4 mx-4 mb-6 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(79,70,229,0.08))', border: '1px solid rgba(108,99,255,0.2)' }}>
        <div className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{ background: 'radial-gradient(circle, #6C63FF, transparent)' }} />
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, #6C63FF30, #4F46E520)' }}>
            ✨
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Powered by</p>
            <p className="text-xs font-bold" style={{ color: '#6C63FF' }}>Google Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Glow Effect Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20"
        style={{ background: 'radial-gradient(ellipse at bottom left, #6C63FF40, transparent)' }} />
    </aside>
  )
}
     