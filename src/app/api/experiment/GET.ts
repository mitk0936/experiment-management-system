import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { ExperimentRepository } from "@/core/repositories/Experiment/ExperimentRepository";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { withAuth } from "../_utils/withAuth";
import { IExperiment } from "@/core/types/entities";

export const GET = withAuth(async function (): Promise<NextResponse<APIResponse<IExperiment[]>>> {
  try {
    const experiments = await ExperimentRepository.getAll();
    return NextResponse.json(
      {
        success: true,
        data: experiments,
      },
      { status: 200 },
    );
  } catch (error) {
    logError("ISE when trying to fetch experiments", error, "GET /api/experiment");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
