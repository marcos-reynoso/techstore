import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div>
                <h1 className="text-3xl font-bold">Categories</h1>
                <p className="text-muted-foreground">Browse products by category</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                    <Link key={category.id} href={`/products?category=${category.slug}`}>
                        <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                            {category.image && (
                                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {category.name}
                                    <Badge variant="secondary">
                                        {category._count.products}
                                    </Badge>
                                </CardTitle>
                                {category.description && (
                                    <CardDescription className="line-clamp-2">
                                        {category.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-muted-foreground">No categories available</p>
                </div>
            )}
        </div>
    )
}