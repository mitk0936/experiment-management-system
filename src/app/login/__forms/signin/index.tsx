"use client";

import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { signIn } from "next-auth/react";
import { MESSAGES } from "@/presentation/messages/constants";
import { TypographyH2 } from "@/presentation/components/ui/typography";
import { signInFormSchema, SignInFormData } from "./schema";
import { FormWrapper } from "@/presentation/components/composite/form-wrapper";
import { FormError } from "@/presentation/components/composite/form-error";

interface Props {
  onSignedIn: Function;
}

export default function SignInForm({ onSignedIn }: PropsWithChildren<Props>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formGeneralError, setFormGeneralError] = useState(MESSAGES.Empty);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  });

  /** Handle SignIn Server Action */
  async function handleSignIn(data: SignInFormData) {
    setIsLoading(true);
    setFormGeneralError(MESSAGES.Empty);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      return setFormGeneralError(MESSAGES.InvalidCredentials);
    }

    onSignedIn();
  }

  return (
    <FormWrapper isLoading={isLoading}>
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
