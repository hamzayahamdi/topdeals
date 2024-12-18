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
    const category = decodeURIComponent(params.category)

    // Use a transaction for parallel queries
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          OR: [
            { mainCategory: category },
            { subCategory: category }
          ],
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: {
          OR: [
            { mainCategory: category },
            { subCategory: category }
          ],
          isActive: true
        }
      })
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: skip + products.length < total
      }
    })
  } catch (error) {
    console.error('Error fetching category products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 