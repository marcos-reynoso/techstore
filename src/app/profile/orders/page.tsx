"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { toast } from "sonner"
import { useOrdersStore } from "@/store/orders-store"

export default function OrdersPage() {
    const { data: session, status } = useSession()
    const userId = useMemo(() => (session?.user as any)?.id as string | undefined, [session])

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

    useEffect(() => {
        if (status === "authenticated" && userId) {
            loadOrders({ userId, page: 1, limit: 10 })
        }
    }, [status, userId])

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
        loadOrders({ userId, page: nextPage, limit: pagination.limit, status: filters.status })
    }

    const onChangeStatus = (value: string) => {
        if (!userId) return
        const next = value as any
        setFilters({ status: next })
        loadOrders({ userId, page: 1, limit: pagination.limit, status: next })
    }

    const handleCancel = async (orderId: string) => {
        const ok = confirm("Are you sure you want to cancel this order?")
        if (!ok) return
        const success = await cancelOrder(orderId)
        if (success) {
            toast.success("Order cancelled")
            if (userId) loadOrders({ userId, page: pagination.page, limit: pagination.limit, status: filters.status })
        } else if (error) {
            toast.error(error)
        } else {
            toast.error("Failed to cancel order")
        }
    }

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
    const formatMoney = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">Manage and track your orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={(filters.status ?? 'all').toString()} onValueChange={onChangeStatus}>
                        <SelectTrigger className="w-40">
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
                <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading orders...</div>
            )}
            {error && !isLoading && (
                <div className="rounded-md border p-4 text-sm text-destructive">{error}</div>
            )}

            {!isLoading && orders.length === 0 && !error && (
                <div className="rounded-md border p-6 text-center">
                    <p className="text-muted-foreground">You have no orders yet.</p>
                </div>
            )}

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                                <div className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={order.status === 'PENDING' ? 'secondary' : order.status === 'CANCELLED' ? 'destructive' : 'default'}>
                                    {order.status}
                                </Badge>
                                <div className="font-medium">{formatMoney(order.total)}</div>
                                {order.status === 'PENDING' && (
                                    <Button variant="outline" size="sm" onClick={() => handleCancel(order.id)}>
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
                                    <div key={item.id} className="flex items-center gap-3">
                                        {item.product?.image && (
                                            <Image src={item.product.image} alt={item.product.name} width={56} height={56} className="h-14 w-14 rounded object-cover" />
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
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= Math.max(1, pagination.totalPages) || isLoading}
                            onClick={() => onChangePage(pagination.page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

