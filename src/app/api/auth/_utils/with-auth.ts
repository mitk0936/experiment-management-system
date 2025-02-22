import { getServerSession, Session, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { MESSAGES } from "@/presentation/constants/messages";
import { APIErrorResponse, APIResponse } from "@/core/types/api";

export function withAuth<T>(
  handler: (req: Request, user: Session["user"]) => Promise<NextResponse<APIResponse<T>>>,
) {
  return async (req: Request) => {
    const session: Session | null = await getServerSession(authOptions);

    const isSessionValid = Boolean(session?.user?.id);

    if (!session || !isSessionValid) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: MESSAGES.RequestIsUnauthorized },
        { status: 401 },
      );
    }
    return handler(req, session.user);
  };
}
