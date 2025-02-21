"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/presentation/common/components/ui/input";
import { Button } from "@/presentation/common/components/ui/button";
import { Textarea } from "@/presentation/common/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/presentation/common/components/ui/select";
import { useAddExperiment } from "@/presentation/modules/experiments/hooks/useAddExperiment";
import { FormWrapper } from "@/presentation/common/components/composite/FormWrapper";
import { ExperimentField, ExperimentStatus } from "@/core/entities/Experiment";
import {
  AddExperimentFormData,
  addExperimentSchema,
} from "@/core/validation/add-experiment/schema";
import { TypographyH2 } from "@/presentation/common/components/ui/typography";
import { FormError } from "@/presentation/common/components/composite/FormError";
import { useState } from "react";
import { MESSAGES } from "@/presentation/constants/messages";

interface Props {
  onError: Function;
  onComplete: Function;
}

export function AddExperiment({ onError, onComplete }: Props) {
  const [formGeneralError, setFormGeneralError] = useState(MESSAGES.Empty);

  const {
    setValue,
    register,
    handleSubmit,
    setError: setFieldError,
    reset: resetForm,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addExperimentSchema),
  });

  const { mutate: addExperiment, isPending } = useAddExperiment();

  const fieldValue = watch("field") || "";
  const statusValue = watch("status") || "";

  async function onSubmit(data: AddExperimentFormData) {
    addExperiment(
      { ...data },
      {
        onSuccess() {
          resetForm();
          onComplete();
        },
        onError(errorResponse) {
          // TODO: probably write an abstraction to handle this code repetition of handling field errors after submit
          const fieldErrors = "fieldErrors" in errorResponse && errorResponse.fieldErrors;
          const formError = "error" in errorResponse && errorResponse.error;

          // apply field errors
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, message]) => {
              setFieldError(key as keyof AddExperimentFormData, { message });
            });
          }

          // apply generic form error
          if (formError) {
            setFormGeneralError(formError);
          }

          onError();
        },
        onSettled() {},
      },
    );
  }

  return (
    <FormWrapper isLoading={isPending}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto space-y-4 p-6 border rounded-lg"
      >
        <FormError message={formGeneralError} />

        {/* Name */}
        <Input {...register("name")} placeholder="Experiment Name" />
        <FormError message={errors.name?.message} />

        {/* Description */}
        <Textarea {...register("description")} placeholder="Description (optional)" />

        {/* Field (Category) */}
        <Select
          value={fieldValue}
          onValueChange={(value) =>
            setValue("field", value as ExperimentField, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Field" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ExperimentField).map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormError message={errors.field?.message} />

        {/* Status */}
        <Select
          value={statusValue}
          onValueChange={(value) =>
            setValue("status", value as ExperimentStatus, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ExperimentStatus).map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormError message={errors.status?.message} />

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          Create Experiment
        </Button>
      </form>
    </FormWrapper>
  );
}
