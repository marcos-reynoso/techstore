
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to TechStore</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A modern e-commerce platform built with Next.js
      </p>
      <div className="flex gap-4">
        <a 
          href="/dashboard" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Go to Dashboard
        </a>
        <a 
          href="/products" 
          className="px-6 py-3 border border-border rounded-lg hover:bg-accent"
        >
          View Products
        </a>
      </div>
    </div>
  );
}