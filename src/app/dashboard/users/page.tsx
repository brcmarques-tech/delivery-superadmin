"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_APP_USERS, GET_ALL_VENDOR_USERS, UPDATE_APP_USER_ROLE, TOGGLE_APP_USER_ACTIVE, TOGGLE_VENDOR_USER_ACTIVE } from "@/lib/graphql";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  CUSTOMER: "Cliente",
  VENDOR: "Vendedor",
  DELIVERER: "Entregador",
  SUPERADMIN: "Super Admin",
};

const roleColors: Record<string, string> = {
  CUSTOMER: "bg-blue-500/20 text-blue-400",
  VENDOR: "bg-orange-500/20 text-orange-400",
  DELIVERER: "bg-teal-500/20 text-teal-400",
  SUPERADMIN: "bg-purple-500/20 text-purple-400",
};

type Tab = "customers" | "deliverers" | "vendors" | "admins";

export default function UsersPage() {
  const { data: appData, loading: loadingApp, refetch: refetchApp } = useQuery(GET_ALL_APP_USERS);
  const { data: vendorData, loading: loadingVendor, refetch: refetchVendor } = useQuery(GET_ALL_VENDOR_USERS);
  const [updateRole] = useMutation(UPDATE_APP_USER_ROLE);
  const [toggleAppActive] = useMutation(TOGGLE_APP_USER_ACTIVE);
  const [toggleVendorActive] = useMutation(TOGGLE_VENDOR_USER_ACTIVE);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<Tab>("customers");

  const allAppUsers = appData?.allAppUsers || [];
  const vendorUsers = vendorData?.allVendorUsers || [];
  const customers = allAppUsers.filter((u: any) => u.role === "CUSTOMER");
  const deliverers = allAppUsers.filter((u: any) => u.role === "DELIVERER");
  const admins = allAppUsers.filter((u: any) => u.role === "SUPERADMIN");
  const loading = loadingApp || loadingVendor;
  const totalCount = allAppUsers.length + vendorUsers.length;

  const usersMap: Record<Tab, any[]> = {
    customers,
    deliverers,
    vendors: vendorUsers,
    admins,
  };

  const users = usersMap[tab];

  const filtered = users.filter((u: any) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.includes(filter)
    );
  });

  async function handleToggleActive(userId: string) {
    if (tab === "vendors") {
      await toggleVendorActive({ variables: { id: userId } });
      refetchVendor();
    } else {
      await toggleAppActive({ variables: { id: userId } });
      refetchApp();
    }
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  const tabs: { key: Tab; label: string; count: number; activeColor: string }[] = [
    { key: "customers", label: "Clientes", count: customers.length, activeColor: "bg-blue-600 text-white" },
    { key: "deliverers", label: "Entregadores", count: deliverers.length, activeColor: "bg-teal-600 text-white" },
    { key: "vendors", label: "Vendedores", count: vendorUsers.length, activeColor: "bg-orange-600 text-white" },
    { key: "admins", label: "Admins", count: admins.length, activeColor: "bg-purple-600 text-white" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Usuarios ({totalCount})</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              tab === t.key ? t.activeColor : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* ── Mobile: Cards ── */}
      <div className="md:hidden space-y-3">
        {filtered.map((user: any) => (
          <div key={user.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{user.name}</h3>
                {(tab === "vendors" || tab === "deliverers") && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.paymentConnected
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-600/30 text-gray-500"
                    }`}
                  >
                    {user.paymentConnected ? "Pag \u2713" : "Pag \u2717"}
                  </span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {user.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>

            <div className="space-y-1.5 text-sm mb-3">
              <p className="text-gray-400 break-all">{user.email}</p>
              <p className="text-gray-400">{user.phone}</p>
              {tab === "customers" && user.cpf && (
                <p className="text-gray-500">CPF: {user.cpf}</p>
              )}
              {tab === "deliverers" && (
                <>
                  <p className="text-gray-500">CPF: {user.cpf || "-"}</p>
                  <p className="text-gray-500">Veiculo: {user.vehicleType || "-"} {user.vehiclePlate ? `(${user.vehiclePlate})` : ""}</p>
                  {user.identityPhotoUrl && (
                    <img src={user.identityPhotoUrl} alt="Identidade" className="w-20 h-20 object-cover rounded-lg border border-gray-600 mt-1" />
                  )}
                </>
              )}
              {tab === "vendors" && (
                <>
                  <p className="text-gray-500">CPF: {user.cpf || "-"}</p>
                  <p className="text-gray-500">Plano: {user.vendorPlan || "FREE"}</p>
                  <p className="text-gray-500">Lojas: {user.stores?.length > 0 ? user.stores.map((s: any) => s.name).join(", ") : "-"}</p>
                </>
              )}
              <p className="text-gray-600 text-xs">Cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => handleToggleActive(user.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-95 ${
                  user.isActive
                    ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                    : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                }`}
              >
                {user.isActive ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-8">Nenhum usuario encontrado</p>
        )}
      </div>

      {/* ── Desktop: Table ── */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Nome</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Email</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Telefone</th>
                {tab === "deliverers" && (
                  <th className="text-left p-4 text-sm text-gray-400 font-medium">Veiculo</th>
                )}
                {tab === "vendors" && (
                  <>
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Plano</th>
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Lojas</th>
                  </>
                )}
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Cadastro</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="p-4 text-white font-medium">
                    <span>{user.name}</span>
                    {(tab === "vendors" || tab === "deliverers") && (
                      <span
                        className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.paymentConnected
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-600/30 text-gray-500"
                        }`}
                      >
                        {user.paymentConnected ? "Pag \u2713" : "Pag \u2717"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 text-gray-300">{user.phone}</td>
                  {tab === "deliverers" && (
                    <td className="p-4 text-gray-300">
                      {user.vehicleType || "-"} {user.vehiclePlate ? `(${user.vehiclePlate})` : ""}
                    </td>
                  )}
                  {tab === "vendors" && (
                    <>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors.VENDOR}`}>
                          {user.vendorPlan || "FREE"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {user.stores?.length > 0
                          ? user.stores.map((s: any) => s.name).join(", ")
                          : "-"
                        }
                      </td>
                    </>
                  )}
                  <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-95 ${
                        user.isActive
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      }`}
                    >
                      {user.isActive ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-gray-500 text-center py-8">Nenhum usuario encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
