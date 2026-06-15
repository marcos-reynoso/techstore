import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SearchForm } from '../components/search-form'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/components/ui/label', () => ({
    Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}))

vi.mock('@/components/ui/sidebar', () => ({
    SidebarInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock('lucide-react', () => ({
    Search: () => <svg data-testid="search-icon" />,
}))

const mockProducts = [
    { id: '1', name: 'Mouse Gamer', slug: 'mouse-gamer', image: '/mouse.jpg', category: { id: 'cat-1', name: 'Electronics', slug: 'electronics' } },
    { id: '2', name: 'Laptop Pro', slug: 'laptop-pro', image: '/laptop.jpg', category: { id: 'cat-2', name: 'Laptops', slug: 'laptops' } },
]


async function typeAndFlush(input: HTMLElement, value: string) {
    fireEvent.change(input, { target: { value } })
    await act(async () => {
        vi.advanceTimersByTime(300)
        await Promise.resolve()
        await Promise.resolve()
    })
}

describe('SearchForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: false })
        pushMock.mockClear()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('should render search input', () => {
        render(<SearchForm />)
        expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
    })

    it('should show results after debounce', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ products: mockProducts }),
        })

        render(<SearchForm />)
        await typeAndFlush(screen.getByPlaceholderText('Type to search...'), 'mouse')

        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    })

    it('should show "Searching..." while loading', async () => {
        global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}))

        render(<SearchForm />)
        fireEvent.change(screen.getByPlaceholderText('Type to search...'), { target: { value: 'mouse' } })

        await act(async () => {
            vi.advanceTimersByTime(300)
            await Promise.resolve()
        })

        expect(screen.getByText('Searching...')).toBeInTheDocument()
    })

    it('should show "No results" when fetch returns empty', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ products: [] }),
        })

        render(<SearchForm />)
        await typeAndFlush(screen.getByPlaceholderText('Type to search...'), 'xyz')

        expect(screen.getByText('No results')).toBeInTheDocument()
    })

    it('should show error when fetch fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Search failed' }),
        })

        render(<SearchForm />)
        await typeAndFlush(screen.getByPlaceholderText('Type to search...'), 'mouse')

        expect(screen.getByText('Search failed')).toBeInTheDocument()
    })

    it('should show "Network error" on fetch exception', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

        render(<SearchForm />)
        await typeAndFlush(screen.getByPlaceholderText('Type to search...'), 'mouse')

        expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    it('should close dropdown on Escape', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ products: mockProducts }),
        })

        render(<SearchForm />)
        const input = screen.getByPlaceholderText('Type to search...')

        await typeAndFlush(input, 'mouse')
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()

        fireEvent.keyDown(input, { key: 'Escape' })
        expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument()
    })

    it('should navigate to product on result click', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ products: mockProducts }),
        })

        render(<SearchForm />)
        await typeAndFlush(screen.getByPlaceholderText('Type to search...'), 'mouse')

        fireEvent.click(screen.getByText('Mouse Gamer'))
        expect(pushMock).toHaveBeenCalledWith('/products/mouse-gamer')
    })

    it('should navigate to search page on form submit', () => {
        render(<SearchForm />)
        const input = screen.getByPlaceholderText('Type to search...')

        fireEvent.change(input, { target: { value: 'laptop' } })
        fireEvent.submit(input.closest('form')!)

        expect(pushMock).toHaveBeenCalledWith('/products?search=laptop')
    })
})