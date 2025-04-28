import { z } from "zod"

export const signUpSchema = z.object({
    firstName: z.string().min(2, "First name too short").trim(),
    lastName: z.string().min(2, "Last name too short").trim(),
    emailAddress: z.string().email("Invalid email").trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;