import prisma from '@/lib/prisma'
import ProductGrid from '@/components/ProductGrid'
import PageLayout from '@/components/PageLayout'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 16
    })
    
    console.log('Found products:', products.length)
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <PageLayout>
      <ProductGrid products={products} />
    </PageLayout>
  )
}

