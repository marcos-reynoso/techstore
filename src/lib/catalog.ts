import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { serializeProduct, serializeProductSummary } from "@/lib/serializers"

export type CatalogQuery = {
  page?: number
  limit?: number
  category?: string | null
  search?: string | null
  featured?: boolean | null
  minPrice?: number | null
  maxPrice?: number | null
  sortBy?: string | null
  sortOrder?: string | null
}

type CatalogSortField = "name" | "price" | "createdAt" | "stock"

function buildCatalogWhere(query: CatalogQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { active: true }

  if (query.category) {
    where.category = { slug: query.category }
  }

  if (query.featured) {
    where.featured = true
  }

  if (query.search) {
    const search = query.search.trim()
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {}
    if (query.minPrice !== null) where.price.gte = query.minPrice
    if (query.maxPrice !== null) where.price.lte = query.maxPrice
  }

  return where
}

function buildOrderBy(sortBy?: string | null, sortOrder?: string | null): Prisma.ProductOrderByWithRelationInput {
  const validFields: CatalogSortField[] = ["name", "price", "createdAt", "stock"]
  const field = (validFields.includes(sortBy as CatalogSortField) ? sortBy : "createdAt") as CatalogSortField
  const order = sortOrder === "asc" ? "asc" : "desc"

  return {
    [field]: order,
  }
}

export async function getCatalogProducts(query: CatalogQuery) {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.max(1, query.limit ?? 12)
  const where = buildCatalogWhere(query)
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder)

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true },
        },
        reviews: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map((product) => serializeProductSummary(product)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  }
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true },
      },
      reviews: true,
      _count: {
        select: { reviews: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  })

  return products.map((product) => serializeProductSummary(product))
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { reviews: true },
      },
    },
  })

  if (!product) {
    return null
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true },
      },
      reviews: true,
      _count: {
        select: { reviews: true },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

  return {
    ...serializeProduct(product),
    avgRating: Math.round(avgRating * 10) / 10,
    relatedProducts: relatedProducts.map((item) => serializeProductSummary(item)),
  }
}
