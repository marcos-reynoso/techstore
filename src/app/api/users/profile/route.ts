import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { updateProfileSchema } from '@/lib/validations/auth'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import type { UserUpdateData } from '@/types'


export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        logger.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        const validatedData = updateProfileSchema.parse(body)

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        if (validatedData.email && validatedData.email !== currentUser.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: validatedData.email }
            })

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                )
            }
        }

        const updateData: UserUpdateData = {}
        if (validatedData.name) updateData.name = validatedData.name
        if (validatedData.email) updateData.email = validatedData.email
        if (validatedData.avatar !== undefined) updateData.avatar = validatedData.avatar

        if (validatedData.newPassword && validatedData.currentPassword) {
            updateData.password = await hash(validatedData.newPassword, 12)
        }
        if (validatedData.newPassword && validatedData.currentPassword) {
            if (!currentUser.password) {
                return NextResponse.json(
                    { error: 'No password set for this account' },
                    { status: 400 }
                )
            }

            const isPasswordValid = await compare(
                validatedData.currentPassword,
                currentUser.password
            )

            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                )
            }

            updateData.password = await hash(validatedData.newPassword, 12)
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                updatedAt: true,
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.message
                },
                { status: 400 }
            )
        }

        logger.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}