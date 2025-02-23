import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/core/types/api";
import { IAttachmentMetaData } from "@/core/entities/Attachment";

export function useAttachments(experimentId: string) {
  return useQuery<IAttachmentMetaData[], APIResponse<IAttachmentMetaData[]>>({
    queryKey: ["attachments", experimentId],
    queryFn: async () => {
      const res = await fetch(`/api/attachment?experimentId=${experimentId}`);
      const responseData: APIResponse<IAttachmentMetaData[]> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }

      return responseData.data;
    },
  });
}
