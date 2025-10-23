"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  ShoppingCart,
  Heart,
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

  navMain: [
    {
      title: "Shop",
      url: "/products",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Featured",
          url: "/products?featured=true",
        },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Grid3X3,
      items: [
        {
          title: "All Categories",
          url: "/categories",
        },
        {
          title: "Laptops",
          url: "/products?category=laptops",
        },
        {
          title: "Smartphones",
          url: "/products?category=smartphones",
        },
        {
          title: "Clothing",
          url: "/products?category=clothing",
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
    },
    {
      name: "Wishlist",
      url: "/wishlist",
      icon: Heart,
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const totalItems = useCartStore(state => state.totalItems)


  const userData = React.useMemo(() => {
    if (!session?.user) {
      return null
    }
    return {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      avatar: session.user.avatar ?? null,
    }
  }, [session])


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
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}