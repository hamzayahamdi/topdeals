'use client'

import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'
import ProductGridSkeleton from './ProductGridSkeleton'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface ProductGridProps {
  products?: Product[]
  category?: string
}

export default function ProductGrid({ products, category }: ProductGridProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)

  // For category pages - fetch products
  const fetchProducts = useCallback(async (pageNum: number) => {
    if (!category) return null
    try {
      const response = await fetch(
        `/api/products/category/${category}?page=${pageNum}&limit=16`
      )
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      return {
        products: data.products,
        hasMore: data.pagination.hasMore
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { products: [], hasMore: false }
    }
  }, [category])

  // For home page - display provided products
  useEffect(() => {
    if (products) {
      setIsLoading(true)
      setDisplayedProducts([])
      const timer = setTimeout(() => {
        setDisplayedProducts(products)
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [products])

  // For category pages - fetch initial products
  useEffect(() => {
    if (category) {
      setIsLoading(true)
      setDisplayedProducts([])
      setPage(1)
      
      fetchProducts(1)?.then((result) => {
        if (result) {
          setDisplayedProducts(result.products)
          setHasMore(result.hasMore)
        }
        setIsLoading(false)
      })
    }
  }, [category, fetchProducts])

  // Infinite scroll for category pages
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (!category || isLoading) return
    
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1
        fetchProducts(nextPage)?.then((result) => {
          if (result) {
            setDisplayedProducts(prev => [...prev, ...result.products])
            setHasMore(result.hasMore)
            setPage(nextPage)
          }
        })
      }
    })

    if (node) observer.current.observe(node)
  }, [category, isLoading, hasMore, page, fetchProducts])

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section 
        key="product-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="py-8"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
                ref={category && index === displayedProducts.length - 1 ? lastProductRef : null}
              >
                <Link 
                  href={`/products/${product.slug}`}
                  className="block transition-transform duration-200 hover:scale-[1.02]"
                >
                  <ProductCard 
                    product={product}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {category && hasMore && (
            <div 
              ref={loadingRef}
              className="flex justify-center items-center py-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"
              />
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}

