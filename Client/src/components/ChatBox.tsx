import { useState, useRef, useEffect } from 'react'
import '../styles/ChatBox.css'

interface Message {
  text: string
  isUser: boolean
}

function ChatBox({ cartOpen }: { cartOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // נשלוף את סוג האירוע שנשמר בבלוק ה-Continue, כדי להתאים את הודעת הפתיחה
  const savedEventType = sessionStorage.getItem('eventType')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ✨ ה-useEffect החדש: מקשיב למודל ופותח את הצ'אט בוט אוטומטית!
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
    }

    window.addEventListener('openSimchaChat', handleOpenChat)
    
    return () => {
      window.removeEventListener('openSimchaChat', handleOpenChat)
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    loading || setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/ai/consult', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          userId: "user_123", 
          userQuery: currentInput 
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      const aiText = data.aiResponse || "I'm not sure how to answer that."
      
      setMessages(prev => [...prev, { text: aiText, isUser: false }])
    } catch (error) {
      console.error("Chat Error:", error)
      setMessages(prev => [...prev, { text: 'Sorry, something went wrong. Please check if the server is running.', isUser: false }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && !cartOpen && (
        <button className="help-button" onClick={() => setIsOpen(true)}>
          Need Help?
        </button>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Simcha Bot</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message ai">
                {savedEventType 
                  ? `Hi! I see you are planning an ${savedEventType}. How can I help you plan your special day? ✨`
                  : "Hi! How can I help you plan your event?"}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.isUser ? 'user' : 'ai'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message ai">Thinking... 🪄</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBox