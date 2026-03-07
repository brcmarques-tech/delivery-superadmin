"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/approvals", label: "Aprovacoes" },
  { href: "/dashboard/users", label: "Usuarios" },
  { href: "/dashboard/stores", label: "Lojas" },
  { href: "/dashboard/orders", label: "Pedidos" },
  { href: "/dashboard/notifications", label: "Notificacoes" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || !localStorage.getItem("token")) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-purple-400">bcmTech</h1>
          <p className="text-sm text-gray-400">Super Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                pathname === item.href
                  ? "bg-purple-600/20 text-purple-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 cursor-pointer hover:text-red-300 active:scale-95 transition"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
