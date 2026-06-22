"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import { WishlistItem } from "@/types/index"
import { loadWishlist, removeWishlistItem } from "@/lib/wishlist"

export default function WishlistPage() {
    const { data: session, status } = useSession()
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const addItem = useCartStore(state => state.addItem)

    useEffect(() => {
        loadWishlist().then(setWishlist)
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
        removeWishlistItem(id).then((updated) => {
            setWishlist(updated)
            toast.success("Removed from wishlist")
        })
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
        toast.success("Moved to cart!")
    }

    if (wishlist.length === 0) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10">
                <Card className="w-full max-w-xl border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                    <CardContent className="flex flex-col items-center p-10 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            <Heart className="h-10 w-10 text-cyan-300" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Wishlist</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Your wishlist is empty</h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                            Save products you like and revisit them later from a cleaner, more curated view.
                        </p>
                        <Button asChild className="mt-8 rounded-full px-6">
                            <Link href="/products">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Browse Products
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Wishlist</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">My saved products</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                        <Link href={`/products/${item.slug}`}>
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                        </Link>
                        <CardContent className="space-y-4 p-5">
                            <Link href={`/products/${item.slug}`}>
                                <h3 className="line-clamp-2 text-lg font-semibold leading-snug hover:text-cyan-300">
                                    {item.name}
                                </h3>
                            </Link>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Price</p>
                                    <p className="text-2xl font-semibold">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {item.stock === 0 ? "Out of stock" : `${item.stock} in stock`}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="h-11 flex-1 rounded-full"
                                    onClick={() => moveToCart(item)}
                                    disabled={item.stock === 0}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="h-11 rounded-full border-white/10 bg-white/5"
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
