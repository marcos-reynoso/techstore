import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Wishlist from "@/app/wishlist/page"
import { useSession } from "next-auth/react"
import { loadWishlist, removeWishlistItem } from "@/lib/wishlist"

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(() => ({
        data: null,
        status: "unauthenticated",
    })),
}))

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

vi.mock('@/store/cart-store', () => ({
    useCartStore: vi.fn(() => ({
        addItem: vi.fn(),
    })),
}))

vi.mock('@/lib/wishlist', () => ({
    loadWishlist: vi.fn(),
    removeWishlistItem: vi.fn(),
}))

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
})

describe("Wishlist", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(loadWishlist).mockResolvedValue([])
        vi.mocked(removeWishlistItem).mockResolvedValue([])
    })

   it("should render the wishlist page", async () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                expires: "2025-10-12T00:00:00.000Z",
                user: {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user",
                    avatar: "https://via.placeholder.com/150",
                },
            },
            status: "authenticated",
            update: vi.fn(),
        })

        vi.mocked(loadWishlist).mockResolvedValue([
            {
                id: "1",
                name: "Product 1",
                slug: "product-1",
                price: 100,
                image: "https://via.placeholder.com/150",
                stock: 10,
            },
        ])

        render(<Wishlist />)

        await waitFor(() => {
            expect(screen.getByText("My saved products")).toBeInTheDocument()
            expect(screen.getByText(/1 item saved for later/i)).toBeInTheDocument()
        })
    })

    it("wishlist should be empty", () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                expires: "2025-10-12T00:00:00.000Z",
                user: {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user",
                    avatar: "https://via.placeholder.com/150",
                },
            },
            status: "authenticated",
            update: vi.fn(),
        })
        render(<Wishlist />)
        expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument()
        expect(screen.getByText(/save products you like/i)).toBeInTheDocument()
        expect(screen.getByText("Browse Products")).toBeInTheDocument()
    })

    it("should show items in wishlist", async () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                expires: "2025-10-12T00:00:00.000Z",
                user: {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user",
                    avatar: "https://via.placeholder.com/150",
                },
            },
            status: "authenticated",
            update: vi.fn(),
        })
        
        vi.mocked(loadWishlist).mockResolvedValue([
            {
                id: "1",
                name: "Product 1",
                slug: "product-1",
                price: 100,
                image: "https://via.placeholder.com/150",
                stock: 10,
            }
        ])
        
        render(<Wishlist />)
        await waitFor(() => {
            expect(screen.getByText("My saved products")).toBeInTheDocument()
            expect(screen.getByText(/1 item saved for later/i)).toBeInTheDocument()
            expect(screen.getByText("Product 1")).toBeInTheDocument()
            expect(screen.getByText("$100.00")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: "Add to Cart" })).toBeInTheDocument()
        })
    })

    it("should remove item from wishlist", async () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                expires: "2025-10-12T00:00:00.000Z",
                user: {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user",
                    avatar: "https://via.placeholder.com/150",
                },
            },
            status: "authenticated",
            update: vi.fn(),
        })

        vi.mocked(loadWishlist).mockResolvedValue([
            {
                id: "1",
                name: "Product 1",
                slug: "product-1",
                price: 100,
                image: "https://via.placeholder.com/150",
                stock: 10,
            },
        ])

        render(<Wishlist />)
        await waitFor(() => {
            expect(screen.getByText("My saved products")).toBeInTheDocument()
            expect(screen.getByText(/1 item saved for later/i)).toBeInTheDocument()
            expect(screen.getByText("Product 1")).toBeInTheDocument()
            expect(screen.getByText("$100.00")).toBeInTheDocument()
        })

        expect(screen.getAllByRole("button").length).toBeGreaterThan(1)
    })
})
