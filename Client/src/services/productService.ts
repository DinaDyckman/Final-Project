import api from './api'

export const productService = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (product: any) => {
    const response = await api.post('/products', product)
    return response.data
  }
}
