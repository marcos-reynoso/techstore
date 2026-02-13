"use client"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { OrderStatus, OrderSummary } from "@/store/orders-store"

export default function TrackPage() {
    const router = useRouter()
    const { data: session, status: sessionStatus } = useSession()

    const [orders, setOrders] = useState<OrderSummary[]>([])
    const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null)
    const [order, setOrder] = useState<OrderSummary | null>(null)
    const [isLoadingList, setIsLoadingList] = useState(false)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (sessionStatus === "loading") return
        if (!session) router.replace("/login")
    }, [session, sessionStatus, router])

    async function loadOrders(nextPage: number, mode: "replace" | "append") {
        if (!session?.user?.id) return
        setError(null)
        setIsLoadingList(true)
        try {
            const res = await fetch(
                `/api/orders?userId=${encodeURIComponent(session.user.id)}&page=${nextPage}&limit=${limit}`,
                { cache: "no-store" }
            )
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError((data as { error?: string })?.error || "Could not load orders")
                return
            }

            const payload = data as {
                orders: OrderSummary[]
                pagination: { page: number; limit: number; total: number; totalPages: number }
            }

            setPage(payload.pagination.page)
            setTotalPages(payload.pagination.totalPages)
            setOrders((prev) => (mode === "replace" ? payload.orders : [...prev, ...payload.orders]))
        } catch {
            setError("Network error")
        } finally {
            setIsLoadingList(false)
        }
    }

    async function loadSelectedOrder(orderNumber: string) {
        setError(null)
        setIsLoadingDetail(true)
        setSelectedOrderNumber(orderNumber)
        setOrder(null)

        try {
            const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`, {
                cache: "no-store",
            })

            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError((data as { error?: string })?.error || "Could not load order")
                return
            }

            setOrder(data as OrderSummary)
        } catch {
            setError("Network error")
        } finally {
            setIsLoadingDetail(false)
        }
    }

    useEffect(() => {
        if (!session?.user?.id) return
        loadOrders(1, "replace")

    }, [session?.user?.id])

    const tracking = useMemo(() => {
        const status = order?.status ?? null

        if (status === OrderStatus.CANCELLED) {
            return { stage: "Cancelled", stageIndex: -1, status }
        }


        if (status === OrderStatus.SHIPPED) return { stage: "Shipped", stageIndex: 1, status }
        if (status === OrderStatus.DELIVERED) return { stage: "Delivered", stageIndex: 2, status }
        if (status === OrderStatus.PENDING || status === OrderStatus.PROCESSING) {
            return { stage: "In deposit", stageIndex: 0, status }
        }

        return { stage: "In deposit", stageIndex: 0, status }
    }, [order?.status])

    if (sessionStatus === "loading") return <div className="p-6">Loading...</div>
    if (!session) return null

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Track your order</h1>
                <p className="text-sm text-muted-foreground">
                    Select one of your orders to see its shipping progress.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Your orders</div>
                        <button
                            type="button"
                            className="text-sm border rounded px-3 py-1"
                            disabled={isLoadingList}
                            onClick={() => loadOrders(1, "replace")}
                        >
                            {isLoadingList ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    {orders.length === 0 && !isLoadingList ? (
                        <div className="border rounded p-4 text-sm text-muted-foreground">No orders found.</div>
                    ) : (
                        <div className="space-y-2">
                            {orders.map((o) => {
                                const isActive = selectedOrderNumber === o.orderNumber
                                return (
                                    <button
                                        key={o.id}
                                        type="button"
                                        onClick={() => loadSelectedOrder(o.orderNumber)}
                                        className={`w-full text-left border rounded p-3 hover:bg-gray-50 ${isActive ? "border-black" : ""}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="font-mono text-sm font-semibold">{o.orderNumber}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                                            </div>
                                            <div className="text-sm font-semibold">${Number(o.total).toFixed(2)}</div>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Status: {o.status ?? OrderStatus.UNDEFINED}
                                        </div>
                                    </button>
                                )
                            })}

                            <div className="pt-2">
                                <button
                                    type="button"
                                    className="w-full border rounded px-4 py-2 text-sm"
                                    disabled={isLoadingList || page >= totalPages}
                                    onClick={() => loadOrders(page + 1, "append")}
                                >
                                    {page >= totalPages ? "No more orders" : isLoadingList ? "Loading..." : "Load more"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-semibold">Tracking</div>

                    {!selectedOrderNumber ? (
                        <div className="border rounded p-4 text-sm text-muted-foreground">Select an order to see tracking.</div>
                    ) : isLoadingDetail ? (
                        <div className="border rounded p-4 text-sm">Loading order...</div>
                    ) : order ? (
                        <div className="border rounded p-4 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Order</div>
                                    <div className="font-mono font-semibold">{order.orderNumber}</div>
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Stage:</span>{" "}
                                    <span className="font-semibold">{tracking.stage}</span>
                                </div>
                            </div>

                            {order.status === OrderStatus.CANCELLED ? (
                                <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3">This order was cancelled.</div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold">Progress</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { key: "depot", label: "In deposit" },
                                            { key: "onway", label: "In transit" },
                                            { key: "arrived", label: "Delivered" },
                                        ].map((s, idx) => {
                                            const done = tracking.stageIndex >= idx
                                            return (
                                                <div
                                                    key={s.key}
                                                    className={`border rounded px-3 py-2 ${done ? "bg-green-600 border-green-600 text-white" : "text-gray-700"
                                                        }`}
                                                >
                                                    <div className="text-sm font-medium">{s.label}</div>
                                                    <div className={`text-xs ${done ? "text-white/80" : "text-muted-foreground"}`}>
                                                        {done ? "Completed" : "Pending"}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Current status: {order.status ?? OrderStatus.UNDEFINED}</div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="text-sm font-semibold">Shipping</div>
                                <div className="text-sm">{order.shippingName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {order.shippingAddress}, {order.shippingCity} ({order.shippingZip})
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-semibold">Items</div>
                                <div className="space-y-2">
                                    {order.orderItems.map((it) => (
                                        <div key={it.id} className="flex items-center justify-between border rounded px-3 py-2">
                                            <div className="text-sm">
                                                <div className="font-medium">{it.product?.name ?? it.productId}</div>
                                                <div className="text-xs text-muted-foreground">Qty: {it.quantity}</div>
                                            </div>
                                            <div className="text-sm font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end text-sm font-semibold">Total: ${Number(order.total).toFixed(2)}</div>
                        </div>
                    ) : (
                        <div className="border rounded p-4 text-sm text-muted-foreground">Could not load order.</div>
                    )}
                </div>
            </div>

            {error && (
                <div className="max-w-xl border border-red-300 bg-red-50 text-red-700 rounded p-3">{error}</div>
            )}
        </div>
    )
}
