import SignInButtons from "../login/signin-client";

export const metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Use GitHub to create an account quickly.</p>
        <SignInButtons />
      </section>
    </main>
  );
}
