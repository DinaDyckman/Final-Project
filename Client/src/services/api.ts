import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      
      // ✅ Never redirect on auth endpoints — let the component handle it
      const isAuthRequest = 
        url.includes('/users/login') || 
        url.includes('/users/register') ||
        url.includes('/users/verify-code')

      if (!isAuthRequest) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/products'
      }
    }
    return Promise.reject(error)
  }
)

export default api;