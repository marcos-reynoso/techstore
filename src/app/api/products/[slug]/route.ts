import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getProductBySlug } from '@/lib/catalog'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await params
        const product = await getProductBySlug(resolvedParams.slug)

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }


        return NextResponse.json(product)
    } catch (error) {
        logger.error('Error fetching product by slug:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
