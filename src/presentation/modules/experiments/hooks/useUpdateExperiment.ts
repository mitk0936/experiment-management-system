import { IExperiment } from "@/core/entities/Experiment";
import { APIResponse } from "@/core/types/api";
import { ExperimentFormData } from "@/core/validation/experiment/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MutationContext = { previousData: IExperiment[] | undefined };

export function useUpdateExperiment() {
  const queryClient = useQueryClient();

  return useMutation<
    IExperiment,
    APIResponse<IExperiment, ExperimentFormData>,
    { id: string; data: ExperimentFormData },
    MutationContext
  >({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/experiment/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const responseData: APIResponse<IExperiment> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }

      return responseData.data;
    },
    onSuccess: (newExperiment) => {
      queryClient.setQueryData(["experiments"], (previousData: IExperiment[] = []) => {
        return previousData.reduce((acc, experiment) => {
          if (experiment.id === newExperiment.id) {
            return [...acc, { ...newExperiment }];
          }

          return [...acc];
        }, [] as IExperiment[]);
      });
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
