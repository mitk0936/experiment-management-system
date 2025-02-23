import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/core/constants/routes";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return session ? redirect(PAGE_ROUTES.dashboard) : redirect(PAGE_ROUTES.login);
}
