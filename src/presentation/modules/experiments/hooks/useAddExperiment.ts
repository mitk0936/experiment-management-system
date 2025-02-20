import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/experiments", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to add experiment");
      return res.json();
    },
    onMutate: async (newExperiment) => {
      queryClient.cancelQueries({ queryKey: "experiments" });

      const previousData = queryClient.getQueryData(["experiments"]);
      queryClient.setQueryData(["experiments"], (old: any) => [...old, newExperiment]);

      return { previousData };
    },
    onError: (err, newExperiment, context) => {
      queryClient.setQueryData(["experiments"], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: "experiments" });
    },
  });
}
