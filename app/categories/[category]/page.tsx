import { Suspense } from 'react'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'
import ProductGrid from '@/components/ProductGrid'
import PageLayout from '@/components/PageLayout'

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <PageLayout>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid category={decodeURIComponent(params.category)} />
      </Suspense>
    </PageLayout>
  )
} 