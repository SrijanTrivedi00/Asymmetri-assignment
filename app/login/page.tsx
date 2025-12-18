import SignInButtons from "./signin-client";


export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in with your GitHub account to continue.</p>
        <SignInButtons />
      </section>
    </main>
  );
}
