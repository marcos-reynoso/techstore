"use client"

import * as React from "react"
import {
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  ShoppingCart,
  Heart,
  Search,
  LifeBuoy,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"

const data = {
  user: {
    name: "Guest User",
    email: "guest@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "Shop",
      url: "/dashboard/products",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "All Products",
          url: "/dashboard/products",
        },
        {
          title: "New Arrivals",
          url: "/dashboard/products?sort=new",
        },
        {
          title: "Best Sellers",
          url: "/dashboard/products?sort=best",
        },
        {
          title: "On Sale",
          url: "/dashboard/products?filter=sale",
        },
      ],
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Grid3X3,
      items: [
        {
          title: "Electronics",
          url: "/dashboard/categories/electronics",
        },
        {
          title: "Laptops",
          url: "/dashboard/products?category=laptops",
        },
        {
          title: "Smartphones",
          url: "/dashboard/products?category=smartphones",
        },
        {
          title: "Clothing",
          url: "/dashboard/products?category=clothing",
        },
      ],
    },
    {
      title: "Account",
      url: "/profile",
      icon: Users,
      items: [
        {
          title: "My Profile",
          url: "/profile",
        },
        {
          title: "My Orders",
          url: "/profile/orders",
        },
        {
          title: "Wishlist",
          url: "/profile/wishlist",
        },
        {
          title: "Settings",
          url: "/profile/settings",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Customer Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Track Order",
      url: "/track",
      icon: Package,
    },
  ],
 
  quickAccess: [
    {
      name: "Shopping Cart",
      url: "/cart",
      icon: ShoppingCart,
      badge: "3",
    },
    {
      name: "Wishlist",
      url: "/wishlist", 
      icon: Heart,
      badge: "12",
    },
  
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const totalItems = useCartStore(state => state.totalItems)
  

  const quickAccessWithCartCount = React.useMemo(() => 
    data.quickAccess.map(item => 
      item.name === "Shopping Cart" 
        ? { ...item, badge: totalItems > 0 ? totalItems.toString() : undefined }
        : item
    ), [totalItems]
  )

  return (
    <Sidebar
      className="top-[var(--header-height)] h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ShoppingBag className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">TechStore</span>
                  <span className="truncate text-xs">E-commerce Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects 
          projects={quickAccessWithCartCount} 
          title="Quick Access" 
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}