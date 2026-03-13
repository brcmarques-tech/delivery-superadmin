"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS, UPDATE_USER_ROLE, TOGGLE_USER_ACTIVE } from "@/lib/graphql";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  CUSTOMER: "Cliente",
  VENDOR: "Vendedor",
  DELIVERER: "Entregador",
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
};

const roleColors: Record<string, string> = {
  CUSTOMER: "bg-blue-500/20 text-blue-400",
  VENDOR: "bg-orange-500/20 text-orange-400",
  DELIVERER: "bg-teal-500/20 text-teal-400",
  ADMIN: "bg-yellow-500/20 text-yellow-400",
  SUPERADMIN: "bg-purple-500/20 text-purple-400",
};

const roles = ["CUSTOMER", "VENDOR", "DELIVERER", "SUPERADMIN"];

export default function UsersPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_USERS);
  const [updateRole] = useMutation(UPDATE_USER_ROLE);
  const [toggleActive] = useMutation(TOGGLE_USER_ACTIVE);
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const users = data?.allUsers || [];

  const filtered = users.filter((u: any) => {
    const matchesSearch =
      !filter ||
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.phone.includes(filter);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function handleRoleChange(userId: string, role: string) {
    await updateRole({ variables: { id: userId, role } });
    refetch();
  }

  async function handleToggleActive(userId: string) {
    await toggleActive({ variables: { id: userId } });
    refetch();
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Usuarios ({users.length})</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos os tipos</option>
          {roles.map((r) => (
            <option key={r} value={r}>{roleLabels[r]}</option>
          ))}
        </select>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((user: any) => (
          <div key={user.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{user.name}</h3>
                {(user.role === "VENDOR" || user.role === "DELIVERER") && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.mpConnected
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-600/30 text-gray-500"
                    }`}
                  >
                    {user.mpConnected ? "MP \u2713" : "MP \u2717"}
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
              <p className="text-gray-500">Lojas: {user.stores?.length > 0 ? user.stores.map((s: any) => s.name).join(", ") : "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${roleColors[user.role] || "bg-gray-600 text-gray-300"}`}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
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
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Nome</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Email</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Telefone</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Tipo</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Lojas</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="p-4 text-white font-medium">
                    <span>{user.name}</span>
                    {(user.role === "VENDOR" || user.role === "DELIVERER") && (
                      <span
                        className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.mpConnected
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-600/30 text-gray-500"
                        }`}
                      >
                        {user.mpConnected ? "MP \u2713" : "MP \u2717"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 text-gray-300">{user.phone}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${roleColors[user.role] || "bg-gray-600 text-gray-300"}`}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{roleLabels[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {user.stores?.length > 0
                      ? user.stores.map((s: any) => s.name).join(", ")
                      : "-"
                    }
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
        </div>
      </div>
    </div>
  );
}
