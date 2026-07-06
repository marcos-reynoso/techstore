"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <AlertTriangle className="h-10 w-10 text-rose-400" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-rose-400">Error</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
          <Button onClick={reset} className="mt-8 rounded-full px-6">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
