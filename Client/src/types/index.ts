export interface User {
  id: string
  username: string
  email: string
  role: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  available: boolean
}

export interface Rental {
  id: string
  productId: string
  userId: string
  startDate: string
  endDate: string
  status: string
}
