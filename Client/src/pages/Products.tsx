import { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { Product } from '../types'
import { useLanguage } from '../context/LanguageContext'

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(console.error)
  }, [])

  return (
    <div className="container">
      <h1 style={{textAlign: 'center', margin: '60px 0 20px', fontWeight: 300, fontSize: '2.5rem', letterSpacing: '2px'}}>{t('ourCollection')}</h1>
      <p style={{textAlign: 'center', marginBottom: '50px', color: '#666'}}>{t('browsePremium')}</p>
      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p style={{color: '#666', margin: '15px 0', minHeight: '60px'}}>{product.description}</p>
            <p style={{fontSize: '1.8rem', fontWeight: 300, color: '#000', marginBottom: '20px'}}>${product.price}<span style={{fontSize: '0.9rem', color: '#666'}}>{t('perDay')}</span></p>
            <button style={{width: '100%'}}>{t('reserveNow')}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
