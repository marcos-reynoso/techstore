
export type { CartItem } from '@/store/cart-store'
export type { Product, ProductFilters } from '@/store/product-store'

export interface WishlistItem {
    id: string
    name: string
    slug: string
    price: number
    image: string
    stock: number
}

export interface ProfileUpdateData {
    name?: string
    email?: string
    avatar?: string
    currentPassword?: string
    newPassword?: string
}

export interface UserUpdateData {
    name?: string
    email?: string
    avatar?: string
    password?: string
}

export type SortValue = string | number | Date

export interface ProductSortData {
    aValue: SortValue
    bValue: SortValue
}

export interface ApiError {
    error: string
    details?: unknown
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface SessionUser {
    id: string
    name: string | null
    email: string | null
    avatar: string | null
    role: string
}

export interface OrderItem {
    productId: string
    quantity: number
    price: number
}

export interface CreateOrderData {
    items: OrderItem[]
    shippingAddress: string
    paymentMethod: string
}
