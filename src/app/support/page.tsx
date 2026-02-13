"use client"
import { Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <Ticket className="h-24 w-24 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Support</h2>
      <p className="text-muted-foreground mb-5">
        Need help? We're here to help.
      </p>
      <p className="text-muted-foreground mb-4">Email: support@techstore.com</p>
      <p className="text-muted-foreground mb-4">Phone: 123-456-7890</p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  )
}
