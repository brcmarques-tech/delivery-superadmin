"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/approvals", label: "Aprovações" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/dashboard/users", label: "Usuários" },
      { href: "/dashboard/stores", label: "Lojas" },
      { href: "/dashboard/orders", label: "Pedidos" },
      { href: "/dashboard/deliveries", label: "Entregas" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/dashboard/payments", label: "Pagamentos" },
      { href: "/dashboard/plans", label: "Planos" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { href: "/dashboard/badges", label: "Selos" },
      { href: "/dashboard/promotions", label: "Promoções" },
      { href: "/dashboard/coupons", label: "Cupons" },
      { href: "/dashboard/contracts", label: "Contratos" },
      { href: "/dashboard/notifications", label: "Notificações" },
      { href: "/dashboard/settings", label: "Configurações" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || !localStorage.getItem("token")) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <div className="h-screen flex bg-gray-900 overflow-hidden">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-300 hover:text-white transition p-1"
          aria-label="Abrir menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <img src="/logo.svg" alt="Delivery" className="h-8" />
        <span className="text-xs text-gray-500">Super Admin</span>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <img src="/logo.svg" alt="Delivery" className="h-10" />
            <p className="text-xs text-gray-500 mt-1 text-center">Super Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition p-1"
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 pt-6 pb-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
                      pathname === item.href
                        ? "bg-purple-600/20 text-purple-400 font-semibold"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
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

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-800 border-r border-gray-700 flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <img src="/logo.svg" alt="Delivery" className="h-12" />
          <p className="text-xs text-gray-500 mt-1 text-center">Super Admin</p>
        </div>

        <nav className="flex-1 px-4 pt-6 pb-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
                      pathname === item.href
                        ? "bg-purple-600/20 text-purple-400 font-semibold"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
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

      <main className="flex-1 p-4 md:px-10 md:py-8 pt-20 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
