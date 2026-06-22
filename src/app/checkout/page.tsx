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
import { checkoutSchema } from "@/lib/validations/checkout"
import { getZodMessage } from "@/lib/zod"
import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react"

export default function CheckoutPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const userId = useMemo(() => session?.user?.id, [session])

    const { items, totalPrice, clearCart } = useCartStore()
    const { createOrder, isLoading, error } = useOrdersStore()

    const [shippingName, setShippingName] = useState("")
    const [shippingEmail, setShippingEmail] = useState("")
    const [shippingAddress, setShippingAddress] = useState("")
    const [shippingCity, setShippingCity] = useState("")
    const [shippingZip, setShippingZip] = useState("")

    useEffect(() => {
        if (session?.user) {
            setShippingName(session.user.name || "")
            setShippingEmail(session.user.email || "")
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
                <Button asChild className="rounded-full">
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    const shippingCost = totalPrice > 50 ? 0 : 5
    const grandTotal = totalPrice + shippingCost

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            userId,
            items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            shippingName,
            shippingEmail,
            shippingAddress,
            shippingCity,
            shippingZip,
        }

        const validated = checkoutSchema.safeParse(payload)
        if (!validated.success) {
            toast.error(getZodMessage(validated.error, "Please review the checkout form"))
            return
        }

        const order = await createOrder(validated.data)
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
        <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-12">
            <div className="space-y-6">
                <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Checkout</p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight">Complete your order</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                        Review your shipping details and confirm the order from a cleaner, more intentional purchase flow.
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
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

                <Card className="border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-3">
                                <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-cyan-300">
                                        {item.name}
                                    </Link>
                                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-sm font-medium">{formatMoney(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="sticky top-4 border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
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
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between text-lg">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">{formatMoney(grandTotal)}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isLoading}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isLoading ? 'Placing order...' : 'Place Order'}
                        </Button>
                        <Button asChild variant="outline" className="h-11 w-full rounded-full border-white/10 bg-white/5">
                            <Link href="/cart">Back to Cart</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                        { title: "Trusted checkout", text: "Encrypted session and cart validation.", icon: ShieldCheck },
                        { title: "Live order number", text: "Order tracking starts as soon as you confirm.", icon: BadgeCheck },
                        { title: "Fast review", text: "Clear summary before you finalize the purchase.", icon: CreditCard },
                    ].map((item) => (
                        <Card key={item.title} className="border-white/10 bg-white/5 backdrop-blur">
                            <CardContent className="p-5">
                                <item.icon className="h-5 w-5 text-cyan-300" />
                                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </form>
    )
}
