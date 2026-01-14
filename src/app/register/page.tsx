"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { registerSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {

            const validatedData = registerSchema.parse(formData)

            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validatedData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.details) {
                    toast.error(data.details[0].message)
                } else {
                    toast.error(data.error || "Registration failed")
                }
                return
            }

            toast.success("Account created successfully!")


            const signInResult = await signIn("credentials", {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false,
            })

            if (signInResult?.error) {
                toast.error("Account created but login failed. Please login manually.")
                router.push("/login")
            } else {
                toast.success("Welcome! You're now logged in.")
                router.push("/")
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error("Validation failed")
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return


        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only images are allowed (JPEG, PNG, GIF, WebP)')
            return
        }


        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB')
            return
        }

        setIsUploadingAvatar(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload/avatar', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Failed to upload image')
                return
            }

            setFormData(prev => ({ ...prev, avatar: data.url }))
            toast.success('Image uploaded successfully!')
        } catch (error) {
            toast.error('Failed to upload image')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Sign up to start shopping
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={formData.avatar || undefined} />
                                    <AvatarFallback>
                                        {formData.name ? getInitials(formData.name) : <Upload className="h-8 w-8" />}
                                    </AvatarFallback>
                                </Avatar>
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="avatar">Profile Photo (Optional)</Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    className="cursor-pointer"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                    disabled={isUploadingAvatar}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Max 2MB. Formats: JPEG, PNG, GIF, WebP
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
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
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters (uppercase, lowercase, number)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <CardFooter className="flex flex-col gap-4 space-y-2">
                            <Button type="submit" className="w-full " disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}