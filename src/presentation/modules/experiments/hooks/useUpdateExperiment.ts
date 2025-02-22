import { IExperiment } from "@/core/entities/Experiment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IExperiment }) => {
      const res = await fetch(`/api/experiments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to update experiment");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "experiments" });
    },
  });
}
