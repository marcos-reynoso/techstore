"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { OrderStatus, OrderSummary } from "@/store/orders-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

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

    const loadOrders = useCallback(async (nextPage: number, mode: "replace" | "append") => {
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
    }, [limit, session?.user?.id])

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
    }, [loadOrders, session?.user?.id])

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

    if (sessionStatus === "loading") return <div className="flex flex-1 items-center justify-center p-4"><p className="text-muted-foreground">Loading...</p></div>
    if (!session) return null

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Tracking</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Track your order</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Select one of your orders to see its shipping progress.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Your orders</div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoadingList}
                            onClick={() => loadOrders(1, "replace")}
                            className="rounded-full border-white/10 bg-white/5"
                        >
                            <RefreshCw className="mr-2 h-3 w-3" />
                            {isLoadingList ? "Loading..." : "Refresh"}
                        </Button>
                    </div>

                    {orders.length === 0 && !isLoadingList ? (
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardContent className="p-4 text-sm text-muted-foreground">No orders found.</CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {orders.map((o) => {
                                const isActive = selectedOrderNumber === o.orderNumber
                                return (
                                    <Card
                                        key={o.id}
                                        className={`cursor-pointer border-white/10 bg-white/5 backdrop-blur transition-all duration-200 hover:bg-white/10 ${isActive ? "border-cyan-300/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : ""}`}
                                        onClick={() => loadSelectedOrder(o.orderNumber)}
                                    >
                                        <CardContent className="p-3">
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
                                        </CardContent>
                                    </Card>
                                )
                            })}

                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full border-white/10 bg-white/5"
                                    disabled={isLoadingList || page >= totalPages}
                                    onClick={() => loadOrders(page + 1, "append")}
                                >
                                    {page >= totalPages ? "No more orders" : isLoadingList ? "Loading..." : "Load more"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-semibold">Tracking</div>

                    {!selectedOrderNumber ? (
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardContent className="p-4 text-sm text-muted-foreground">Select an order to see tracking.</CardContent>
                        </Card>
                    ) : isLoadingDetail ? (
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardContent className="p-4 text-sm">Loading order...</CardContent>
                        </Card>
                    ) : order ? (
                        <Card className="border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                            <CardContent className="space-y-4 p-4">
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
                                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
                                        This order was cancelled.
                                    </div>
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
                                                        className={`rounded-2xl border px-3 py-2 ${done ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-foreground/60"}`}
                                                    >
                                                        <div className="text-sm font-medium">{s.label}</div>
                                                        <div className={`text-xs ${done ? "text-emerald-400/80" : "text-muted-foreground"}`}>
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
                                            <div key={it.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
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
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardContent className="p-4 text-sm text-muted-foreground">Could not load order.</CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {error && (
                <div className="max-w-xl rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</div>
            )}
        </div>
    )
}
