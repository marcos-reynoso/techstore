'use client'

import { Product} from '@/store/product-store'

import ProductCard from './product-card'
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'


interface ProductGridProps {
    products: Product[]
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
}


export function ProductGrid({
  products,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">No products found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <p>
          Showing {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-8">
          <Pagination>
            <PaginationContent>
              {hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${currentPage - 1}`} />
                </PaginationItem>
              )}
              
              {getPageNumbers(currentPage, totalPages).map((page, index) => 
                page === '...' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href={`?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              
              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext href={`?page=${currentPage + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage > 3) {
      pages.push('...')
    }
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    pages.push(totalPages)
  }
  return pages
}





