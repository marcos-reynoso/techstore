import { z } from "zod"

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, "Invalid product"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  price: z.number().positive("Price must be positive"),
})

export const checkoutSchema = z.object({
  userId: z.string().min(1, "Missing user ID"),
  shippingName: z.string().min(2, "Please enter your full name"),
  shippingEmail: z.string().email("Please enter a valid email"),
  shippingAddress: z.string().min(3, "Please enter your address"),
  shippingCity: z.string().min(2, "Please enter your city"),
  shippingZip: z.string().min(2, "Please enter your ZIP / postal code"),
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty"),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
