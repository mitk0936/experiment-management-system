import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experiments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete experiment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "experiments" });
    },
  });
}
