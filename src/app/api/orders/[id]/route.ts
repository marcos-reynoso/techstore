import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'


const OrderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional()
})


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const order = await prisma.order.findUnique({
      where: { id: resolvedParams.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                slug: true,
                price: true
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    logger.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const validatedData = OrderUpdateSchema.parse(body)

    const existingOrder = await prisma.order.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: validatedData,
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, image: true, slug: true }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }

    logger.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const order = await prisma.order.findUnique({
      where: { id: resolvedParams.id },
      include: { orderItems: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }


    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cannot delete order that is not pending' },
        { status: 409 }
      )
    }


    await prisma.$transaction(async (tx) => {

      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }


      await tx.order.delete({
        where: { id: resolvedParams.id }
      })
    })

    return NextResponse.json({
      message: 'Order cancelled and stock restored',
      orderNumber: order.orderNumber
    })
  } catch (error) {
    logger.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}