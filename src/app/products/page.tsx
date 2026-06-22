import { ProductGrid } from '@/components/products/product-grid'
import { getCatalogProducts } from '@/lib/catalog'


export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    category?: string
    search?: string
    featured?: string
    sortBy?: string
    sortOrder?: string
    minPrice?: string
    maxPrice?: string
  }>
}) {
  const params = await searchParams
  const currentPage = Number.parseInt(params.page || '1', 10)
  const limit = 8
  const featured = params.featured === 'true'
  const minPrice = params.minPrice ? Number.parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number.parseFloat(params.maxPrice) : undefined

  const { products, pagination } = await getCatalogProducts({
    page: Number.isFinite(currentPage) ? currentPage : 1,
    limit,
    category: params.category,
    search: params.search,
    featured,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    minPrice: Number.isFinite(minPrice ?? Number.NaN) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice ?? Number.NaN) ? maxPrice : undefined,
  })

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
      <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Browse products with a cleaner editorial layout.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Search, filter, and navigate featured items without visual clutter.
        </p>
      </div>

      <ProductGrid
        products={products}
        totalPages={pagination.totalPages}
        currentPage={pagination.page}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        query={{
          category: params.category,
          search: params.search,
          featured: params.featured,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        }}
      />
    </div>
  )
}
