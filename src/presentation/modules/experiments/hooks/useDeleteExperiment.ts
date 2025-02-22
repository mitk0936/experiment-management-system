import { IExperiment } from "@/core/entities/Experiment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIResponse } from "@/core/types/api";

type MutationContext = { previousData: IExperiment[] | undefined };

export function useDeleteExperiment() {
  const queryClient = useQueryClient();

  return useMutation<void, APIResponse<null>, { id: string }, MutationContext>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`/api/experiment/${id}`, {
        method: "DELETE",
      });

      const responseData: APIResponse<null> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["experiments"] });

      const previousData = queryClient.getQueryData<IExperiment[]>(["experiments"]);

      queryClient.setQueryData(["experiments"], (oldData: IExperiment[] = []) =>
        oldData.filter((exp) => exp.id !== id),
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["experiments"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
  });
}
