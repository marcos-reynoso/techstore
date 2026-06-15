import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema, updateProfileSchema } from '../lib/validations/auth'

// Register

describe('registerSchema', () => {
    it('should pass with valid data', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password1',
        })
        expect(result.success).toBe(true)
    })

    it('should pass with optional avatar as valid url', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password1',
            avatar: 'https://example.com/avatar.jpg',
        })
        expect(result.success).toBe(true)
    })

    it('should pass with avatar as local path', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password1',
            avatar: '/uploads/avatar.jpg',
        })
        expect(result.success).toBe(true)
    })

    it('should pass with avatar as empty string', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password1',
            avatar: '',
        })
        expect(result.success).toBe(true)
    })

    it('should fail with name too short', () => {
        const result = registerSchema.safeParse({
            name: 'J',
            email: 'john@example.com',
            password: 'Password1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Name must be at least 2 characters')
    })

    it('should fail with invalid email', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'not-an-email',
            password: 'Password1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Invalid email address')
    })

    it('should fail with password too short', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Pass1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Password must be at least 8 characters')
    })

    it('should fail without uppercase letter', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Password must contain at least one uppercase letter')
    })

    it('should fail without lowercase letter', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'PASSWORD1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Password must contain at least one lowercase letter')
    })

    it('should fail without number', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'PasswordABC',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Password must contain at least one number')
    })

    it('should fail with invalid avatar url', () => {
        const result = registerSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password1',
            avatar: 'not-a-valid-url',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Avatar must be a valid URL or local path')
    })
})

// Login

describe('loginSchema', () => {
    it('should pass with valid data', () => {
        const result = loginSchema.safeParse({
            email: 'john@example.com',
            password: 'Password1',
        })
        expect(result.success).toBe(true)
    })

    it('should fail with invalid email', () => {
        const result = loginSchema.safeParse({
            email: 'invalid',
            password: 'Password1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Invalid email address')
    })

    it('should fail with weak password', () => {
        const result = loginSchema.safeParse({
            email: 'john@example.com',
            password: '1234',
        })
        expect(result.success).toBe(false)
    })
})

// UpdateProfile

describe('updateProfileSchema', () => {
    it('should pass with only name updated', () => {
        const result = updateProfileSchema.safeParse({ name: 'Jane Doe' })
        expect(result.success).toBe(true)
    })

    it('should pass with only email updated', () => {
        const result = updateProfileSchema.safeParse({ email: 'new@example.com' })
        expect(result.success).toBe(true)
    })

    it('should pass when both currentPassword and newPassword are provided', () => {
        const result = updateProfileSchema.safeParse({
            currentPassword: 'OldPass1',
            newPassword: 'NewPass1',
        })
        expect(result.success).toBe(true)
    })

    it('should fail when newPassword is provided without currentPassword', () => {
        const result = updateProfileSchema.safeParse({
            newPassword: 'NewPass1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Current password is required to set a new password')
        expect(result.error?.issues[0].path).toContain('currentPassword')
    })

    it('should pass when neither password field is provided', () => {
        const result = updateProfileSchema.safeParse({
            name: 'John',
        })
        expect(result.success).toBe(true)
    })

    it('should fail with name too short', () => {
        const result = updateProfileSchema.safeParse({ name: 'J' })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Name must be at least 2 characters')
    })

    it('should pass with empty object', () => {
        const result = updateProfileSchema.safeParse({})
        expect(result.success).toBe(true)
    })
})