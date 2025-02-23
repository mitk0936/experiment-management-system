import { Attachment, IAttachmentMetaData } from "@/core/entities/Attachment";
import { withAuth } from "../_utils/withAuth";
import { NextResponse } from "next/server";
import { APIResponse } from "@/core/types/api";
import AttachmentRepository from "@/core/repositories/Attachment/AttachmentRepository";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { attachmentSchema } from "@/core/validation/attachment/schema";
import { validateExperimentAccess } from "../_utils/validateExperimentAccess";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = withAuth(
  async (req: Request): Promise<NextResponse<APIResponse<IAttachmentMetaData[]>>> => {
    try {
      const session = (await getServerSession(authOptions)) as Session;

      const { searchParams } = new URL(req.url);
      const experimentId = searchParams.get("experimentId");

      if (!experimentId) {
        return NextResponse.json(
          { success: false, error: MESSAGES.InvalidExperiment },
          { status: 400 },
        );
      }

      // Check if the session.user has access to the attachments of the requested experimentId
      const validateExperimentAccessResponse = await validateExperimentAccess(
        experimentId,
        session.user.id,
      );

      if (validateExperimentAccessResponse instanceof NextResponse) {
        return validateExperimentAccessResponse;
      }

      const attachments = await AttachmentRepository.getByExperimentId(experimentId);
      const attachmentsMetaData = attachments.map((a) => a.toMetaDataDto());

      return NextResponse.json(
        {
          success: true,
          data: attachmentsMetaData,
        },
        { status: 200 },
      );
    } catch (error) {
      logError("Failed to fetch attachments", error, "GET /api/attachments");

      return NextResponse.json(
        { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
        { status: 500 },
      );
    }
  },
);

export const POST = withAuth(async function (
  req: Request,
): Promise<NextResponse<APIResponse<IAttachmentMetaData>>> {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const experimentId = formData.get("experimentId") as string;

    const validationResult = attachmentSchema.safeParse({
      experimentId,
      file,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: MESSAGES.InvalidAttachment },
        { status: 400 },
      );
    }

    // Check if the session.user has access to the attachments of the requested experimentId
    const validateExperimentAccessResponse = await validateExperimentAccess(
      experimentId,
      session.user.id,
    );

    if (validateExperimentAccessResponse instanceof NextResponse) {
      return validateExperimentAccessResponse;
    }

    // Convert file to Base64 string
    // Cloud Firestore does not support binary storage
    // In a prod env, this should be uploaded to a bucket, with stored url to the file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64File = fileBuffer.toString("base64");

    const newAttachment = new Attachment({
      id: Attachment.generateAttachmentId(),
      experimentId: validateExperimentAccessResponse.experiment.id,
      filename: file.name,
      mimeType: file.type,
      fileData: base64File,
      dateUploaded: new Date().toISOString(),
    });

    const attachment = await AttachmentRepository.create(newAttachment);

    return NextResponse.json(
      {
        success: true,
        data: attachment.toMetaDataDto(),
      },
      { status: 201 },
    );
  } catch (error) {
    logError("ISE when trying to add an attachment.", error, "POST /api/attachment");

    return NextResponse.json(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
