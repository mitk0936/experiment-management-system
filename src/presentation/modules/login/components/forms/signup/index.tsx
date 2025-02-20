"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/presentation/common/components/ui/input";
import { Button } from "@/presentation/common/components/ui/button";
import { MESSAGES } from "@/presentation/common/constants/messages";
import { signUp } from "./action";
import { SignUpFormData, signUpFormSchema } from "./action/schema";
import { TypographyH2 } from "@/presentation/common/components/ui/typography";
import { FormWrapper } from "@/presentation/common/components/composite/form-wrapper";
import { FormError } from "@/presentation/common/components/composite/form-error";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formGeneralSuccessMessage, setFormGeneralSuccessMessage] = useState(MESSAGES.Empty);
  const [formGeneralError, setFormGeneralError] = useState(MESSAGES.Empty);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
    reset: resetForm,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  /** Handle SignUp Server Action */
  async function handleSignUp(data: SignUpFormData) {
    setIsLoading(true);
    setFormGeneralError(MESSAGES.Empty);

    const result = await signUp(data);

    setIsLoading(false);

    if (!result.success) {
      const fieldErrors = result.fieldErrors;
      const formError = result.formError;

      // apply field errors
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([key, message]) => {
          setFieldError(key as keyof SignUpFormData, { message });
        });
      }

      // apply generic form error
      if (formError) {
        setFormGeneralError(formError);
      }

      return;
    }

    // SignUp is successfull, form is reset
    resetForm();
    setFormGeneralSuccessMessage(MESSAGES.SignupSuccessfull);
  }

  return (
    <FormWrapper isLoading={isLoading}>
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4 p-4">
        <TypographyH2>Sign Up</TypographyH2>
        <FormError message={formGeneralError} />

        {formGeneralSuccessMessage && (
          <p className="text-green-500 whitespace-pre-line">{formGeneralSuccessMessage}</p>
        )}
        <Input {...register("name")} placeholder="Name" />
        <FormError message={errors.name?.message} />
        <Input {...register("email")} placeholder="Email" />
        <FormError message={errors.email?.message} />
        <Input {...register("password")} type="password" placeholder="Password" />
        <FormError message={errors.password?.message} />
        <Input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
        <FormError message={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </FormWrapper>
  );
}
