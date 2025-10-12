import { ProductGrid } from '@/components/products/product-grid'
import { prisma } from '@/lib/prisma'


export default async function ProductsPage({ searchParams }: { searchParams: { page?: string, category?: string } }) {
  const currentPage = parseInt(searchParams.page || '1')
  const limit = 8
  const offset = (currentPage - 1) * limit


  const whereClause = searchParams.category 
    ? { category: { slug: searchParams.category } }
    : {}

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      reviews: true
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc'
    }
  })

  
  const serializedProducts = products.map(product => ({
    ...product,
    price: product.price.toNumber(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
      ...product.category,
      description: product.category.description || undefined,
      image: product.category.image || undefined,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString()
    },
    reviews: product.reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    }))
  }))

  const total = await prisma.product.count({ where: whereClause })
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ProductGrid
        products={serializedProducts}
        totalPages={totalPages}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  )
}
