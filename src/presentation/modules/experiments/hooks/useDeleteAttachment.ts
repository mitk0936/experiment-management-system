import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIResponse } from "@/core/types/api";
import { AttachmentsMutationContext } from "./types";
import { IAttachmentMetaData } from "@/core/entities/Attachment";

export function useDeleteAttachment(experimentId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, APIResponse<null>, { attachmentId: string }, AttachmentsMutationContext>(
    {
      mutationFn: async ({ attachmentId }) => {
        const res = await fetch(`/api/attachment/${attachmentId}`, { method: "DELETE" });

        const responseData: APIResponse<null> = await res.json();

        if (!responseData.success) {
          throw responseData;
        }
      },
      onSuccess: (_data, { attachmentId }) => {
        queryClient.setQueryData(
          ["attachments", experimentId],
          (previousData: IAttachmentMetaData[] = []) =>
            previousData.filter((attachment) => attachment.id !== attachmentId),
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["attachments", experimentId] });
      },
    },
  );
}
