import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isAuthenticated = !!req.auth

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/profile/:path*",
        "/wishlist",
        "/checkout/:path*",
    ]
}