import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <section className="w-full max-w-2xl bg-white rounded-lg shadow p-10">
        <h1 className="text-3xl font-bold mb-2">Protected Home</h1>
        <p className="text-gray-700">
          Welcome,{" "}
          <span className="font-medium">
            {session?.user?.name ?? session?.user?.email}
          </span>
          !
        </p>
      </section>
    </main>
  );
}
