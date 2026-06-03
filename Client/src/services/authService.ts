import api from './api' // מוודא שזה ה-axios instance שלכן

export const authService = {
  // עדכנו את הפונקציה לקבל גם adminCode אופציונלי
  register: async (name: string, email: string, password: string, role: string = 'User', adminCode?: string) => {
    // שולחים את כל הנתונים באובייקט אחד לשרת
    const response = await api.post('/users/register', { name, email, password, role, adminCode })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  }
}