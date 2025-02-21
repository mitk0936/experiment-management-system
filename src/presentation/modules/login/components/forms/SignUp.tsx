"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/presentation/common/components/ui/input";
import { Button } from "@/presentation/common/components/ui/button";
import { MESSAGES } from "@/presentation/constants/messages";
import { signUp } from "../../../../../app/api/auth/_actions/signup";
import { SignUpFormData, signUpFormSchema } from "../../../../../core/validation/signup/schema";
import { TypographyH2 } from "@/presentation/common/components/ui/typography";
import { FormWrapper } from "@/presentation/common/components/composite/FormWrapper";
import { FormError } from "@/presentation/common/components/composite/FormError";

export function SignUp() {
  const [formGeneralSuccessMessage, setFormGeneralSuccessMessage] = useState(MESSAGES.Empty);
  const [formGeneralError, setFormGeneralError] = useState(MESSAGES.Empty);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
    reset: resetForm,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  /** Handle SignUp Server Action */
  async function handleSignUp(data: SignUpFormData) {
    setFormGeneralError(MESSAGES.Empty);

    const result = await signUp(data);

    if (result.success) {
      // SignUp is successfull, form is reset
      resetForm();
      setFormGeneralSuccessMessage(MESSAGES.SignupSuccessfull);
      return;
    }

    if (!result.success) {
      const fieldErrors = "fieldErrors" in result && result.fieldErrors;
      const formError = "error" in result && result.error;

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
  }

  return (
    <FormWrapper isLoading={isSubmitting}>
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
