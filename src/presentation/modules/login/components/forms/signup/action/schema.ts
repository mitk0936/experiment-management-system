import * as z from "zod";
import { MESSAGES } from "@/presentation/common/constants/messages";

export const signUpFormSchema = z
  .object({
    name: z
      .string({ required_error: MESSAGES.NameIsRequired })
      .trim()
      .min(1, { message: MESSAGES.NameIsRequired })
      .min(2, { message: MESSAGES.NameMustBeAtLeast2Chars }),
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
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PasswordsDoNotMatch,
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
