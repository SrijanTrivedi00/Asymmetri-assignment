"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function SignInButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-700">Signed in as <span className="font-medium">{session.user?.email ?? session.user?.name}</span></p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="w-48 px-4 py-2 bg-gray-900 text-white rounded shadow hover:bg-gray-800"
        onClick={() => signIn("github", { callbackUrl: "/home" })}
      >
        Sign in with GitHub
      </button>
      <p className="text-sm text-gray-500">No password required — uses GitHub OAuth</p>
    </div>
  );
}
