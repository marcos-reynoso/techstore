type DecimalLike = number | { toNumber: () => number }

type SerializableCategory = {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

type SerializableReview = {
  id: string
  rating: number
  comment: string
  userId: string
  productId: string
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string | null
    email: string | null
  }
}

type SerializableProduct = {
  id: string
  name: string
  slug: string
  description: string
  price: DecimalLike
  image: string
  images: string[]
  stock: number
  featured: boolean
  active: boolean
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: SerializableCategory
  reviews?: SerializableReview[]
  _count?: {
    reviews: number
  }
}

function toNumber(value: DecimalLike) {
  return typeof value === "number" ? value : value.toNumber()
}

function toISOString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

export function serializeCategory(category: SerializableCategory) {
  return {
    ...category,
    description: category.description || undefined,
    image: category.image || undefined,
    createdAt: toISOString(category.createdAt),
    updatedAt: toISOString(category.updatedAt),
  }
}

export function serializeReview(review: SerializableReview) {
  return {
    ...review,
    createdAt: toISOString(review.createdAt),
    updatedAt: toISOString(review.updatedAt),
  }
}

export function serializeProduct(product: SerializableProduct) {
  return {
    ...product,
    price: toNumber(product.price),
    createdAt: toISOString(product.createdAt),
    updatedAt: toISOString(product.updatedAt),
    category: serializeCategory(product.category),
    reviews: product.reviews?.map(serializeReview) ?? [],
  }
}

export function serializeProductSummary(product: SerializableProduct) {
  return {
    ...serializeProduct(product),
    _count: product._count,
  }
}
