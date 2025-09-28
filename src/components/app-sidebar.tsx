"use client"

import * as React from "react"
import {
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  BarChart3,
  Settings2,
  ShoppingCart,
  Heart,
  Search,
  Home,
  Smartphone,
  Laptop,
  Shirt,
  Gift,
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


const data = {
  user: {
    name: "Marcos Reynoso",
    email: "m@example.com",
    avatar: "/avatars/user.jpg",
  },
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
          title: "New Arrivals",
          url: "/products?sort=newest",
        },
        {
          title: "Best Sellers",
          url: "/products?sort=popular",
        },
        {
          title: "On Sale",
          url: "/products?sale=true",
        },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Grid3X3,
      items: [
        {
          title: "Electronics",
          url: "/products?category=electronics",
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
          title: "Wishlist",
          url: "/profile/wishlist",
        },
        {
          title: "Settings",
          url: "/profile/settings",
        },
      ],
    },
    {
      title: "Admin Panel",
      url: "/admin",
      icon: Settings2,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Products",
          url: "/admin/products",
        },
        {
          title: "Orders",
          url: "/admin/orders",
        },
        {
          title: "Customers",
          url: "/admin/customers",
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
  // Cambiar "projects" por "quickAccess" 
  quickAccess: [
    {
      name: "Shopping Cart",
      url: "/cart",
      icon: ShoppingCart,
      badge: "3", // Número de items
    },
    {
      name: "Wishlist",
      url: "/wishlist", 
      icon: Heart,
      badge: "12",
    },
    {
      name: "Search",
      url: "/search",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const totalItems = useCartStore(state => state.totalItems)
  
  // Actualizar badge del carrito dinámicamente
  const quickAccessWithCartCount = data.quickAccess.map(item => 
    item.name === "Shopping Cart" 
      ? { ...item, badge: totalItems > 0 ? totalItems.toString() : undefined }
      : item
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
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ShoppingBag className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">TechStore</span>
                  <span className="truncate text-xs">E-commerce Platform</span>
                </div>
              </a>
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