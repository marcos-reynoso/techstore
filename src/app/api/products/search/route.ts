import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")
    const limit = parseInt(searchParams.get("limit") || "20")

    if (!q || q.trim() === "") {
      return NextResponse.json({
        products: [],
        query: q,
        total: 0,
      })
    }

    const where: Prisma.ProductWhereInput = {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      take: limit,
      orderBy: { name: "asc" },
    })

    return NextResponse.json({
      products,
      query: q,
      total: products.length,
    })
  } catch (error) {
    logger.error("Error searching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}