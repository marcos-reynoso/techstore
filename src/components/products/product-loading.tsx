'use client'

import { Skeleton } from '@/components/ui/skeleton'


export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden">

      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        <Skeleton className="h-5 w-16" />
      </div>


      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>


      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>


      <div className="p-4 space-y-3">

        <Skeleton className="h-3 w-20" />


        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>


        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-3" />
          ))}
          <Skeleton className="h-3 w-8 ml-1" />
        </div>


        <Skeleton className="h-6 w-20" />
      </div>


      <div className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}


export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}


export function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>


      <ProductGridSkeleton count={12} />
    </div>
  )
}


export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-12" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-20" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <Skeleton className="aspect-square rounded-lg" />

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <Skeleton className="h-6 w-24" />

          {/* Product Name */}
          <Skeleton className="h-10 w-3/4" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Price */}
          <Skeleton className="h-12 w-32" />

          {/* Separator */}
          <div className="border-t" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}