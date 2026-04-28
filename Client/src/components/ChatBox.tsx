import { useState } from 'react'
import '../styles/ChatBox.css'

interface Message {
  text: string
  isUser: boolean
}

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input; 
    setInput('')
    setLoading(true)

    try {
      // שליחת הבקשה לשרת
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
        throw new Error('Network response was not ok');
      }

      const data = await response.json()
      
      // הדפסה לדיבאג בדפדפן (F12) כדי לוודא מה חוזר מהשרת
      console.log("Server Response:", data);

      // התיקון הקריטי: השרת שלך שולח שדה בשם aiResponse
      // אנחנו משתמשים בו, ואם הוא ריק - נותנים תשובה מקצועית כגיבוי
      const aiText = data.aiResponse || "As an upscale designer, I recommend focusing on elegant textures and a cohesive color palette.";
      
      setMessages(prev => [...prev, { text: aiText, isUser: false }])
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I am having trouble connecting to my design database. Please try again in a moment.', 
        isUser: false 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
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
              <div className="message ai">Hi! I am your upscale event designer. How can I help you today?</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.isUser ? 'user' : 'ai'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message ai">Thinking... 🪄</div>}
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