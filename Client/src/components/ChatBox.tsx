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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input; // שומרים את הערך לפני שמנקים את ה-input
    setInput('')
    setLoading(true)

    try {
      // תיקון כתובת ה-URL לכתובת המלאה של השרת שלך
      const response = await fetch('http://localhost:5000/api/ai/consult', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          userId: "user_123", // השרת מצפה ל-userId כדי לשמור ב-DB
          userQuery: currentInput // שינוי מ-query ל-userQuery כדי שיתאים לשרת
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json()
      
      const aiText = data.aiResponse || "I'm not sure how to answer that.";
      
      setMessages(prev => [...prev, { text: aiText, isUser: false }])
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: 'Sorry, something went wrong. Please check if the server is running.', isUser: false }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && !cartOpen && (
        <button className="help-button" onClick={() => setIsOpen(true)}>
          💬 Need Help?
        </button>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message ai">Hi! How can I help you plan your event?</div>
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