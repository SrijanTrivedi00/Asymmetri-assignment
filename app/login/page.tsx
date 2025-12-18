import SignInButtons from "./signin-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-100">
      <section className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back 👋</h1>
          {!session && (
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue to chat!
            </p>
          )}
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400">Secure Login</span>
          </div>
        </div>
        <SignInButtons />
        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <span className="font-medium text-gray-700">Terms</span> &{" "}
          <span className="font-medium text-gray-700">Privacy Policy</span>
        </p>
      </section>
    </main>
  );
}
