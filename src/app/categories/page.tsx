import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            },
            products: {
                select: { stock: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Categories</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Browse by collection</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    Navigate the catalog through a cleaner, editorial presentation of each collection.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                    <Link key={category.id} href={`/products?category=${category.slug}`}>
                        <Card className="group h-full overflow-hidden border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(0,0,0,0.26)]">
                            <div className="relative aspect-4/3 overflow-hidden">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(45,212,191,0.16),rgba(251,191,36,0.12))]" />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <Badge className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
                                        <Sparkles className="mr-1 h-3 w-3 text-cyan-300" />
                                        Collection
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="space-y-3">
                                <CardTitle className="flex items-center justify-between gap-4">
                                    <span>{category.name}</span>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                                        {category._count.products}
                                    </span>
                                </CardTitle>
                                {category.description && (
                                    <CardDescription className="line-clamp-2 leading-6">
                                        {category.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <div className="px-6 pb-6">
                                <div className="inline-flex items-center text-sm font-medium text-cyan-300">
                                    Explore category
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
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
