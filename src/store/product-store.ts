
import { create } from 'zustand'

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    image: string
    images: string[]
    stock: number
    featured: boolean
    active: boolean
    category: {
        id: string
        name: string
        slug: string
        description?: string
        image?: string
        createdAt: string
        updatedAt: string
    }
    categoryId: string
    createdAt: string
    updatedAt: string
    reviews: {
        id: string
        rating: number
        comment: string
        userId: string
        productId: string
        createdAt: string
        updatedAt: string
    }[]
}

export interface ProductFilters {
    category: string
    priceRange: [number, number]
    rating: number
    inStock: boolean
    featured: boolean
    search: string
    sortBy: 'name' | 'price' | 'created' | 'rating'
    sortOrder: 'asc' | 'desc'
}

export interface ProductState {
    products: Product[]
    filteredProducts: Product[]
    filters: ProductFilters
    isLoading: boolean
    error: string | null


    setProducts: (products: Product[]) => void
    setFilters: (filters: Partial<ProductFilters>) => void
    resetFilters: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void


    getProductById: (id: string) => Product | undefined
    getProductBySlug: (slug: string) => Product | undefined
    getFeaturedProducts: () => Product[]
    getProductsByCategory: (categorySlug: string) => Product[]
}

export const defaultFilters: ProductFilters = {
    category: 'all',
    priceRange: [0, 2000],
    rating: 0,
    inStock: false,
    featured: false,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
}

export const applyFilters = (products: Product[], filters: ProductFilters): Product[] => {
    let filtered = [...products]


    if (filters.category !== 'all') {
        filtered = filtered.filter(product =>
            product.category.slug === filters.category
        )
    }


    filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    )


    if (filters.inStock) {
        filtered = filtered.filter(product => product.stock > 0)
    }


    if (filters.featured) {
        filtered = filtered.filter(product => product.featured)
    }


    if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.name.toLowerCase().includes(searchLower)
        )
    }


    filtered.sort((a, b) => {
        let aValue: any, bValue: any

        switch (filters.sortBy) {
            case 'price':
                aValue = a.price
                bValue = b.price
                break
            case 'created':
                aValue = new Date(a.createdAt)
                bValue = new Date(b.createdAt)
                break
            case 'name':
            default:
                aValue = a.name.toLowerCase()
                bValue = b.name.toLowerCase()
                break
        }

        if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        }
    })

    return filtered
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    filteredProducts: [],
    filters: defaultFilters,
    isLoading: false,
    error: null,

    setProducts: (products) => {
        const filteredProducts = applyFilters(products, get().filters)
        set({ products, filteredProducts })
    },

    setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters }
        const filteredProducts = applyFilters(get().products, filters)
        set({ filters, filteredProducts })
    },

    resetFilters: () => {
        const filteredProducts = applyFilters(get().products, defaultFilters)
        set({ filters: defaultFilters, filteredProducts })
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    getProductById: (id) => get().products.find(p => p.id === id),

    getProductBySlug: (slug) => get().products.find(p => p.slug === slug),

    getFeaturedProducts: () => get().products.filter(p => p.featured),

    getProductsByCategory: (categorySlug) =>
        get().products.filter(p => p.category.slug === categorySlug)
}))