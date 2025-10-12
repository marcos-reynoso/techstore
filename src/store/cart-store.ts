import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
    stock: number
}

interface CartState {
    items: CartItem[]
    totalItems: number
    totalPrice: number

    addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void


    getItem: (id: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addItem: (product, quantity = 1) => {
                const items = get().items
                const existingItem = items.find(item => item.id === product.id)

                let newItems: CartItem[]

                if (existingItem) {
                    const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
                    newItems = items.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                } else {
                    const safeQuantity = Math.min(quantity, product.stock)
                    newItems = [...items, { ...product, quantity: safeQuantity }]
                }

                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
                const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                set({ items: newItems, totalItems, totalPrice })
            },

            removeItem: (id) => {
                const newItems = get().items.filter(item => item.id !== id)
                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
                const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                set({ items: newItems, totalItems, totalPrice })
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                    return
                }

                const newItems = get().items.map(item =>
                    item.id === id ? { ...item, quantity } : item
                )

                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
                const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                set({ items: newItems, totalItems, totalPrice })
            },

            clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

            getItem: (id) => get().items.find(item => item.id === id)
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items })
        }
    )
)