export interface User {
  id: string
  username: string
  email: string
  role: string
}

export interface Product {
  _id: string
  name: string
  category: string
  quantityAvailable: number
  imageUrl?: string
}

export interface Rental {
  id: string
  productId: string
  userId: string
  startDate: string
  endDate: string
  status: string
}
