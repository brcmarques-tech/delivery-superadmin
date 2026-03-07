"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/lib/graphql";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { loading }] = useMutation(LOGIN);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login({ variables: { input: { email, password } } });
      if (data.login.user.role !== "SUPERADMIN") {
        setError("Acesso permitido apenas para Super Admin");
        return;
      }
      localStorage.setItem("token", data.login.accessToken);
      localStorage.setItem("user", JSON.stringify(data.login.user));
      router.push("/dashboard");
    } catch {
      setError("Email ou senha invalidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Delivery" className="h-16" />
        </div>
        <p className="text-gray-400 text-center mb-8">Super Admin</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm border border-red-800">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold cursor-pointer hover:bg-purple-700 active:scale-95 disabled:opacity-50 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
