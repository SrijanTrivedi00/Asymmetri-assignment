"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function SignInButtons() {
  const { data: session } = useSession();
  const Router=useRouter();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-700">Signed in as <span className="font-medium">{session.user?.email ?? session.user?.name}</span></p>
       <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-red-600"
          onClick={() => Router.push("/home")}
        >
          Go To Home
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          className="w-48 px-4 py-2 bg-gray-900 text-white rounded shadow hover:bg-gray-800"
          onClick={() => signIn("github", { callbackUrl: "/home" })}
        >
          Sign in with GitHub
        </button>

        <button
          className="w-48 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => signIn("google", { callbackUrl: "/home" })}
        >
          Sign in with Google
        </button>
      </div>

      <p className="text-sm text-gray-500">No password required — choose an OAuth provider</p>
    </div>
  );
}
