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
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
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
                        <Separator />


                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{session.user?.name || "Not set"}</p>
                        </div>
                        <Separator />


                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{session.user?.email}</p>
                        </div>
                        <Separator />

                        <Button asChild className="w-full">
                            <Link href="/profile/settings">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Access your account features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/profile/orders">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                My Orders
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/wishlist">
                                <Heart className="h-4 w-4 mr-2" />
                                My Wishlist
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
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