import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, PackageSearch, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getFeaturedProducts } from "@/lib/catalog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/products/product-card"
import { Product } from "@/store/product-store"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(4)

  const categories = await prisma.category.findMany({
    take: 6,
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  })

  const heroProduct = featuredProducts[0]

  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(251,191,36,0.11),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div className="max-w-2xl">
            <Badge className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-foreground/80 backdrop-blur">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
              Curated Tech Store
            </Badge>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              Tech products with a sharper, more editorial storefront.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A premium commerce experience for hardware, wearables, and essentials.
              Fast browsing, clean filtering, and a product-first layout that feels built, not assembled.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="rounded-full px-6 shadow-lg shadow-cyan-500/10">
                <Link href="/products">
                  Explore collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full border-white/10 bg-white/5 px-6 backdrop-blur">
                <Link href="/categories">
                  Browse categories
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Curated stock", value: "100+", icon: PackageSearch },
                { label: "Fast shipping", value: "48h", icon: Truck },
                { label: "Secure checkout", value: "SSL", icon: ShieldCheck },
              ].map((item) => (
                <Card key={item.label} className="border-white/10 bg-white/5 backdrop-blur">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <item.icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-semibold text-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
              <CardContent className="p-0">
                <div className="relative aspect-4/5 overflow-hidden">
                  {heroProduct ? (
                    <Image
                      src={heroProduct.image}
                      alt={heroProduct.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <Badge className="mb-4 rounded-full border-white/10 bg-white/10 text-white backdrop-blur">
                      Featured drop
                    </Badge>
                    <div className="max-w-sm">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                        {heroProduct?.category.name ?? "Tech essentials"}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        {heroProduct?.name ?? "Premium devices selected for the season"}
                      </h2>
                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Starting at</p>
                          <p className="text-xl font-semibold text-white">
                            ${heroProduct ? heroProduct.price.toFixed(2) : "0.00"}
                          </p>
                        </div>
                        <Button size="sm" asChild className="rounded-full">
                          <Link href={heroProduct ? `/products/${heroProduct.slug}` : "/products"}>
                            View product
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardContent className="p-5">
                  <BadgeCheck className="h-5 w-5 text-cyan-300" />
                  <h3 className="mt-4 text-lg font-semibold">Verified inventory</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Products are tracked with live stock, featured flags, and category data to keep browsing honest.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardContent className="p-5">
                  <ShieldCheck className="h-5 w-5 text-amber-300" />
                  <h3 className="mt-4 text-lg font-semibold">Checkout-ready UX</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Cart, checkout, and profile flows stay visually consistent without getting in the way of conversion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[
          {
            title: "Free shipping",
            text: "Orders over $50 get complimentary shipping.",
            icon: Truck,
          },
          {
            title: "Secure payments",
            text: "Checkout flows are structured around trust and clarity.",
            icon: ShieldCheck,
          },
          {
            title: "Easy returns",
            text: "Built for a shopping experience that feels low-friction.",
            icon: BadgeCheck,
          },
        ].map((item) => (
          <Card key={item.title} className="border-white/10 bg-white/5 backdrop-blur transition-transform duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <item.icon className="h-12 w-12 text-cyan-300" />
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Featured products</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Handpicked selection</h2>
          </div>
          <Button variant="outline" asChild className="rounded-full border-white/10 bg-white/5">
            <Link href="/products">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Categories</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Shop by category</h2>
          </div>
          <Button variant="outline" asChild className="rounded-full border-white/10 bg-white/5">
            <Link href="/categories">
              See all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(251,191,36,0.12))]" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/60">Collection</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{category.name}</h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                      {category._count.products}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
