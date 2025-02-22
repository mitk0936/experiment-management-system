import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import ExperimentRepository from "@/core/repositories/Experiment/ExperimentRepository";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { withAuth } from "../../auth/_utils/with-auth";
import { validateExperimentAccess } from "./_utils/validateExperimentAccess";
import { ExperimentFormData, experimentSchema } from "@/core/validation/experiment/schema";
import { extractZodErrors } from "@/core/validation/utils";
import { IExperiment } from "@/core/entities/Experiment";

export const PATCH = withAuth(async function (
  req: Request,
  sessionUser,
): Promise<NextResponse<APIResponse<IExperiment>>> {
  try {
    const validationResponse = await validateExperimentAccess(req, sessionUser);

    if (validationResponse instanceof NextResponse) {
      return validationResponse;
    }

    const { experimentId } = validationResponse;

    const body: ExperimentFormData = await req.json();
    const validation = experimentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, fieldErrors: extractZodErrors(validation) },
        { status: 400 },
      );
    }

    const updatedExperimentData = await ExperimentRepository.update(experimentId, { ...body });
    return NextResponse.json({ success: true, data: updatedExperimentData }, { status: 200 });
  } catch (error) {
    logError("ISE when trying to update an experiment", error, "PATCH /api/experiment/:id");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async function (
  req: Request,
  sessionUser,
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const validationResponse = await validateExperimentAccess(req, sessionUser);

    if (validationResponse instanceof NextResponse) {
      return validationResponse;
    }

    const { experimentId } = validationResponse;
    await ExperimentRepository.delete(experimentId);

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    logError("ISE when trying to delete an experiment", error, "DELETE /api/experiment/:id");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
