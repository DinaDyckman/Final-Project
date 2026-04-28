import api from './api'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password })
    return response.data
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  }
}
