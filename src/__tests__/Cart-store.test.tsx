import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../store/cart-store'

const product = {
    id: '1',
    name: 'Product 1',
    price: 100,
    image: 'https://via.placeholder.com/150',
    slug: 'product-1',
    stock: 10,
}

describe('Cart Store', () => {
    beforeEach(() => {
        useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 })
    })

    it('should add item to cart', () => {
        useCartStore.getState().addItem(product)

        const { items, totalItems, totalPrice } = useCartStore.getState()
        expect(items).toHaveLength(1)
        expect(totalItems).toBe(1)
        expect(totalPrice).toBe(100)
    })

    it('should remove item from cart', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().removeItem('1')

        const { items, totalItems, totalPrice } = useCartStore.getState()
        expect(items).toHaveLength(0)
        expect(totalItems).toBe(0)
        expect(totalPrice).toBe(0)
    })

    it('should update item quantity', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().updateQuantity('1', 2)

        const { items, totalItems, totalPrice } = useCartStore.getState()
        expect(items[0].quantity).toBe(2)
        expect(totalItems).toBe(2)
        expect(totalPrice).toBe(200)
    })

    it('should not exceed stock when updating quantity', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().updateQuantity('1', 99) // stock es 10

        const { items } = useCartStore.getState()
        expect(items[0].quantity).toBe(10)
    })

    it('should remove item when quantity is set to 0', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().updateQuantity('1', 0)

        expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should increment quantity if item already exists', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().addItem(product)

        const { items, totalItems } = useCartStore.getState()
        expect(items).toHaveLength(1)
        expect(totalItems).toBe(2)
    })

    it('should clear cart', () => {
        useCartStore.getState().addItem(product)
        useCartStore.getState().clearCart()

        const { items, totalItems, totalPrice } = useCartStore.getState()
        expect(items).toHaveLength(0)
        expect(totalItems).toBe(0)
        expect(totalPrice).toBe(0)
    })

    it('should get item by id', () => {
        useCartStore.getState().addItem(product)

        const found = useCartStore.getState().getItem('1')
        expect(found).toBeDefined()
        expect(found?.name).toBe('Product 1')
    })
})