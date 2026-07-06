import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { getCatalogProducts } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  image: z.string().url('Image must be a valid URL'),
  images: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  categoryId: z.string().min(1, 'Category ID is required')
})


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined

    const { products, pagination } = await getCatalogProducts({
      page,
      limit,
      category: searchParams.get('category'),
      search: searchParams.get('search'),
      featured,
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      minPrice,
      maxPrice,
    })

    return NextResponse.json({
      products,
      pagination,
    })
  } catch (error) {
    logger.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()


    const validatedData = ProductSchema.parse(body)


    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }


    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      )
    }


    const product = await prisma.product.create({
      data: validatedData,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    logger.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
