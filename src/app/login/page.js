"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500 to-purple-600">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 text-sm sm:text-base mb-6">
          Login to your account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg text-sm sm:text-base hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}