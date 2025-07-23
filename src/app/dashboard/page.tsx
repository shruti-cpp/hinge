import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const fullName = user.user_metadata?.fullName || "Guest";

  const { data: profile } = await supabase
    .from("profile")
    .select("profile_pic, language, introduction, timezone, age, gender")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex flex-col gap-6 max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome, {fullName}!</p>

      {profile?.profile_pic && (
        <div className="w-24 h-24 relative rounded-full overflow-hidden border">
          <Image src={profile.profile_pic} alt="Profile Pic" fill />
        </div>
      )}

      <form
        action="/update-profile"
        method="POST"
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col">
          Profile Picture URL
          <input
            name="profile_pic"
            type="text"
            defaultValue={profile?.profile_pic || ""}
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Language
          <input
            name="language"
            type="text"
            defaultValue={profile?.language || ""}
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Introduction
          <textarea
            name="introduction"
            defaultValue={profile?.introduction || ""}
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Timezone
          <input
            name="timezone"
            type="text"
            defaultValue={profile?.timezone || ""}
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Age
          <input
            name="age"
            type="number"
            defaultValue={profile?.age || ""}
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Gender
          <select
            name="gender"
            defaultValue={profile?.gender || ""}
            className="border p-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
            <option value="prefer_not_say">Prefer not to say</option>
          </select>
        </label>

        <button type="submit" className="bg-blue-600 text-white py-2 mt-4">
          Update Profile
        </button>
      </form>

      <form action="/auth/signout" method="post">
        <button className="bg-red-600 text-white py-2 mt-4" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}