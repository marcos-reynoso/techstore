"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

import { Product } from '@/store/product-store'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = async () => {
    // Verificar si el usuario está autenticado
    if (!session) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }

    if (product.stock < quantity) {
      toast.error('Not enough stock available')
      return
    }

    setIsLoading(true)
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        stock: product.stock
      }, quantity)
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`)
    } catch (error) {
      toast.error('Failed to add product to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = () => {
    if (!session) {
      toast.error('Please login to add items to wishlist')
      router.push('/login')
      return
    }

    // Obtener wishlist actual
    const saved = localStorage.getItem('wishlist')
    const wishlist = saved ? JSON.parse(saved) : []

    // Verificar si ya existe
    if (wishlist.find((item: any) => item.id === product.id)) {
      toast.info('Already in wishlist')
      return
    }

    // Agregar a wishlist
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
          }`}
      />
    ))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-lg border">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-red-500">
              Featured
            </Badge>
          )}
        </div>

        {product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedImage(product.image)}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 ${selectedImage === product.image ? 'border-primary' : 'border-gray-200'
                }`}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </button>
            {product.images.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square relative overflow-hidden rounded-lg border-2 ${selectedImage === image ? 'border-primary' : 'border-gray-200'
                  }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-2">
            {product.category.name}
          </Badge>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {renderStars(
                product.reviews && product.reviews.length > 0
                  ? product.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / product.reviews.length
                  : 0
              )}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews?.length ?? 0} reviews)
            </span>
          </div>
        </div>

        <div className="text-3xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        <Separator />

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${product.stock > 10 ? 'bg-green-500' :
              product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          <span className="text-sm">
            {product.stock > 10 ? 'In Stock' :
              product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isLoading}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>

            <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
              <Heart className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-600">On orders over $50</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-600">100% protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">30-day policy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
