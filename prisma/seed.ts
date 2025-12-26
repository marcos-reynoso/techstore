import { Product } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
            categoryId: categories.find((c: Product) => c.slug === 'smartphones')!.id
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
            categoryId: categories.find((c: Product) => c.slug === 'laptops')!.id
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
            categoryId: categories.find((c: Product) => c.slug === 'smartphones')!.id
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
            categoryId: categories.find((c: Product) => c.slug === 'laptops')!.id
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
            categoryId: categories.find((c: Product) => c.slug === 'electronics')!.id
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
            categoryId: categories.find((c: Product) => c.slug === 'clothing')!.id
        }
        ,
        {
            name: 'Sony WH-1000XM5',
            slug: 'sony-wh-1000xm5',
            description: 'Noise-cancelling wireless headphones with industry-leading sound quality and comfort.',
            price: 349.00,
            image: '/images/products/sony-wh-1000xm5.jpg',
            images: ['/images/products/sony-wh-1000xm5-1.jpg', '/images/products/sony-wh-1000xm5-2.jpg'],
            stock: 40,
            featured: true,
            categoryId: categories.find((c: Product) => c.slug === 'electronics')!.id
        },
        {
            name: 'Google Pixel 8',
            slug: 'google-pixel-8',
            description: 'Google’s latest smartphone with advanced AI features and an outstanding camera.',
            price: 799.00,
            image: '/images/products/pixel-8.jpg',
            images: ['/images/products/pixel-8-1.jpg', '/images/products/pixel-8-2.jpg'],
            stock: 50,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'smartphones')!.id
        },
        {
            name: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            description: 'High-performance running shoes with responsive cushioning and stylish design.',
            price: 180.00,
            image: '/images/products/adidas-ultraboost-22.jpg',
            images: ['/images/products/adidas-ultraboost-22-1.jpg', '/images/products/adidas-ultraboost-22-2.jpg'],
            stock: 80,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'clothing')!.id
        },
        {
            name: 'HP Spectre x360',
            slug: 'hp-spectre-x360',
            description: 'Convertible laptop with touch screen and long battery life. Perfect for work and creativity.',
            price: 1399.00,
            image: '/images/products/hp-spectre-x360.jpg',
            images: ['/images/products/hp-spectre-x360-1.jpg', '/images/products/hp-spectre-x360-2.jpg'],
            stock: 20,
            featured: true,
            categoryId: categories.find((c: Product) => c.slug === 'laptops')!.id
        },
        {
            name: 'Samsung Galaxy Watch 6',
            slug: 'samsung-galaxy-watch-6',
            description: 'Smartwatch with advanced health tracking and seamless integration with Android devices.',
            price: 329.00,
            image: '/images/products/galaxy-watch-6.jpg',
            images: ['/images/products/galaxy-watch-6-1.jpg', '/images/products/galaxy-watch-6-2.jpg'],
            stock: 45,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'electronics')!.id
        },
        {
            name: 'Levi\'s 501 Original Jeans',
            slug: 'levis-501-original',
            description: 'Iconic straight fit jeans with timeless style and comfort.',
            price: 90.00,
            image: '/images/products/levis-501.jpg',
            images: ['/images/products/levis-501-1.jpg', '/images/products/levis-501-2.jpg'],
            stock: 120,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'clothing')!.id
        },
        {
            name: 'Microsoft Surface Laptop 5',
            slug: 'surface-laptop-5',
            description: 'Sleek and powerful laptop with PixelSense touchscreen and all-day battery life.',
            price: 1299.00,
            image: '/images/products/surface-laptop-5.jpg',
            images: ['/images/products/surface-laptop-5-1.jpg', '/images/products/surface-laptop-5-2.jpg'],
            stock: 25,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'laptops')!.id
        },
        {
            name: 'Bose QuietComfort Earbuds II',
            slug: 'bose-qc-earbuds-ii',
            description: 'Premium noise-cancelling earbuds with crystal clear sound and comfortable fit.',
            price: 299.00,
            image: '/images/products/bose-qc-earbuds-ii.jpg',
            images: ['/images/products/bose-qc-earbuds-ii-1.jpg', '/images/products/bose-qc-earbuds-ii-2.jpg'],
            stock: 35,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'electronics')!.id
        },
        {
            name: 'Uniqlo Ultra Light Down Jacket',
            slug: 'uniqlo-ultra-light-down',
            description: 'Lightweight and warm down jacket, perfect for layering in cold weather.',
            price: 70.00,
            image: '/images/products/uniqlo-ultra-light-down.jpg',
            images: ['/images/products/uniqlo-ultra-light-down-1.jpg', '/images/products/uniqlo-ultra-light-down-2.jpg'],
            stock: 90,
            featured: true,
            categoryId: categories.find((c: Product) => c.slug === 'clothing')!.id
        },
        {
            name: 'OnePlus 12',
            slug: 'oneplus-12',
            description: 'Flagship smartphone with fast charging and smooth performance.',
            price: 749.00,
            image: '/images/products/oneplus-12.jpg',
            images: ['/images/products/oneplus-12-1.jpg', '/images/products/oneplus-12-2.jpg'],
            stock: 60,
            featured: false,
            categoryId: categories.find((c: Product) => c.slug === 'smartphones')!.id
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
    const orders = await Promise.all([
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
                total: 120.00 + 399.00 + 899.00,
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
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1003',
                status: 'DELIVERED',
                total: 70.00,
                shippingName: 'Admin TechStore',
                shippingEmail: 'admin@techstore.com',
                shippingAddress: '789 Admin Blvd, City, Country',
                shippingCity: 'City',
                shippingZip: '54321',
                userId: users[0].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id,
                            quantity: 1,
                            price: 70.00
                        }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1004',
                status: 'CANCELLED',
                total: 749.00,
                shippingName: 'John Doe',
                shippingEmail: 'johndoe@example.com',
                shippingAddress: '123 Main St, City, Country',
                shippingCity: 'City',
                shippingZip: '12345',
                userId: users[1].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'oneplus-12' } }))!.id,
                            quantity: 1,
                            price: 749.00
                        }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1005',
                status: 'PROCESSING',
                total: 899.00,
                shippingName: 'Customer Example',
                shippingEmail: 'customer@example.com',
                shippingAddress: '456 Another St, City, Country',
                shippingCity: 'City',
                shippingZip: '67890',
                userId: users[2].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id,
                            quantity: 1,
                            price: 899.00
                        }
                    ]
                }
            }
        }),

        prisma.order.create({
            data: {
                orderNumber: 'TS1006',
                status: 'DELIVERED',
                total: 70.00 + 120.00,
                shippingName: 'Jane Smith',
                shippingEmail: 'janesmith@example.com',
                shippingAddress: '321 New St, City, Country',
                shippingCity: 'City',
                shippingZip: '11111',
                userId: users[0].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id,
                            quantity: 1,
                            price: 70.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'nike-air-force-1' } }))!.id,
                            quantity: 1,
                            price: 120.00
                        }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1007',
                status: 'PROCESSING',
                total: 999.00 + 749.00,
                shippingName: 'Carlos Perez',
                shippingEmail: 'carlosperez@example.com',
                shippingAddress: '654 South St, City, Country',
                shippingCity: 'City',
                shippingZip: '22222',
                userId: users[1].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'iphone-15-pro' } }))!.id,
                            quantity: 1,
                            price: 999.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'oneplus-12' } }))!.id,
                            quantity: 1,
                            price: 749.00
                        }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1008',
                status: 'DELIVERED',
                total: 1299.00 + 899.00,
                shippingName: 'Maria Lopez',
                shippingEmail: 'marialopez@example.com',
                shippingAddress: '987 North St, City, Country',
                shippingCity: 'City',
                shippingZip: '33333',
                userId: users[2].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'macbook-air-m3' } }))!.id,
                            quantity: 1,
                            price: 1299.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id,
                            quantity: 1,
                            price: 899.00
                        }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                orderNumber: 'TS1009',
                status: 'SHIPPED',
                total: 399.00 + 70.00,
                shippingName: 'Ana Torres',
                shippingEmail: 'anatorres@example.com',
                shippingAddress: '159 West St, City, Country',
                shippingCity: 'City',
                shippingZip: '44444',
                userId: users[0].id,
                orderItems: {
                    create: [
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id,
                            quantity: 1,
                            price: 399.00
                        },
                        {
                            productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id,
                            quantity: 1,
                            price: 70.00
                        }
                    ]
                }
            }
        }),
    ])

    console.log('✅ Orders created:', orders.length)


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
                comment: 'Solid phone, but battery could be better.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'iphone-15-pro' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Best iPhone I have ever owned.',
                userId: users[0].id,
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
                comment: 'Super light and fast, love it!',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'macbook-air-m3' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 3,
                comment: 'Good, but a bit expensive.',
                userId: users[0].id,
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
                rating: 2,
                comment: 'Did not meet my expectations.',
                userId: users[0].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'nike-air-force-1' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Classic style, goes with everything.',
                userId: users[2].id,
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
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Love the new features and design!',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 3,
                comment: 'Good, but battery life could be better.',
                userId: users[0].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'apple-watch-series-9' } }))!.id
            }
        }),


        prisma.review.create({
            data: {
                rating: 3,
                comment: 'Good value for the price, but could be warmer.',
                userId: users[0].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Very light and easy to pack.',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Perfect for travel and layering.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'uniqlo-ultra-light-down' } }))!.id
            }
        }),


        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Super fast and smooth performance!',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'oneplus-12' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Great value for a flagship phone.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'oneplus-12' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Battery lasts all day!',
                userId: users[0].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'oneplus-12' } }))!.id
            }
        }),


        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Excellent Android phone, great camera.',
                userId: users[2].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Screen is beautiful and super smooth.',
                userId: users[1].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 3,
                comment: 'Good phone but a bit pricey.',
                userId: users[0].id,
                productId: (await prisma.product.findUnique({ where: { slug: 'samsung-galaxy-s24' } }))!.id
            }
        }),
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