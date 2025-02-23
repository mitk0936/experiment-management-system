import { withAuth } from "@/app/api/_utils/withAuth";
import AttachmentRepository from "@/core/repositories/Attachment/AttachmentRepository";
import { logError } from "@/core/utils/logger";
import { MESSAGES } from "@/presentation/constants/messages";
import { NextResponse } from "next/server";

type AttachmentRequestParams = {
  params: { id: string };
};

export const GET = withAuth(async function (_req: Request, { params }: AttachmentRequestParams) {
  try {
    const { id: attachmentId } = await params;

    const attachment = await AttachmentRepository.getById(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { success: false, error: MESSAGES.InvalidAttachment },
        { status: 404 },
      );
    }

    const fileBuffer = Buffer.from(attachment.fileData, "base64");

    return new Response(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${attachment.filename}"`,
        "Content-Type": attachment.mimeType,
      },
    });
  } catch (error) {
    logError(
      "ISE when trying to download an attachment",
      error,
      "GET /api/attachment/:id/download",
    );

    return NextResponse.json(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
