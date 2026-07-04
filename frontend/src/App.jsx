import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AddTransaction from './pages/AddTransaction'
import Analytics from './pages/Analytics'
import Transactions from './pages/Transactions'
import AIChat from './pages/AIChat'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#16213E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/chat" element={<AIChat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}