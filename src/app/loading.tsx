import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Loader2 className="h-10 w-10 text-cyan-300 animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Loading</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Please wait...</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            Content is being loaded.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
