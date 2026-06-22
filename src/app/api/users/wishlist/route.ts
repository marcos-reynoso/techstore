import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const WishlistItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  image: z.string().min(1),
  stock: z.number().int().min(0),
})

const WishlistSchema = z.object({
  items: z.array(WishlistItemSchema),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { wishlist: true },
    })

    const wishlist = Array.isArray(user?.wishlist) ? user.wishlist : []

    return NextResponse.json({ wishlist })
  } catch (error) {
    logger.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validated = WishlistSchema.parse(body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { wishlist: validated.items },
    })

    return NextResponse.json({ wishlist: validated.items })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    logger.error("Error updating wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
