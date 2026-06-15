import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import CheckoutPage from '../app/checkout/page'
import { useCartStore } from '../store/cart-store'
import { useOrdersStore } from '../store/orders-store'
import { toast } from 'sonner'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: pushMock }),
    redirect: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('next/link', () => ({
    default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <div>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    CardFooter: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, disabled, type, asChild }: any) =>
        asChild ? <>{children}</> : <button type={type} disabled={disabled}>{children}</button>,
}))

vi.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock('@/components/ui/separator', () => ({
    Separator: () => <hr />,
}))

const mockSession = {
    user: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
}

const mockCartItems = [
    { id: 'prod-1', name: 'Mouse Gamer', price: 100, quantity: 2, image: '/mouse.jpg', slug: 'mouse-gamer', stock: 10 },
]

function fillShippingForm() {
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Buenos Aires' } })
    fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '1000' } })
}

describe('CheckoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated' } as any)

        useCartStore.setState({
            items: mockCartItems,
            totalItems: 2,
            totalPrice: 200,
        })

        useOrdersStore.setState({
            isLoading: false,
            error: null,
            createOrder: vi.fn().mockResolvedValue(null),
        } as any)
    })

    it('should render shipping form and order summary', () => {
        render(<CheckoutPage />)

        expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Address')).toBeInTheDocument()
        expect(screen.getByLabelText('City')).toBeInTheDocument()
        expect(screen.getByLabelText('ZIP / Postal Code')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Place Order' })).toBeInTheDocument()
    })

    it('should pre-fill name and email from session', () => {
        render(<CheckoutPage />)

        expect(screen.getByLabelText('Full Name')).toHaveValue('John Doe')
        expect(screen.getByLabelText('Email')).toHaveValue('john@example.com')
    })

    it('should show cart items in the form', () => {
        render(<CheckoutPage />)
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
        expect(screen.getByText('Qty: 2')).toBeInTheDocument()
    })

    it('should show FREE shipping when total > 50', () => {
        render(<CheckoutPage />)
        expect(screen.getByText('FREE')).toBeInTheDocument()
    })

    it('should show shipping cost when total <= 50', () => {
        useCartStore.setState({
            items: [{ ...mockCartItems[0], price: 20, quantity: 1 }],
            totalItems: 1,
            totalPrice: 20,
        })

        render(<CheckoutPage />)
        expect(screen.getByText('$5.00')).toBeInTheDocument()
    })

    it('should show empty cart message when cart is empty', () => {
        useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 })

        render(<CheckoutPage />)
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
        expect(screen.getByText('Browse Products')).toBeInTheDocument()
    })

    it('should show loading state when status is loading', () => {
        vi.mocked(useSession).mockReturnValue({ data: null, status: 'loading' } as any)

        render(<CheckoutPage />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should show error toast when shipping fields are incomplete', async () => {
        render(<CheckoutPage />)

       
        fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Buenos Aires' } })
        fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '1000' } })
        fireEvent.submit(screen.getByRole('button', { name: 'Place Order' }).closest('form')!)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please complete all shipping fields')
        })
    })

    it('should create order and redirect on success', async () => {
        const mockOrder = { orderNumber: 'ORD-001' }
        useOrdersStore.setState({
            isLoading: false,
            error: null,
            createOrder: vi.fn().mockResolvedValue(mockOrder),
        } as any)

        render(<CheckoutPage />)
        fillShippingForm()
        fireEvent.submit(screen.getByRole('button', { name: 'Place Order' }).closest('form')!)

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Order ORD-001 created')
            expect(pushMock).toHaveBeenCalledWith('/profile/orders')
        })
    })

    it('should show error toast when createOrder fails', async () => {
        useOrdersStore.setState({
            isLoading: false,
            error: 'Failed to create order',
            createOrder: vi.fn().mockResolvedValue(null),
        } as any)

        render(<CheckoutPage />)
        fillShippingForm()
        fireEvent.submit(screen.getByRole('button', { name: 'Place Order' }).closest('form')!)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to create order')
        })
    })

    it('should disable button while order is loading', () => {
        useOrdersStore.setState({ isLoading: true } as any)

        render(<CheckoutPage />)
        expect(screen.getByRole('button', { name: 'Placing order...' })).toBeDisabled()
    })
})