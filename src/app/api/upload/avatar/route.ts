import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { logger } from '@/lib/logger'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: 'Invalid file' },
                { status: 400 }
            )
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP)' },
                { status: 400 }
            )
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 2MB' },
                { status: 400 }
            )
        }

        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop() || 'jpg'
        const fileName = `avatars/avatar-${timestamp}-${randomString}.${extension}`

        const blob = await put(fileName, file, {
            access: 'public',
        })

        logger.info(`Avatar uploaded successfully: ${blob.url}`)

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: blob.url
        }, { status: 201 })

    } catch (error) {
        logger.error('Error uploading avatar:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
