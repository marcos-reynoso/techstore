
import { create } from 'zustand'

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    UNDEFINED = 'UNDEFINED',
    ALL = 'ALL'
}

export interface OrderItemProduct {
    id: string
    name: string
    image: string | null
    slug: string
    price?: number
}

export interface OrderItemDetail {
    id: string
    productId: string
    quantity: number
    price: number
    product?: OrderItemProduct
}

export interface OrderSummary {
    id: string
    orderNumber: string
    userId: string
    total: number
    status: OrderStatus | null
    shippingName: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    createdAt: string
    updatedAt: string
    orderItems: OrderItemDetail[]
    user?: {
        id: string
        name: string
        email: string
    }
}

export interface OrdersFilters {
    status?: OrderStatus | null
}

export interface OrdersPagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface OrdersState {
    orders: OrderSummary[]
    selectedOrder: OrderSummary | null
    isLoading: boolean
    error: string | null
    filters: OrdersFilters
    pagination: OrdersPagination

    // actions
    setFilters: (partial: Partial<OrdersFilters>) => void
    loadOrders: (params: { userId: string; status?: OrderStatus | 'all'; page?: number; limit?: number }) => Promise<void>
    getOrder: (id: string) => Promise<void>
    createOrder: (payload: {
        userId: string
        items: { productId: string; quantity: number; price: number }[]
        shippingName: string
        shippingEmail: string
        shippingAddress: string
        shippingCity: string
        shippingZip: string
    }) => Promise<OrderSummary | null>
    cancelOrder: (id: string) => Promise<boolean>
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>
    reset: () => void
}

function buildQuery(params: Record<string, string | number | undefined>) {
    const usp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') usp.set(k, String(v))
    })
    return usp.toString()
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
    filters: { status: OrderStatus.PENDING },
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },

    setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),

    loadOrders: async ({ userId, status, page, limit }) => {
        set({ isLoading: true, error: null })
        try {
            const current = get()
            const q = buildQuery({
                userId,
                status: (status ?? current.filters.status) && (status ?? current.filters.status) !== 'all' ? (status ?? current.filters.status)! : undefined,
                page: page ?? current.pagination.page,
                limit: limit ?? current.pagination.limit,
            })

            const res = await fetch(`/api/orders?${q}`, { cache: 'no-store' })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || `Failed to load orders (${res.status})`)
            }
            const data = await res.json() as { orders: OrderSummary[]; pagination: { page: number; limit: number; total: number; totalPages: number } }

            set({
                orders: data.orders,
                pagination: {
                    page: data.pagination.page,
                    limit: data.pagination.limit,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages,
                },
                isLoading: false,
                error: null,
            })
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Unexpected error' })
        }
    },

    getOrder: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || `Failed to load order (${res.status})`)
            }
            const order = await res.json() as OrderSummary
            set({ selectedOrder: order, isLoading: false, error: null })
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Unexpected error' })
        }
    },

    createOrder: async (payload) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || `Failed to create order (${res.status})`)
            }
            const order = await res.json() as OrderSummary
            set({ isLoading: false, error: null })
            return order
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Unexpected error' })
            return null
        }
    },

    cancelOrder: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || `Failed to cancel order (${res.status})`)
            }
            // update local list
            const remaining = get().orders.filter(o => o.id !== id)
            const pag = get().pagination
            const total = Math.max(0, pag.total - 1)
            const totalPages = pag.limit > 0 ? Math.max(1, Math.ceil(total / pag.limit)) : 1
            set({
                orders: remaining,
                pagination: { ...pag, total, totalPages },
                isLoading: false,
                error: null,
            })
            if (get().selectedOrder?.id === id) set({ selectedOrder: null })
            return true
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Unexpected error' })
            return false
        }
    },

    updateOrderStatus: async (id: string, status: OrderStatus) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || `Failed to update order (${res.status})`)
            }
            const updated = await res.json() as OrderSummary

            // update in collection
            const list = get().orders
            const idx = list.findIndex(o => o.id === id)
            if (idx !== -1) {
                const newList = [...list]
                newList[idx] = updated
                set({ orders: newList })
            }
            if (get().selectedOrder?.id === id) set({ selectedOrder: updated })

            set({ isLoading: false, error: null })
            return true
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Unexpected error' })
            return false
        }
    },

    reset: () => set({
        orders: [],
        selectedOrder: null,
        isLoading: false,
        error: null,
        filters: { status: OrderStatus.PENDING },
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
}))
