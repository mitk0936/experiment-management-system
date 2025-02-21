import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { MESSAGES } from "@/presentation/constants/messages";
import { APIErrorResponse, APIResponse } from "@/core/types/api";

export function withAuth<T>(handler: (req: Request) => Promise<NextResponse<APIResponse<T>>>) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: MESSAGES.RequestIsUnauthorized },
        { status: 401 },
      );
    }
    return handler(req);
  };
}
