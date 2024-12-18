'use client'

import PageLayout from '@/components/PageLayout'
import ProductGrid from '@/components/ProductGrid'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products/category/tous')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  return (
    <PageLayout>
      <ProductGrid products={products} />
    </PageLayout>
  )
}

