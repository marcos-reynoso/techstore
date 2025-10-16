import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md mx-auto">
        <Package className="h-24 w-24 mx-auto text-gray-400 mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
