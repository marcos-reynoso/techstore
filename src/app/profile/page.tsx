"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ShoppingBag, Heart, Settings } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!session) {
        redirect("/login")
    }

    const getInitials = (name?: string | null) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:py-8">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Profile</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">My Profile</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Manage your account information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-cyan-300" />
                            Account Information
                        </CardTitle>
                        <CardDescription>Your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={session.user?.avatar || undefined} />
                                <AvatarFallback className="text-lg">
                                    {getInitials(session.user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Profile Picture</p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {session.user.role}
                                </p>
                            </div>
                        </div>
                        <Separator className="bg-white/10" />


                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{session.user?.name || "Not set"}</p>
                        </div>
                        <Separator className="bg-white/10" />


                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{session.user?.email}</p>
                        </div>
                        <Separator className="bg-white/10" />

                        <Button asChild className="w-full rounded-full">
                            <Link href="/profile/settings">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Access your account features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button asChild variant="outline" className="w-full justify-start rounded-full border-white/10 bg-white/5">
                            <Link href="/profile/orders">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                My Orders
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start rounded-full border-white/10 bg-white/5">
                            <Link href="/wishlist">
                                <Heart className="h-4 w-4 mr-2" />
                                My Wishlist
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start rounded-full border-white/10 bg-white/5">
                            <Link href="/cart">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Shopping Cart
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}