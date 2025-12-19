"use client";

import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";

type Props = {
  name?: string | null;
  email?: string | null;
};

export default function Header({ name, email }: Props) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold">Asymmetri Assistant</h1>
          <p className="text-sm text-gray-500">
            Hello,{" "}
            <span className="font-medium">
              {name ?? email}
            </span>
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition cursor-pointer"
        >
          <span className="text-red-500">Logout</span>
          <BiLogOutCircle className="text-3xl" />
        </button>
      </div>
    </header>
  );
}
