import { useState, useRef, useEffect } from "react"
import { sendChatMessage } from "../utils/api"
import { Send, Bot, User, Sparkles, Zap } from "lucide-react"

const QUICK_PROMPTS = [
  "Where am I spending the most?",
  "How can I save more money?",
  "What is my savings rate?",
  "Give me a budget plan",
  "Which expenses can I cut down?"
]

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I am your AI Financial Assistant powered by Gemini. I can analyze your spending, suggest budgets, and help you save more. What would you like to know?"
    }
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()

    if (!msg || loading) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: msg }])

    setLoading(true)

    try {
      const res = await sendChatMessage(msg)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply
        }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please check your Gemini API Key."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">

      <div className="mb-6 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#6C63FF,#4F46E5)"
          }}
        >
          <Sparkles size={22} className="text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Financial Assistant
          </h2>

          <p className="text-gray-400 text-sm">
            Powered by Google Gemini • Knows your real spending data
          </p>
        </div>
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="px-4 py-2 rounded-full text-sm"
              style={{
                background: "#2E2A55",
                color: "#C7D2FE"
              }}
            >
              <Zap size={12} className="inline mr-2" />
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {msg.role === "assistant" && (
              <div className="mr-3 mt-1">
                <Bot className="text-violet-400" />
              </div>
            )}

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-gray-200"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="ml-3 mt-1">
                <User className="text-gray-400" />
              </div>
            )}

          </div>

        ))}

        {loading && (
          <div className="text-gray-400">
            Gemini is typing...
          </div>
        )}

        <div ref={bottomRef}></div>

      </div>

      <div className="flex gap-3 mt-4">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
          placeholder="Ask about your finances..."
          className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700 text-white px-4"
        />

        <button
          onClick={() => sendMessage()}
          className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center"
        >
          <Send className="text-white" size={18} />
        </button>

      </div>

    </div>
  )
}