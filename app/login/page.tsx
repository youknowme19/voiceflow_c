"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      alert("Check your email for the login link");
      router.push("/");
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-black p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Sign in to VoiceBuild</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Send magic link
        </button>
      </form>
    </div>
  );
}
