import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 && item.label === 'Home' ? (
            <Home className="h-4 w-4" />
          ) : (
            <span>{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          
          {index < items.length - 1 && (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
          
          {index === items.length - 1 && (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
