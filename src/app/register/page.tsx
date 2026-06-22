"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { registerSchema } from "@/lib/validations/auth"
import { signIn } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Sparkles, Upload, UserPlus } from "lucide-react"
import { getZodMessage } from "@/lib/zod"

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
            toast.error(getZodMessage(error, "Something went wrong"))
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
        } catch {
            toast.error('Failed to upload image')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-12">
            <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_34%)]" />
                <div className="relative max-w-xl">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-300" />
                        Create your account
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Join a storefront that feels designed, not templated.
                    </h1>
                    <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                        Save favorites, move faster through checkout, and keep your shopping history in one place with a cleaner experience.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <Card className="border-white/10 bg-black/20 backdrop-blur">
                            <CardContent className="p-5">
                                <UserPlus className="h-5 w-5 text-amber-300" />
                                <h2 className="mt-3 text-base font-semibold">Quick start</h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Register in a few steps and jump straight into the catalog.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-white/10 bg-black/20 backdrop-blur">
                            <CardContent className="p-5">
                                <Sparkles className="h-5 w-5 text-cyan-300" />
                                <h2 className="mt-3 text-base font-semibold">Personalized profile</h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Upload an avatar and keep your account polished from day one.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <Card className="border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription className="text-muted-foreground">
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
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
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

                        <CardFooter className="flex flex-col gap-4 px-0 pb-0 pt-2">
                            <Button type="submit" className="h-11 w-full rounded-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-amber-300 hover:underline">
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
