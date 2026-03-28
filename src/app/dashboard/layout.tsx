"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// ─── Permission context (C1) ───
type PermissionsMap = Record<string, boolean>;

const PermissionContext = createContext<PermissionsMap>({});

export function usePermissions() {
  return useContext(PermissionContext);
}

/** Map route segments to permission keys */
const ROUTE_PERMISSION: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/approvals": "approvals",
  "/dashboard/users": "users",
  "/dashboard/stores": "stores",
  "/dashboard/orders": "orders",
  "/dashboard/deliveries": "deliveries",
  "/dashboard/payments": "payments",
  "/dashboard/plans": "plans",
  "/dashboard/badges": "badges",
  "/dashboard/promotions": "promotions",
  "/dashboard/coupons": "coupons",
  "/dashboard/contracts": "contracts",
  "/dashboard/notifications": "notifications",
  "/dashboard/settings": "settings",
};

function parsePermissions(permStr: string | null | undefined): PermissionsMap {
  if (!permStr) {
    // null = master admin, all permissions
    const all: PermissionsMap = {};
    Object.values(ROUTE_PERMISSION).forEach((p) => (all[p] = true));
    return all;
  }
  try {
    return JSON.parse(permStr);
  } catch {
    const all: PermissionsMap = {};
    Object.values(ROUTE_PERMISSION).forEach((p) => (all[p] = true));
    return all;
  }
}

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", perm: "dashboard" },
      { href: "/dashboard/approvals", label: "Aprovações", perm: "approvals" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/dashboard/users", label: "Usuários", perm: "users" },
      { href: "/dashboard/stores", label: "Lojas", perm: "stores" },
      { href: "/dashboard/orders", label: "Pedidos", perm: "orders" },
      { href: "/dashboard/deliveries", label: "Entregas", perm: "deliveries" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/dashboard/payments", label: "Pagamentos", perm: "payments" },
      { href: "/dashboard/plans", label: "Planos", perm: "plans" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { href: "/dashboard/badges", label: "Selos", perm: "badges" },
      { href: "/dashboard/promotions", label: "Promoções", perm: "promotions" },
      { href: "/dashboard/coupons", label: "Cupons", perm: "coupons" },
      { href: "/dashboard/contracts", label: "Contratos", perm: "contracts" },
      { href: "/dashboard/notifications", label: "Notificações", perm: "notifications" },
      { href: "/dashboard/settings", label: "Configurações", perm: "settings" },
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
  const [user, setUser] = useState<{ name: string; role?: string; permissions?: string | null } | null>(null);
  const [permissions, setPermissions] = useState<PermissionsMap>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || !localStorage.getItem("token")) {
      router.push("/");
      return;
    }
    const storedUser = JSON.parse(stored);
    // M1: Verify SUPERADMIN role client-side
    if (storedUser.role !== "SUPERADMIN") {
      localStorage.clear();
      router.push("/");
      return;
    }
    setUser(storedUser);
    setPermissions(parsePermissions(storedUser.permissions));
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
        <img src="/logo.svg" alt="Shopping" className="h-8" />
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
            <img src="/logo.svg" alt="Shopping" className="h-10" />
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
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => permissions[item.perm] !== false);
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{group.label}</p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
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
            );
          })}
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
          <img src="/logo.svg" alt="Shopping" className="h-12" />
          <p className="text-xs text-gray-500 mt-1 text-center">Super Admin</p>
        </div>

        <nav className="flex-1 px-4 pt-6 pb-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => permissions[item.perm] !== false);
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{group.label}</p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
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
            );
          })}
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
        <PermissionContext.Provider value={permissions}>
          {/* C1: Check permission for current page */}
          {(() => {
            const permKey = ROUTE_PERMISSION[pathname];
            if (permKey && permissions[permKey] === false) {
              return (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400 mb-2">Acesso nao autorizado</p>
                    <p className="text-gray-500">Voce nao tem permissao para acessar esta pagina.</p>
                  </div>
                </div>
              );
            }
            return children;
          })()}
        </PermissionContext.Provider>
      </main>
    </div>
  );
}
