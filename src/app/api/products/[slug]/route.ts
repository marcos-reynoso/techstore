import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: params.slug },
            include: {
                category: {
                    select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true }
                },
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                _count: {
                    select: { reviews: true }
                }
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }


        const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0


        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                active: true
            },
            include: {
                category: {
                    select: { id: true, name: true, slug: true, description: true, image: true, createdAt: true, updatedAt: true }
                },
                _count: {
                    select: { reviews: true }
                }
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        })

        // Serializar producto principal
        const serializedProduct = {
            ...product,
            price: product.price.toNumber(),
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            category: {
                ...product.category,
                description: product.category.description || undefined,
                image: product.category.image || undefined,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString()
            },
            reviews: product.reviews.map(review => ({
                ...review,
                createdAt: review.createdAt.toISOString(),
                updatedAt: review.updatedAt.toISOString()
            })),
            avgRating: Math.round(avgRating * 10) / 10,
            relatedProducts: relatedProducts.map(rp => ({
                ...rp,
                price: rp.price.toNumber(),
                createdAt: rp.createdAt.toISOString(),
                updatedAt: rp.updatedAt.toISOString(),
                category: {
                    ...rp.category,
                    description: rp.category.description || undefined,
                    image: rp.category.image || undefined,
                    createdAt: rp.category.createdAt.toISOString(),
                    updatedAt: rp.category.updatedAt.toISOString()
                }
            }))
        }

        return NextResponse.json(serializedProduct)
    } catch (error) {
        console.error('Error fetching product by slug:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}