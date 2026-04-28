import { useState } from 'react'
import { productService } from '../services/productService'

function AddProduct() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await productService.create({ name, category, quantityAvailable: quantity, imageUrl })
    alert('Product added!')
    setName('')
    setCategory('')
    setQuantity(0)
    setImageUrl('')
  }

  return (
    <div style={{padding: '20px', maxWidth: '500px'}}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{display: 'block', margin: '10px 0', padding: '8px', width: '100%'}} />
        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required style={{display: 'block', margin: '10px 0', padding: '8px', width: '100%'}} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required style={{display: 'block', margin: '10px 0', padding: '8px', width: '100%'}} />
        <input type="text" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{display: 'block', margin: '10px 0', padding: '8px', width: '100%'}} />
        <button type="submit" style={{padding: '10px 20px'}}>Add Product</button>
      </form>
    </div>
  )
}

export default AddProduct
