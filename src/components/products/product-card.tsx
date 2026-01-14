'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { Product } from "@/store/product-store"
import type { WishlistItem } from '@/types'


interface ProductCardProps {
  product: Product
}
export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()


    if (!session) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }

    setIsAddingToCart(true)

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        stock: product.stock
      })
      toast.success('Added to cart!')

      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAddingToCart(false)
    }
  }

  const isOutOfStock = product.stock === 0
  const handleAddToWishlist = () => {
    if (!session) {
      toast.error('Please login to add items to wishlist')
      router.push('/login')
      return
    }

    const saved = localStorage.getItem('wishlist')
    const wishlist: WishlistItem[] = saved ? JSON.parse(saved) : []

    if (wishlist.find((item) => item.id === product.id)) {
      toast.info('Already in wishlist')
      return
    }

    wishlist.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock
    })
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    toast.success('Added to wishlist!')
  }
  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>

        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="default" className="bg-blue-600">
              Featured
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Only {product.stock} left
            </Badge>
          )}
        </div>




        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardContent className="p-4">

          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category.name}
          </p>


          <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-12">
            {product.name}
          </h3>


          {product.reviews && product.reviews.length > 0 ? (() => {
            const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            return (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {avgRating.toFixed(1)} ({product.reviews.length})
                </span>
              </div>
            )
          })() : (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < 0
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                0 (0)
              </span>
            </div>
          )}


          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Link>


      <CardFooter className=" flex gap-1 p-4 pt-0 ">
        <Button
          className="w-40 cursor-pointer "
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart
            ? 'Adding...'
            : isOutOfStock
              ? 'Out of Stock'
              : 'Add to Cart'
          }
        </Button>
        <Button className=' cursor-pointer' variant="outline" size="lg" onClick={handleAddToWishlist}>
          <Heart className="h-4 w-4  " />
        </Button>
      </CardFooter>
    </Card>
  )
}