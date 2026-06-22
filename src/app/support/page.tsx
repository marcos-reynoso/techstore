"use client"

import { Mail, Phone, MessageCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 lg:py-12">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
          Support
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Need help with an order or account?</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Use the channels below to get in touch. The layout stays minimal so the contact options are easy to scan.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Email", value: "support@techstore.com", icon: Mail, href: "mailto:support@techstore.com" },
          { title: "Phone", value: "123-456-7890", icon: Phone, href: "tel:1234567890" },
          { title: "Live chat", value: "Open a ticket", icon: MessageCircle, href: "/track" },
        ].map((item) => (
          <Card key={item.title} className="border-white/10 bg-white/5 backdrop-blur transition-transform duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <item.icon className="h-6 w-6 text-cyan-300" />
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.title}</p>
              <h2 className="mt-2 text-lg font-semibold">{item.value}</h2>
              <Button asChild variant="outline" className="mt-5 h-11 rounded-full border-white/10 bg-white/5">
                <Link href={item.href}>
                  Contact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">FAQ shortcut</p>
            <h2 className="mt-2 text-2xl font-semibold">Track an order without leaving the support flow.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              The tracking page keeps the same visual language, so users don&apos;t feel like they moved to a different product.
            </p>
          </div>
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/track">
              Track order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
