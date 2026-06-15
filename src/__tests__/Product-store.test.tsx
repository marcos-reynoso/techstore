import { describe, it, expect, beforeEach } from 'vitest'
import { useProductStore, applyFilters, defaultFilters } from '../store/product-store'
import type { Product } from '../store/product-store'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    id: '1',
    name: 'Mouse Gamer',
    slug: 'mouse-gamer',
    description: 'one mouse for gamers',
    price: 100,
    image: '',
    images: [],
    stock: 10,
    featured: false,
    active: true,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Electronics', slug: 'electronics', createdAt: '', updatedAt: '' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    reviews: [],
    ...overrides,
})

const products: Product[] = [
    makeProduct({ id: '1', name: 'Mouse Gamer', price: 100, stock: 10, featured: true }),
    makeProduct({ id: '2', name: 'Mecanical Keyboard', slug: 'mecanical-keyboard', price: 200, stock: 0, featured: false }),
    makeProduct({ id: '3', name: 'Monitor 4K', slug: 'monitor-4k', price: 500, stock: 5, featured: false, category: { id: 'cat-2', name: 'Monitor', slug: 'monitor', createdAt: '', updatedAt: '' }, categoryId: 'cat-2' }),
]

describe('applyFilters', () => {
    it('should return all products with default filters', () => {
        const result = applyFilters(products, defaultFilters)
        expect(result).toHaveLength(3)
    })

    it('should filter by category', () => {
        const result = applyFilters(products, { ...defaultFilters, category: 'monitor' })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Monitor 4K')
    })

    it('should filter by price range', () => {
        const result = applyFilters(products, { ...defaultFilters, priceRange: [0, 150] })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Mouse Gamer')
    })

    it('should filter by inStock', () => {
        const result = applyFilters(products, { ...defaultFilters, inStock: true })
        expect(result).toHaveLength(2)
        expect(result.every(p => p.stock > 0)).toBe(true)
    })

    it('should filter by featured', () => {
        const result = applyFilters(products, { ...defaultFilters, featured: true })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Mouse Gamer')
    })

    it('should filter by search (name)', () => {
        const result = applyFilters(products, { ...defaultFilters, search: 'mecanical' })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Mecanical Keyboard')
    })

    it('should filter by search (category name)', () => {
        const result = applyFilters(products, { ...defaultFilters, search: 'monitor' })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Monitor 4K')
    })

    it('should sort by price asc', () => {
        const result = applyFilters(products, { ...defaultFilters, sortBy: 'price', sortOrder: 'asc' })
        expect(result[0].price).toBe(100)
        expect(result[2].price).toBe(500)
    })

    it('should sort by price desc', () => {
        const result = applyFilters(products, { ...defaultFilters, sortBy: 'price', sortOrder: 'desc' })
        expect(result[0].price).toBe(500)
        expect(result[2].price).toBe(100)
    })

    it('should sort by name asc', () => {
        const result = applyFilters(products, { ...defaultFilters, sortBy: 'name', sortOrder: 'asc' })
        expect(result[0].name).toBe('Mecanical Keyboard')
        expect(result[1].name).toBe('Monitor 4K')
        expect(result[2].name).toBe('Mouse Gamer')
    })
})

describe('Product Store', () => {
    beforeEach(() => {
        useProductStore.setState({
            products: [],
            filteredProducts: [],
            filters: defaultFilters,
            isLoading: false,
            error: null,
        })
    })

    it('should set products and apply default filters', () => {
        useProductStore.getState().setProducts(products)

        const { products: stored, filteredProducts } = useProductStore.getState()
        expect(stored).toHaveLength(3)
        expect(filteredProducts).toHaveLength(3)
    })

    it('should apply filters when setFilters is called', () => {
        useProductStore.getState().setProducts(products)
        useProductStore.getState().setFilters({ category: 'monitor' })

        expect(useProductStore.getState().filteredProducts).toHaveLength(1)
    })

    it('should reset filters and reapply to all products', () => {
        useProductStore.getState().setProducts(products)
        useProductStore.getState().setFilters({ category: 'monitor' })
        useProductStore.getState().resetFilters()

        const { filters, filteredProducts } = useProductStore.getState()
        expect(filters).toEqual(defaultFilters)
        expect(filteredProducts).toHaveLength(3)
    })

    it('should set loading state', () => {
        useProductStore.getState().setLoading(true)
        expect(useProductStore.getState().isLoading).toBe(true)

        useProductStore.getState().setLoading(false)
        expect(useProductStore.getState().isLoading).toBe(false)
    })

    it('should set error', () => {
        useProductStore.getState().setError('Something went wrong')
        expect(useProductStore.getState().error).toBe('Something went wrong')

        useProductStore.getState().setError(null)
        expect(useProductStore.getState().error).toBeNull()
    })

    it('should get product by id', () => {
        useProductStore.getState().setProducts(products)
        const product = useProductStore.getState().getProductById('2')
        expect(product?.name).toBe('Mecanical Keyboard')
    })

    it('should return undefined for non-existent id', () => {
        useProductStore.getState().setProducts(products)
        const product = useProductStore.getState().getProductById('999')
        expect(product).toBeUndefined()
    })

    it('should get product by slug', () => {
        useProductStore.getState().setProducts(products)
        const product = useProductStore.getState().getProductBySlug('monitor-4k')
        expect(product?.id).toBe('3')
    })

    it('should get featured products', () => {
        useProductStore.getState().setProducts(products)
        const featured = useProductStore.getState().getFeaturedProducts()
        expect(featured).toHaveLength(1)
        expect(featured[0].name).toBe('Mouse Gamer')
    })

    it('should get products by category slug', () => {
        useProductStore.getState().setProducts(products)
        const result = useProductStore.getState().getProductsByCategory('electronics')
        expect(result).toHaveLength(2)
    })
})