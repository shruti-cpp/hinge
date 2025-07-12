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

    console.log("Attempting login with:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      alert(error.message);
    } else if (data.session) {
      console.log("Login success, session data:", data.session);

      // Manually set the session to persist cookies
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (setSessionError) {
        console.error("Error setting session:", setSessionError);
        alert("Error saving session.");
      } else {
        console.log("Session successfully set. Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } else {
      console.warn("No session returned from signInWithPassword.");
      alert("Login failed. No session.");
    }
  };

  return (
    <main className="flex flex-col gap-4 max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 mt-2"
        >
          Login
        </button>
      </form>
      <p>
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 underline">
          Sign up
        </a>
      </p>
    </main>
  );
}
