"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react"

export default function CartPage() {
    const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10">
                <Card className="w-full max-w-xl border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                    <CardContent className="flex flex-col items-center p-10 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            <ShoppingBag className="h-10 w-10 text-cyan-300" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Cart</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Your cart is empty</h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                            Add products you like and review them here before heading to checkout.
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
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Cart</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Shopping cart</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} ready for checkout
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                            <CardContent className="p-5">
                                <div className="flex gap-4">
                                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="text-lg font-semibold tracking-tight hover:text-cyan-300"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            ${item.price.toFixed(2)} USD
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center gap-4">
                                            <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="h-10 rounded-full px-3"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="min-w-[44px] px-4 py-1 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="h-10 rounded-full px-3"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Total</p>
                                        <p className="text-lg font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        variant="outline"
                        onClick={clearCart}
                        className="h-12 w-full rounded-full border-white/10 bg-white/5"
                    >
                        Clear Cart
                    </Button>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-4 border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold">
                                    {totalPrice > 50 ? 'FREE' : '$5.00'}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">
                                    ${(totalPrice + (totalPrice > 50 ? 0 : 5)).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button className="h-12 w-full rounded-full" size="lg" asChild>
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-12 w-full rounded-full border-white/10 bg-white/5" asChild>
                                <Link href="/products">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
