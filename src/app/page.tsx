"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/lib/graphql";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };
const formContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
};
const formItem = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: spring },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading }] = useMutation(LOGIN);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login({ variables: { input: { email, password }, forceLogin: true } });
      if (data.loginApp.user.role !== "SUPERADMIN") {
        setError("Acesso permitido apenas para Super Admin");
        return;
      }
      localStorage.setItem("token", data.loginApp.accessToken);
      localStorage.setItem("user", JSON.stringify(data.loginApp.user));
      router.push("/dashboard");
    } catch {
      setError("Email ou senha invalidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 20, -15, 0], y: [0, -20, 15, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -20, 15, 0], y: [0, 20, -15, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-[40%] left-[20%] w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
        animate={{ x: [0, 15, -20, 0], y: [0, -15, 20, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, delay: 2 }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <img src="/logo.svg" alt="Shopping" className="w-80 mb-2 drop-shadow-lg" />
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 text-center">Super Admin</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Painel administrativo da plataforma</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={formContainer}
            initial="hidden"
            animate="show"
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <motion.div variants={formItem}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={formItem}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Senha</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={formItem}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold cursor-pointer hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
