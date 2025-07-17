"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else if (data.session) {
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (setSessionError) {
        alert("Error saving session.");
      } else {
        router.push("/dashboard");
      }
    } else {
      alert("Login failed. No session.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-pink-700">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2"
            required
          />
          <button
            type="submit"
            className="rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-700">
          Don’t have an account?{" "}
          <a href="/signup" className="text-pink-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
