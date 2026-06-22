'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { Product } from "@/store/product-store"
import type { WishlistItem } from '@/types'
import { addWishlistItem } from '@/lib/wishlist'

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

    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock
    }

    addWishlistItem(wishlistItem).then(({ added }) => {
      if (!added) {
        toast.info('Already in wishlist')
        return
      }

      toast.success('Added to wishlist!')
    })
  }

  const rating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  return (
    <Card
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-transparent" />

          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {product.featured && (
              <Badge className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
                <Sparkles className="mr-1 h-3 w-3 text-cyan-300" />
                Featured
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]">
                Out of stock
              </Badge>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <Badge className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-amber-200">
                Only {product.stock} left
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="space-y-3 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">
            {product.category.name}
          </p>

          <h3 className="min-h-12 text-lg font-semibold leading-snug text-foreground line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-amber-300 text-amber-300' : 'text-white/25'}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {rating ? `${rating.toFixed(1)} (${product.reviews.length})` : 'No reviews yet'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">USD</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex gap-2 p-5 pt-0">
        <Button
          className="h-11 flex-1 rounded-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button
          className="h-11 rounded-full border-white/10 bg-white/5"
          variant="outline"
          size="icon"
          onClick={handleAddToWishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
