import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrdersStore, OrderStatus } from '../store/orders-store'

const mockOrder = {
    id: 'order-1',
    orderNumber: 'ORD-001',
    userId: 'user-1',
    total: 200,
    status: OrderStatus.PENDING,
    shippingName: 'John Doe',
    shippingEmail: 'john@example.com',
    shippingAddress: '123 Main St',
    shippingCity: 'Buenos Aires',
    shippingZip: '1000',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    orderItems: [],
}

const mockPayload = {
    userId: 'user-1',
    items: [{ productId: 'prod-1', quantity: 2, price: 100 }],
    shippingName: 'John Doe',
    shippingEmail: 'john@example.com',
    shippingAddress: '123 Main St',
    shippingCity: 'Buenos Aires',
    shippingZip: '1000',
}

describe('Orders Store', () => {
    beforeEach(() => {
        useOrdersStore.getState().reset()
        vi.clearAllMocks()
    })

    it('should set filters', () => {
        useOrdersStore.getState().setFilters({ status: OrderStatus.SHIPPED })
        expect(useOrdersStore.getState().filters.status).toBe(OrderStatus.SHIPPED)
    })

    it('should load orders successfully', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                orders: [mockOrder],
                pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
            }),
        })

        await useOrdersStore.getState().loadOrders({ userId: 'user-1' })

        const { orders, pagination, isLoading, error } = useOrdersStore.getState()
        expect(orders).toHaveLength(1)
        expect(orders[0].orderNumber).toBe('ORD-001')
        expect(pagination.total).toBe(1)
        expect(isLoading).toBe(false)
        expect(error).toBeNull()
    })

    it('should set error when loadOrders fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Unauthorized' }),
        })

        await useOrdersStore.getState().loadOrders({ userId: 'user-1' })

        const { error, isLoading } = useOrdersStore.getState()
        expect(error).toBe('Unauthorized')
        expect(isLoading).toBe(false)
    })

    it('should get a single order', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockOrder,
        })

        await useOrdersStore.getState().getOrder('order-1')

        const { selectedOrder, isLoading } = useOrdersStore.getState()
        expect(selectedOrder?.id).toBe('order-1')
        expect(isLoading).toBe(false)
    })

    it('should create an order and return it', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockOrder,
        })

        const result = await useOrdersStore.getState().createOrder(mockPayload)

        expect(result).not.toBeNull()
        expect(result?.orderNumber).toBe('ORD-001')
        expect(useOrdersStore.getState().isLoading).toBe(false)
    })

    it('should return null when createOrder fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Failed to create order' }),
        })

        const result = await useOrdersStore.getState().createOrder(mockPayload)

        expect(result).toBeNull()
        expect(useOrdersStore.getState().error).toBe('Failed to create order')
    })

    it('should cancel order and remove from list', async () => {
        useOrdersStore.setState({
            orders: [mockOrder],
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        })

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
        })

        const result = await useOrdersStore.getState().cancelOrder('order-1')

        expect(result).toBe(true)
        expect(useOrdersStore.getState().orders).toHaveLength(0)
        expect(useOrdersStore.getState().pagination.total).toBe(0)
    })

    it('should clear selectedOrder when cancelled order was selected', async () => {
        useOrdersStore.setState({
            orders: [mockOrder],
            selectedOrder: mockOrder,
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        })

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
        })

        await useOrdersStore.getState().cancelOrder('order-1')

        expect(useOrdersStore.getState().selectedOrder).toBeNull()
    })

    it('should update order status in list', async () => {
        const updatedOrder = { ...mockOrder, status: OrderStatus.SHIPPED }

        useOrdersStore.setState({ orders: [mockOrder] })

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => updatedOrder,
        })

        const result = await useOrdersStore.getState().updateOrderStatus('order-1', OrderStatus.SHIPPED)

        expect(result).toBe(true)
        expect(useOrdersStore.getState().orders[0].status).toBe(OrderStatus.SHIPPED)
    })

    it('should reset store to initial state', () => {
        useOrdersStore.setState({ orders: [mockOrder], error: 'some error' })
        useOrdersStore.getState().reset()

        const { orders, error, filters, pagination } = useOrdersStore.getState()
        expect(orders).toHaveLength(0)
        expect(error).toBeNull()
        expect(filters.status).toBe(OrderStatus.PENDING)
        expect(pagination.page).toBe(1)
    })
})