"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Sparkles } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"
import { Product } from "@/store/product-store"
import type { WishlistItem } from "@/types"
import { addWishlistItem } from "@/lib/wishlist"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please login to add items to cart")
      router.push("/login")
      return
    }

    if (product.stock < quantity) {
      toast.error("Not enough stock available")
      return
    }

    setIsLoading(true)
    try {
      addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          stock: product.stock,
        },
        quantity
      )
      toast.success(`${quantity} ${quantity > 1 ? "items" : "item"} added to cart!`)
    } catch {
      toast.error("Failed to add product to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = () => {
    if (!session) {
      toast.error("Please login to add items to wishlist")
      router.push("/login")
      return
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }

    addWishlistItem(wishlistItem).then(({ added }) => {
      if (!added) {
        toast.info("Already in wishlist")
        return
      }

      toast.success("Added to wishlist!")
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const rating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / product.reviews.length
      : 0

  const renderStars = (value: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(value) ? "fill-amber-300 text-amber-300" : "text-white/25"}`}
      />
    ))

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
          <div className="relative aspect-square overflow-hidden rounded-3xl">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
            {product.featured && (
              <Badge className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white backdrop-blur">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[product.image, ...product.images.slice(0, 3)].map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-2xl border transition-all ${
                  selectedImage === image
                    ? "border-cyan-300 ring-2 ring-cyan-300/30"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
          <Badge variant="secondary" className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-foreground/80">
            {product.category.name}
          </Badge>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating.toFixed(1)} · {product.reviews?.length ?? 0} reviews
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.stock > 10 ? "In stock" : product.stock > 0 ? "Low stock" : "Sold out"}
            </span>
          </div>

          <div className="mt-6 text-4xl font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Description</h3>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                product.stock > 10 ? "bg-emerald-400" : product.stock > 0 ? "bg-amber-300" : "bg-rose-400"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {product.stock > 10
                ? "Inventory ready for immediate dispatch"
                : product.stock > 0
                  ? `Only ${product.stock} left in stock`
                  : "Currently out of stock"}
            </span>
          </div>
        </div>

        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="mt-2 flex items-center overflow-hidden rounded-full border border-white/10 bg-black/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-11 rounded-none px-4"
                >
                  -
                </Button>
                <span className="min-w-[64px] px-4 text-center text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-11 rounded-none px-4"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isLoading}
                className="rounded-full px-6"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg" onClick={handleAddToWishlist} className="rounded-full border-white/10 bg-white/5">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare} className="rounded-full border-white/10 bg-white/5">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Truck className="mx-auto mb-2 h-6 w-6 text-cyan-300" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over $50</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-amber-300" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">Protected checkout</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <RotateCcw className="mx-auto mb-2 h-6 w-6 text-violet-300" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30-day policy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
