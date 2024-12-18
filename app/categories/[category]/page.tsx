'use client'

import { Suspense } from 'react'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'
import ProductGrid from '@/components/ProductGrid'

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <>
      <main className="pt-[80px]">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid category={params.category} />
        </Suspense>
      </main>
    </>
  )
} 