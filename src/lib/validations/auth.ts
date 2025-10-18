import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatar: z.string().url().optional().or(z.literal("")),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})


export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
    email: z.string().email("Invalid email address").optional(),
    avatar: z.string().url().optional().or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine(
    (data) => {

        if (data.newPassword && !data.currentPassword) {
            return false
        }
        return true
    },
    {
        message: "Current password is required to set a new password",
        path: ["currentPassword"],
    }
)

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>