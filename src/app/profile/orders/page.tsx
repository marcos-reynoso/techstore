"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"




export default function OrdersPage() {
    const { data: session, status } = useSession()
    const { } = useCartStore()

    return <div>Orders</div>
}