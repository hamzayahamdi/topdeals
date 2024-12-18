import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '16')
    const skip = (page - 1) * limit
    const category = decodeURIComponent(params.category).toLowerCase()

    // Debug log
    console.log('Processing request for:', {
      originalCategory: params.category,
      normalizedCategory: category,
      page,
      limit
    })

    // First get all products to check categories
    const allProducts = await prisma.product.findMany({
      select: {
        mainCategory: true,
        subCategory: true
      }
    })

    console.log('Available categories:', {
      mainCategories: [...new Set(allProducts.map(p => p.mainCategory?.toLowerCase()))],
      subCategories: [...new Set(allProducts.map(p => p.subCategory?.toLowerCase()))]
    })

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            mainCategory: {
              mode: 'insensitive',
              equals: category
            }
          },
          {
            subCategory: {
              mode: 'insensitive',
              equals: category
            }
          }
        ],
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    })

    console.log(`Found ${products.length} products for category "${category}"`)

    return NextResponse.json({
      products,
      hasMore: products.length === limit
    })

  } catch (error) {
    console.error('Error in category API:', error)
    return NextResponse.json({
      products: [],
      hasMore: false
    }, { status: 500 })
  }
} 