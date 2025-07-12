import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("DASHBOARD SESSION:", session); // 🚨 This line is outside any function


  if (!session) {
    // Not logged in—redirect to login
    redirect("/login");
  }

  const user = session.user;

  return (
    <main className="flex flex-col gap-4 max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <form action="/auth/signout" method="post">
        <button className="bg-red-600 text-white py-2 mt-4" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
