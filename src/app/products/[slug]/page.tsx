import { notFound } from 'next/navigation'
import { ProductDetails } from '@/components/products/product-details'
import { RelatedProducts } from '@/components/products/related-products'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch product')
    }

    const product = await response.json()
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.slug)

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
  const product = await getProduct(resolvedParams.slug)

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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-8">
        <ProductDetails product={product} />
      </div>

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={product.relatedProducts} />
        </div>
      )}
    </div>
  )
}
