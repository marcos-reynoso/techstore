"use client"

import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
    const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Add some products to get started
                </p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative h-24 w-24 rounded-lg overflow-hidden">
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
                                            className="font-semibold hover:text-primary"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ${item.price.toFixed(2)} each
                                        </p>

                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center border rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="px-4 py-1 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg">
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
                        className="w-full"
                    >
                        Clear Cart
                    </Button>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
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
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
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