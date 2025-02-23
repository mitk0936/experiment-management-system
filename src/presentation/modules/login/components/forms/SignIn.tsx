"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/presentation/common/components/ui/input";
import { Button } from "@/presentation/common/components/ui/button";
import { signIn } from "next-auth/react";
import { MESSAGES } from "@/presentation/constants/messages";
import { TypographyH2 } from "@/presentation/common/components/ui/typography";
import { signInFormSchema, SignInFormData } from "../../../../../core/validation/signin/schema";
import { FormWrapper } from "@/presentation/common/components/composite/FormWrapper";
import { FormError } from "@/presentation/common/components/composite/FormError";

interface Props {
  onSignedIn: () => void;
}

export function SignIn({ onSignedIn }: Props) {
  const [formGeneralError, setFormGeneralError] = useState(MESSAGES.Empty);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  });

  /** Handle SignIn Server Action */
  async function handleSignIn(data: SignInFormData) {
    setFormGeneralError(MESSAGES.Empty);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return setFormGeneralError(MESSAGES.InvalidCredentials);
    }

    onSignedIn();
  }

  return (
    <FormWrapper isLoading={isSubmitting}>
      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4 p-4">
        <TypographyH2>Login</TypographyH2>
        <FormError message={formGeneralError} />
        <Input {...register("email")} placeholder="Email" />
        <FormError message={errors.email?.message} />
        <Input {...register("password")} type="password" placeholder="Password" />
        <FormError message={errors.password?.message} />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </FormWrapper>
  );
}
