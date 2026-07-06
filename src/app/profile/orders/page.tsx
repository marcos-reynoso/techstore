"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useCallback, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { toast } from "sonner"
import { useOrdersStore } from "@/store/orders-store"
import { OrderStatus } from "@/store/orders-store"

export default function OrdersPage() {
    const { data: session, status } = useSession()
    const userId = useMemo(() => (session?.user as { id: string })?.id as string | undefined, [session])

    const {
        orders,
        isLoading,
        error,
        pagination,
        filters,
        setFilters,
        loadOrders,
        cancelOrder,
    } = useOrdersStore()

    const refreshOrders = useCallback(() => {
        if (status === "authenticated" && userId) {
            loadOrders({ userId, page: 1, limit: 10 })
        }
    }, [loadOrders, status, userId])

    useEffect(() => {
        refreshOrders()
    }, [refreshOrders])

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

    const onChangePage = (nextPage: number) => {
        if (!userId) return
        loadOrders({ userId, page: nextPage, limit: pagination.limit, status: filters.status as OrderStatus })
    }

    const onChangeStatus = (value: string) => {
        if (!userId) return
        const next = value as OrderStatus
        setFilters({ status: next })
        loadOrders({ userId, page: 1, limit: pagination.limit, status: next })
    }

    const handleCancel = async (orderId: string) => {
        const ok = confirm("Are you sure you want to cancel this order?")
        if (!ok) return
        const success = await cancelOrder(orderId)
        if (success) {
            toast.success("Order cancelled")
            if (userId) loadOrders({ userId, page: pagination.page, limit: pagination.limit, status: filters.status as OrderStatus })
        } else if (error) {
            toast.error(error)
        } else {
            toast.error("Failed to cancel order")
        }
    }

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
    const formatMoney = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Orders</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">My Orders</h1>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">Manage and track your orders</p>
                    </div>
                    <Select value={(filters.status ?? 'all').toString()} onValueChange={onChangeStatus}>
                        <SelectTrigger className="w-40 rounded-full border-white/10 bg-white/5">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground backdrop-blur">Loading orders...</div>
            )}
            {error && !isLoading && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400 backdrop-blur">{error}</div>
            )}

            {!isLoading && orders.length === 0 && !error && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                    <p className="text-muted-foreground">You have no orders yet.</p>
                </div>
            )}

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Card key={order.id} className="border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                                <div className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={order.status === OrderStatus.PENDING ? 'secondary' : order.status === OrderStatus.CANCELLED ? 'destructive' : 'default'}>
                                    {order.status}
                                </Badge>
                                <div className="font-medium">{formatMoney(order.total)}</div>
                                {order.status === OrderStatus.PENDING && (
                                    <Button variant="outline" size="sm" onClick={() => handleCancel(order.id)} className="rounded-full border-white/10 bg-white/5">
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm text-muted-foreground">
                                Shipping: {order.shippingCity}, {order.shippingAddress}
                            </div>
                            <div className="flex flex-col gap-3">
                                {order.orderItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3">
                                        {item.product?.image && (
                                            <Image src={item.product.image} alt={item.product.name} width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-medium line-clamp-1">{item.product?.name}</div>
                                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="text-sm">{formatMoney(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {orders.length > 0 && (
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page <= 1 || isLoading}
                            onClick={() => onChangePage(pagination.page - 1)}
                            className="rounded-full border-white/10 bg-white/5"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= Math.max(1, pagination.totalPages) || isLoading}
                            onClick={() => onChangePage(pagination.page + 1)}
                            className="rounded-full border-white/10 bg-white/5"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
