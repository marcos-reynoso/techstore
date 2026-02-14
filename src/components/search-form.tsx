"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar"

type SearchProduct = {
  id: string
  name: string
  slug: string
  image: string
  category?: { id: string; name: string; slug: string }
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement | null>(null)

  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<SearchProduct[]>([])
  const [error, setError] = useState<string | null>(null)

  const trimmed = useMemo(() => query.trim(), [query])

  useEffect(() => {
    async function run() {
      const query = debouncedQuery.trim()
      setError(null)

      if (!query) {
        setItems([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=8`, {
          cache: "no-store",
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setError((data as any)?.error || "Search failed")
          setItems([])
          return
        }

        setItems(((data as any)?.products ?? []) as SearchProduct[])
      } catch {
        setError("Network error")
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [debouncedQuery])

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = trimmed
    if (!query) return
    setOpen(false)
    router.push(`/products?search=${encodeURIComponent(query)}`)
  }

  function goToProduct(slug: string) {
    setOpen(false)
    setQuery("")
    router.push(`/products/${slug}`)
  }

  return (
    <form {...props} onSubmit={onSubmit}>
      <div ref={rootRef} className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>

        <SidebarInput
          id="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
          }}
          placeholder="Type to search..."
          className="h-8 pl-7"
          autoComplete="off"
        />

        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />

        {open && (trimmed.length > 0 || isLoading || error) && (
          <div className="absolute left-0 right-0 mt-2 rounded border bg-background shadow z-50 overflow-hidden">
            {isLoading && <div className="px-3 py-2 text-sm text-muted-foreground">Searching...</div>}

            {!isLoading && error && <div className="px-3 py-2 text-sm text-red-600">{error}</div>}

            {!isLoading && !error && items.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
            )}

            {!isLoading && !error && items.length > 0 && (
              <div className="max-h-72 overflow-auto">
                {items.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goToProduct(p.slug)}
                    className="w-full text-left px-3 py-2 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-9 w-9 rounded object-cover border"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        {p.category?.name && (
                          <div className="text-xs text-muted-foreground truncate">{p.category.name}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t px-3 py-2 text-xs text-muted-foreground">
              Press <span className="font-mono">Enter</span> to search all products
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
