import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma, OrderStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive()
})

const OrderSchema = z.object({
  userId: z.string(),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  shippingName: z.string().min(1),
  shippingEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingZip: z.string().min(1)
})


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') as OrderStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Prisma.OrderWhereInput = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, image: true, slug: true }
              }
            }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = OrderSchema.parse(body)


    const total = validatedData.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    )


    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`


    const order = await prisma.$transaction(async (prisma) => {

      for (const item of validatedData.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`)
        }
      }


      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: validatedData.userId,
          total,
          status: 'PENDING',
          shippingName: validatedData.shippingName,
          shippingEmail: validatedData.shippingEmail,
          shippingAddress: validatedData.shippingAddress,
          shippingCity: validatedData.shippingCity,
          shippingZip: validatedData.shippingZip,
          orderItems: {
            create: validatedData.items
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      })


      for (const item of validatedData.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }

    logger.error('Error creating order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}