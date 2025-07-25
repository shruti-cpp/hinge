"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace("/dashboard");
    } else {
      setSessionChecked(true);
    }
  };
  checkSession();
}, []);

  const handleSignup = async () => {
    if (loading) return; 
    setLoading(true);
    setError(""); 

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data?.user;
    if (user) {
      // Now insert into your custom "users" table
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id, // match this to auth.users.id (UUID)
        email,
        username,
        full_name: fullName,
      });
      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    router.push("/dashboard"); // Redirect on successful signup
  };

  if (!sessionChecked) {
    // Optional: display a loading message while checking session
    return (
      <main className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
    setLoading(false);
  }

  return (
    <main className="flex flex-col gap-4 max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold">Create your account</h1>

      <input
        className="border p-2"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button className="bg-blue-600 text-white py-2" onClick={handleSignup}>
        Sign Up
      </button>
    </main>
  );
}