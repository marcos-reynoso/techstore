"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"

interface WishlistItem {
    id: string
    name: string
    slug: string
    price: number
    image: string
    stock: number
}

export default function WishlistPage() {
    const { data: session, status } = useSession()
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const addItem = useCartStore(state => state.addItem)

    useEffect(() => {
        // Cargar wishlist desde localStorage
        const saved = localStorage.getItem('wishlist')
        if (saved) {
            setWishlist(JSON.parse(saved))
        }
    }, [])

    if (status === "loading") {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!session) {
        redirect("/login")
    }

    const removeFromWishlist = (id: string) => {
        const updated = wishlist.filter(item => item.id !== id)
        setWishlist(updated)
        localStorage.setItem('wishlist', JSON.stringify(updated))
        toast.success('Removed from wishlist')
    }

    const moveToCart = (item: WishlistItem) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            slug: item.slug,
            stock: item.stock
        })
        removeFromWishlist(item.id)
        toast.success('Moved to cart!')
    }

    if (wishlist.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                <Heart className="h-24 w-24 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Save items you love for later
                </p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div>
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <p className="text-muted-foreground">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                        <Link href={`/products/${item.slug}`}>
                            <div className="relative aspect-square">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                        <CardContent className="p-4 space-y-3">
                            <Link href={`/products/${item.slug}`}>
                                <h3 className="font-semibold line-clamp-2 hover:text-primary">
                                    {item.name}
                                </h3>
                            </Link>
                            <p className="text-xl font-bold">${item.price.toFixed(2)}</p>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => moveToCart(item)}
                                    disabled={item.stock === 0}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromWishlist(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}