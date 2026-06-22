import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../app/login/page'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('LoginPage', () => {
  it('should render the login form', () => {
    render(<LoginPage />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('should show error toast when login fails', async () => {
    
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith (expect.stringContaining('Password must contain at least one uppercase letter'))
    })
  })

  it('should redirect on successful login', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: null, ok: true, status: 200, url: '' } as unknown as Awaited<ReturnType<typeof signIn>>)

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome back!')
    })
  })
})
