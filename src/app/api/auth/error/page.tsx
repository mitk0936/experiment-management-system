import { PAGE_ROUTES } from "@/core/constants/routes";
import { redirect } from "next/navigation";

export default function AuthErrorPage() {
  // Redirect users to login immediately
  redirect(PAGE_ROUTES.login);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  );
}
