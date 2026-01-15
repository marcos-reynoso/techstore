"use client"

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useOrdersStore } from "@/store/orders-store"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const userId = useMemo(() => (session?.user as any)?.id as string | undefined, [session])

    const { items, totalPrice, clearCart } = useCartStore()
    const { createOrder, isLoading, error } = useOrdersStore()

    const [shippingName, setShippingName] = useState("")
    const [shippingEmail, setShippingEmail] = useState("")
    const [shippingAddress, setShippingAddress] = useState("")
    const [shippingCity, setShippingCity] = useState("")
    const [shippingZip, setShippingZip] = useState("")

    useEffect(() => {
        if (session?.user) {
            setShippingName((session.user as any)?.name || "")
            setShippingEmail((session.user as any)?.email || "")
        }
    }, [session])

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

    if (items.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some products to proceed to checkout</p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    const shippingCost = totalPrice > 50 ? 0 : 5
    const grandTotal = totalPrice + shippingCost

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) {
            toast.error("Missing user ID")
            return
        }
        if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity || !shippingZip) {
            toast.error("Please complete all shipping fields")
            return
        }

        const payload = {
            userId,
            items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            shippingName,
            shippingEmail,
            shippingAddress,
            shippingCity,
            shippingZip,
        }

        const order = await createOrder(payload)
        if (order) {
            clearCart()
            toast.success(`Order ${order.orderNumber} created`)
            router.push("/profile/orders")
        } else {
            toast.error(error || "Failed to create order")
        }
    }

    const formatMoney = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div>
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="text-muted-foreground">Enter your shipping details and review your order</p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={shippingName} onChange={(e) => setShippingName(e.target.value)} required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={shippingEmail} onChange={(e) => setShippingEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP / Postal Code</Label>
                                <Input id="zip" value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} required />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="text-sm">{formatMoney(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{formatMoney(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold">{shippingCost === 0 ? 'FREE' : formatMoney(shippingCost)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">{formatMoney(grandTotal)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Placing order...' : 'Place Order'}
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/cart">Back to Cart</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    )
}
