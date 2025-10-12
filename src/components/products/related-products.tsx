import Link from 'next/link'
import ProductCard from './product-card'
import { Product } from '@/store/product-store'

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Link
          href={`/dashboard/products?category=${products[0]?.category.slug}`}
          className="text-primary hover:underline"
        >
          View all in {products[0]?.category.name}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}
