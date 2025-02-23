import { NextResponse } from "next/server";
import { withAuth } from "../../_utils/withAuth";
import { APIResponse } from "@/core/types/api";
import { getServerSession, Session } from "next-auth";
import { validateExperimentAccess } from "../../_utils/validateExperimentAccess";
import { authOptions } from "../../auth/[...nextauth]/route";
import { logError } from "@/core/utils/logger";
import { MESSAGES } from "@/presentation/constants/messages";
import { AttachmentRepository } from "@/core/repositories/Attachment/AttachmentRepository";

type AttachmentRequestParams = {
  params: {
    id: string;
  };
};

export const DELETE = withAuth(async function (
  _req: Request,
  { params }: AttachmentRequestParams,
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    const { id: attachmentId } = await params;
    const attachment = await AttachmentRepository.getById(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { success: false, error: MESSAGES.InvalidAttachment },
        { status: 400 },
      );
    }

    const validateExperimentAccessResponse = await validateExperimentAccess(
      attachment?.experimentId,
      session.user.id,
    );

    if (validateExperimentAccessResponse instanceof NextResponse) {
      return validateExperimentAccessResponse;
    }

    await AttachmentRepository.delete(attachment.id);

    return NextResponse.json(
      {
        success: true,
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    logError("ISE when trying to delete an attachment", error, "DELETE /api/attachment/:id");

    return NextResponse.json(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
