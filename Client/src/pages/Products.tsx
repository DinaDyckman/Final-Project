import { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { Product } from '../types'

function Products() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(console.error)
  }, [])

  return (
    <div style={{padding: '20px'}}>
      <h1>Available Items</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px'}}>
        {products.map(product => (
          <div key={product._id} style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px'}} />}
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Available: {product.quantityAvailable}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products


