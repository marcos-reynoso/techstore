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