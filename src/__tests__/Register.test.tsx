import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from '../app/register/page'
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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the register form', () => {
    render(<RegisterPage />)

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('should show error toast when registration fails (e.g. duplicate email)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    })

    render(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists')
    })

    expect(signIn).not.toHaveBeenCalled()
  })

  it('should show validation error toast when zod validation fails', async () => {
    render(<RegisterPage />)

  
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Validation failed')
    })
  })

  it('should sign in and redirect on successful registration', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    vi.mocked(signIn).mockResolvedValue({ error: null, ok: true, status: 200, url: '' } as any)

    render(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!')
    })

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'john@example.com',
        password: 'Password123',
        redirect: false,
      })
    })
  })
})