import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {



    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices and gadgets',
                image: '/images/categories/electronics.jpg'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Laptops',
                slug: 'laptops',
                description: 'Laptops and computers',
                image: '/images/categories/laptops.jpg'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Smartphones',
                slug: 'smartphones',
                description: 'Mobile phones and accessories',
                image: '/images/categories/smartphones.jpg'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Clothing',
                slug: 'clothing',
                description: 'Fashion and apparel',
                image: '/images/categories/clothing.jpg'
            }
        })
    ])

    console.log('✅ Categories created:', categories.length)


    const products = [
        {
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'Latest iPhone with titanium design and advanced camera system. Features include A17 Pro chip, Action Button, and Pro camera system.',
            price: 999.00,
            image: '/images/products/iphone15-pro.jpg',
            images: ['/images/products/iphone15-pro-1.jpg', '/images/products/iphone15-pro-2.jpg'],
            stock: 50,
            featured: true,
            categoryId: categories.find(c => c.slug === 'smartphones')!.id
        },
        {
            name: 'MacBook Air M3',
            slug: 'macbook-air-m3',
            description: 'Powerful laptop with M3 chip, perfect for work and creativity. Up to 18 hours of battery life and stunning Liquid Retina display.',
            price: 1299.00,
            image: '/images/products/macbook-air-m3.jpg',
            images: ['/images/products/macbook-air-1.jpg', '/images/products/macbook-air-2.jpg'],
            stock: 25,
            featured: true,
            categoryId: categories.find(c => c.slug === 'laptops')!.id
        },
        {
            name: 'Samsung Galaxy S24',
            slug: 'samsung-galaxy-s24',
            description: 'Android flagship with AI features and excellent camera. Galaxy AI transforms your mobile experience with advanced capabilities.',
            price: 899.00,
            image: '/images/products/galaxy-s24.jpg',
            images: ['/images/products/galaxy-s24-1.jpg', '/images/products/galaxy-s24-2.jpg'],
            stock: 75,
            featured: false,
            categoryId: categories.find(c => c.slug === 'smartphones')!.id
        },
        {
            name: 'Dell XPS 13',
            slug: 'dell-xps-13',
            description: 'Ultra-thin laptop with stunning display and premium build. Perfect for professionals and students alike.',
            price: 1199.00,
            image: '/images/products/dell-xps-13.jpg',
            images: ['/images/products/dell-xps-1.jpg', '/images/products/dell-xps-2.jpg'],
            stock: 30,
            featured: false,
            categoryId: categories.find(c => c.slug === 'laptops')!.id
        },
        {
            name: 'Apple Watch Series 9',
            slug: 'apple-watch-series-9',
            description: 'Advanced smartwatch with health monitoring and fitness tracking. Features the new S9 chip and double tap gesture.',
            price: 399.00,
            image: '/images/products/apple-watch-s9.jpg',
            images: ['/images/products/apple-watch-1.jpg', '/images/products/apple-watch-2.jpg'],
            stock: 60,
            featured: true,
            categoryId: categories.find(c => c.slug === 'electronics')!.id
        },
        {
            name: 'Nike Air Force 1',
            slug: 'nike-air-force-1',
            description: 'Classic white sneakers, comfortable and stylish. A timeless design that never goes out of fashion.',
            price: 120.00,
            image: '/images/products/nike-af1.jpg',
            images: ['/images/products/nike-af1-1.jpg', '/images/products/nike-af1-2.jpg'],
            stock: 100,
            featured: false,
            categoryId: categories.find(c => c.slug === 'clothing')!.id
        }
    ]

    await prisma.product.createMany({ data: products })
    console.log('✅ Products created:', products.length)


    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'admin@techstore.com',
                name: 'Admin TechStore',
                role: 'ADMIN'
            }
        }),
        prisma.user.create({
            data: {
                email: 'johndoe@example.com',
                name: 'John Doe',
                role: 'CUSTOMER'
            }
        }),
        prisma.user.create({
            data: {
                email: 'customer@example.com',
                name: 'Customer Example',
                role: 'CUSTOMER'
            }
        })
    ])
    const order = await Promise.all([
        prisma.order.create({
            data: {
                orderNumber: 'TS1001',
                status: 'PROCESSING',
                total: 1898.00,
                shippingName: 'John Doe',
                shippingEmail: 'johndoe@example.com',
                shippingAddress: '123 Main St, City, Country',
                shippingCity: 'City',
                shippingZip: '12345',
                userId: users[1].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'iphone-15-pro' } }))!.id,
                            quantity: 1,
                            price: 999.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'macbook-air-m3' } }))!.id,
                            quantity: 1,
                            price: 1299.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'nike-air-force-1' } }))!.id,
                            quantity: 2,
                            price: 120.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id,
                            quantity: 1,
                            price: 399.00
                        }
                    ]
                },

            },
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1002',
                status: 'SHIPPED',
                total: 120.00,
                shippingName: 'Customer Example',
                shippingEmail: 'customer@example.com',
                shippingAddress: '456 Another St, City, Country',
                shippingCity: 'City',
                shippingZip: '67890',
                userId: users[2].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'nike-air-force-1' } }))!.id,
                            quantity: 1,
                            price: 120.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id,
                            quantity: 1,
                            price: 399.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id,
                            quantity: 1,
                            price: 899.00
                        }
                    ]
                }
            }
        })
    ])
    const reviews = await Promise.all([
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Amazing iPhone with incredible features!',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'iphone-15-pro' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Great laptop for everyday use.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'macbook-air-m3' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Love these sneakers, very comfortable!',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'nike-air-force-1' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'The Apple Watch is fantastic for fitness tracking.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id
            }
        })
    ])
    console.log('✅ Reviews created:', reviews.length)

    console.log('✅ Users created:', users.length)
    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })