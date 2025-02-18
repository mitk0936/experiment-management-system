"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-3 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition-all"
    >
      <FcGoogle className="w-7 h-7 p-1 bg-white rounded-full" />
      <span className="text-sm font-medium">Login with Google</span>
    </button>
  );
}
