"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { updateProfileSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatar: "",
        currentPassword: "",
        newPassword: "",
    })

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                avatar: session.user.avatar || "",
                currentPassword: "",
                newPassword: "",
            })
        }
    }, [session])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const dataToUpdate: any = {}
            if (formData.name !== session.user.name) dataToUpdate.name = formData.name
            if (formData.email !== session.user.email) dataToUpdate.email = formData.email
            if (formData.avatar !== session.user.avatar) dataToUpdate.avatar = formData.avatar
            if (formData.currentPassword) dataToUpdate.currentPassword = formData.currentPassword
            if (formData.newPassword) dataToUpdate.newPassword = formData.newPassword

            const validatedData = updateProfileSchema.parse(dataToUpdate)

            const response = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validatedData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.details) {
                    toast.error(data.details[0].message)
                } else {
                    toast.error(data.error || "Update failed")
                }
                return
            }

            toast.success("Profile updated successfully!")


            await update({
                ...session,
                user: {
                    ...session.user,
                    ...data.user
                }
            })


            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
            }))

            router.push("/profile")
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getInitials = (name?: string) => {
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/profile">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <p className="text-muted-foreground">Update your account information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your profile details and avatar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={formData.avatar || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {getInitials(formData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-full max-w-md space-y-2">
                                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                                <Input
                                    id="avatar"
                                    type="url"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter a URL to your profile picture or leave empty for default
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Change Password</h3>
                            <p className="text-sm text-muted-foreground">
                                Leave empty if you don't want to change your password
                            </p>

                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/profile">Cancel</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}