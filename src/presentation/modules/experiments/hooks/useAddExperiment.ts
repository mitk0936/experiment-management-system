import { IExperiment } from "@/core/entities/Experiment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddExperimentFormData } from "../../../../core/validation/add-experiment/schema";
import { APIResponse } from "@/core/types/api";

type MutationContext = { previousData: IExperiment[] | undefined };

export function useAddExperiment() {
  const queryClient = useQueryClient();

  return useMutation<
    IExperiment,
    APIResponse<IExperiment, AddExperimentFormData>,
    AddExperimentFormData,
    MutationContext
  >({
    mutationFn: async (formData) => {
      const res = await fetch("/api/experiment", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const responseData: APIResponse<IExperiment> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }

      return responseData.data;
    },
    onSuccess: (newExperiment) => {
      queryClient.setQueryData(["experiments"], (previousData: IExperiment[] = []) => [
        newExperiment,
        ...previousData,
      ]);
    },
    onError: (_err, _newExperiment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["experiments"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: "experiments" });
    },
  });
}
