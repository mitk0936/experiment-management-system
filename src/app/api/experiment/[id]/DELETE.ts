import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { ExperimentRepository } from "@/core/repositories/Experiment/ExperimentRepository";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { withAuth } from "../../_utils/withAuth";
import { validateExperimentAccess } from "../../_utils/validateExperimentAccess";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getServerSession, Session } from "next-auth";
import { AttachmentRepository } from "@/core/repositories/Attachment/AttachmentRepository";

type ExperimentRequestParams = {
  params: Promise<{
    id: string;
  }>;
};

export const DELETE = withAuth(async function (
  _req: Request,
  { params }: ExperimentRequestParams,
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const { id: experimentId } = await params;
    const session = (await getServerSession(authOptions)) as Session;

    // Validate if the user has access to the experiment, before deleting it
    const validateExperimentAccessResponse = await validateExperimentAccess(
      experimentId,
      session.user.id,
    );

    if (validateExperimentAccessResponse instanceof NextResponse) {
      return validateExperimentAccessResponse;
    }

    await ExperimentRepository.delete(validateExperimentAccessResponse.experiment.id);
    await AttachmentRepository.deleteByExperimentId(validateExperimentAccessResponse.experiment.id);

    return NextResponse.json(
      {
        success: true,
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    logError("ISE when trying to delete an experiment", error, "DELETE /api/experiment/:id");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
