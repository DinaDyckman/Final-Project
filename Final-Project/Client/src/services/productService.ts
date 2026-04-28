import api from './api'
import { Product } from '../types'

export const productService = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (product: Omit<Product, '_id'>) => {
    const response = await api.post('/products', product)
    return response.data
  },

  update: async (id: string, product: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}
