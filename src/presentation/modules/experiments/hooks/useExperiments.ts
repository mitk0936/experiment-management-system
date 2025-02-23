import { useQuery } from "@tanstack/react-query";
import { Experiment } from "@/core/entities/Experiment";
import { APIResponse } from "@/core/types/api";

export function useExperiments() {
  return useQuery<Experiment[], APIResponse<Experiment[]>>({
    queryKey: ["experiments"],
    queryFn: async () => {
      const res = await fetch("/api/experiment");

      const responseData: APIResponse<Experiment[]> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }

      return responseData.data;
    },
    staleTime: 5 * 60 * 1000, // cache results for 5 minutes
    refetchOnWindowFocus: false, // prevent unnecessary refetches
  });
}
