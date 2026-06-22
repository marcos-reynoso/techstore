import { notFound } from 'next/navigation'
import { ProductDetails } from '@/components/products/product-details'
import { RelatedProducts } from '@/components/products/related-products'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getProductBySlug } from '@/lib/catalog'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }

  return {
    title: `${product.name} | TechStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.category.name, href: `/products?category=${product.category.slug}` },
    { label: product.name, href: `/products/${product.slug}` }
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-2">
        <ProductDetails product={product} />
      </div>

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-10">
          <RelatedProducts products={product.relatedProducts} />
        </div>
      )}
    </div>
  )
}
