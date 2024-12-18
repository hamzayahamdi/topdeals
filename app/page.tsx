import ProductGrid from '@/components/ProductGrid'
import PageLayout from '@/components/PageLayout'

export default function Home() {
  return (
    <PageLayout>
      <ProductGrid category="tous" />
    </PageLayout>
  )
}

