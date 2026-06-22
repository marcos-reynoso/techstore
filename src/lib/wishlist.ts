import type { WishlistItem } from "@/types"

const STORAGE_KEY = "wishlist"

function readLocalWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : []
  } catch {
    return []
  }
}

function writeLocalWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getLocalWishlist() {
  return readLocalWishlist()
}

export async function loadWishlist(): Promise<WishlistItem[]> {
  try {
    const response = await fetch("/api/users/wishlist", { cache: "no-store" })
    if (!response.ok) {
      return readLocalWishlist()
    }

    const data = (await response.json()) as { wishlist?: WishlistItem[] }
    const items = Array.isArray(data.wishlist) ? data.wishlist : []
    writeLocalWishlist(items)
    return items
  } catch {
    return readLocalWishlist()
  }
}

export async function saveWishlist(items: WishlistItem[]) {
  writeLocalWishlist(items)

  try {
    const response = await fetch("/api/users/wishlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    return response.ok
  } catch {
    return false
  }
}

export async function addWishlistItem(item: WishlistItem) {
  const wishlist = await loadWishlist()
  if (wishlist.some((existing) => existing.id === item.id)) {
    return { added: false, items: wishlist }
  }

  const next = [...wishlist, item]
  await saveWishlist(next)
  return { added: true, items: next }
}

export async function removeWishlistItem(id: string) {
  const wishlist = await loadWishlist()
  const next = wishlist.filter((item) => item.id !== id)
  await saveWishlist(next)
  return next
}
