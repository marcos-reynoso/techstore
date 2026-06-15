import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../store/user-store'

const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
}

describe('User Store', () => {
    beforeEach(() => {
        useUserStore.setState({ user: null, isAuthenticated: false })
    })

    it('should have null user and not authenticated by default', () => {
        const { user, isAuthenticated } = useUserStore.getState()
        expect(user).toBeNull()
        expect(isAuthenticated).toBe(false)
    })

    it('should set user and mark as authenticated', () => {
        useUserStore.getState().setUser(mockUser)

        const { user, isAuthenticated } = useUserStore.getState()
        expect(user).toEqual(mockUser)
        expect(isAuthenticated).toBe(true)
    })

    it('should set user without avatar', () => {
        const { avatar, ...userWithoutAvatar } = mockUser
        useUserStore.getState().setUser(userWithoutAvatar)

        expect(useUserStore.getState().user?.avatar).toBeUndefined()
    })

    it('should logout and clear user', () => {
        useUserStore.getState().setUser(mockUser)
        useUserStore.getState().logout()

        const { user, isAuthenticated } = useUserStore.getState()
        expect(user).toBeNull()
        expect(isAuthenticated).toBe(false)
    })
})