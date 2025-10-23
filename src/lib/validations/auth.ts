import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    avatar: z.string()
        .refine((val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
            message: "Avatar must be a valid URL or local path"
        })
        .optional()
        .or(z.literal("")),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
})


export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
    email: z.string().email("Invalid email address").optional(),
    avatar: z.string()
        .refine((val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
            message: "Avatar must be a valid URL or local path"
        })
        .optional()
        .or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number").optional(),
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