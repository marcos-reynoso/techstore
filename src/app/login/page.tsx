"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, LockKeyhole, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { loginSchema } from "@/lib/validations/auth"
import { getZodMessage } from "@/lib/zod"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const validatedData = loginSchema.parse(formData)

            const result = await signIn("credentials", {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Invalid email or password")
            } else {
                toast.success("Welcome back!")
                router.push("/profile")
                router.refresh()
            }
        } catch (error) {
            toast.error(getZodMessage(error, "Something went wrong"))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-12">
            <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.14),transparent_34%)]" />
                <div className="relative max-w-xl">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
                        Access your account
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Sign in to continue the premium shopping experience.
                    </h1>
                    <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                        Revisit your saved items, track orders, and keep your cart in sync with a clean, polished workflow.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {[
                            { title: "Secure sessions", text: "JWT-backed auth with protected routes.", icon: ShieldCheck },
                            { title: "Fast re-entry", text: "Resume your store journey without friction.", icon: LockKeyhole },
                        ].map((item) => (
                            <Card key={item.title} className="border-white/10 bg-black/20 backdrop-blur">
                                <CardContent className="p-5">
                                    <item.icon className="h-5 w-5 text-cyan-300" />
                                    <h2 className="mt-3 text-base font-semibold">{item.title}</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Card className="border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <CardFooter className="flex flex-col gap-4 px-0 pb-0 pt-2">
                            <Button type="submit" className="h-11 w-full rounded-full" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Sign In"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="font-medium text-cyan-300 hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
