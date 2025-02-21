import { MESSAGES } from "@/presentation/constants/messages";
import * as z from "zod";

export const signInFormSchema = z.object({
  email: z
    .string({ required_error: MESSAGES.EmailIsRequired })
    .trim()
    .min(1, { message: MESSAGES.EmailIsRequired })
    .email({ message: MESSAGES.InvalidEmailFormat }),
  password: z
    .string({ required_error: MESSAGES.PasswordIsRequired })
    .trim()
    .min(1, { message: MESSAGES.PasswordIsRequired })
    .min(6, { message: MESSAGES.PasswordMustBe6OrMoreChars }),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
