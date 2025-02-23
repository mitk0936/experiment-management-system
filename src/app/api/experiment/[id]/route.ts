import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { ExperimentRepository } from "@/core/repositories/Experiment/ExperimentRepository";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { withAuth } from "../../_utils/withAuth";
import { validateExperimentAccess } from "../../_utils/validateExperimentAccess";
import { ExperimentFormData, experimentSchema } from "@/core/validation/experiment/schema";
import { extractZodErrors } from "@/core/validation/utils";
import { IExperiment } from "@/core/entities/Experiment";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession, Session } from "next-auth";
import { AttachmentRepository } from "@/core/repositories/Attachment/AttachmentRepository";

type ExperimentRequestParams = {
  params: {
    id: string;
  };
};

export const PATCH = withAuth(async function (
  req: Request,
  { params }: ExperimentRequestParams,
): Promise<NextResponse<APIResponse<IExperiment>>> {
  try {
    const { id: experimentId } = await params;
    const session = (await getServerSession(authOptions)) as Session;
    const validateExperimentAccessResponse = await validateExperimentAccess(
      experimentId,
      session.user.id,
    );

    if (validateExperimentAccessResponse instanceof NextResponse) {
      return validateExperimentAccessResponse;
    }

    const body: ExperimentFormData = await req.json();
    const validation = experimentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, fieldErrors: extractZodErrors(validation) },
        { status: 400 },
      );
    }

    const updatedExperimentData = await ExperimentRepository.update(
      validateExperimentAccessResponse.experiment.id,
      { ...validation.data },
    );
    return NextResponse.json(
      {
        success: true,
        data: updatedExperimentData,
      },
      { status: 200 },
    );
  } catch (error) {
    logError("ISE when trying to update an experiment", error, "PATCH /api/experiment/:id");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async function (
  _req: Request,
  { params }: ExperimentRequestParams,
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const { id: experimentId } = await params;
    const session = (await getServerSession(authOptions)) as Session;

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
