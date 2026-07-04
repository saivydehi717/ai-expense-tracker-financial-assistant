import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../utils/api'
import { Send, Bot, User, Sparkles } from 'lucide-react'

const QUICK_PROMPTS = [
  "Where am I spending the most?",
  "How can I save more money?",
  "What is my savings rate this month?",
  "Give me a budget plan",
  "Which expenses can I cut down?",
]

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am your AI Financial Assistant powered by Gemini. I can analyze your spending, suggest budgets, and help you save more. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const res = await sendChatMessage(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please check your Gemini API key.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={22} className="text-primary" /> AI Financial Assistant
        </h2>
        <p className="text-gray-400 text-sm mt-1">Powered by Gemini - Knows your real spending data</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="px-4 py-2 rounded-full text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all">
                {p}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-sm'
                : 'glass-card text-gray-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="glass-card px-5 py-4 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="glass-card p-3 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about your spending, savings, budget..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 py-2 rounded-xl"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}