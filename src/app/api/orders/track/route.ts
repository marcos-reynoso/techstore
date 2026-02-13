import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const orderNumber = searchParams.get("orderNumber")

        if (!orderNumber) {
            return NextResponse.json({ error: "orderNumber is required" }, { status: 400 })
        }

        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                slug: true,
                                price: true,
                            },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        return NextResponse.json(order)
    } catch (error) {
        logger.error("Error tracking order:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
