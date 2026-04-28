import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import ChatBox from './components/ChatBox'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'

import ThankYou from './pages/ThankYou'

function App() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products cartOpen={cartOpen} setCartOpen={setCartOpen} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
        <ChatBox cartOpen={cartOpen} />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
