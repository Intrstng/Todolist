import {z} from "zod/v4"

export const loginSchema = z.object({
    email: z.email({error: "Incorrect email address"}),
    password: z.string()
                .min(1, 'Password is required')
                .regex(
                    /^(?=.*\d)(?=.*[@$#№:;^!%*?&*()_+,."'`~/|])[\p{L}\d@$!%*?&*()_+."']/u,
                    'Password must have at least one letter, one digit, one special character'
                )
                .min(8, 'Password must be at least 8 characters long'),
    rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>