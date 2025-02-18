"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <div
      onClick={() => signOut()}
      className="block px-4 py-2 hover:bg-sidebar-accent rounded flex gap-3 hover:cursor-pointer"
    >
      <LogOut />
      <button>Logout</button>
    </div>
  );
}
