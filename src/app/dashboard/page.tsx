"use client";

import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "@/lib/graphql";

const roleLabels: Record<string, string> = {
  CUSTOMER: "Clientes",
  VENDOR: "Vendedores",
  DELIVERER: "Entregadores",
  ADMIN: "Admins",
  SUPERADMIN: "Super Admins",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  PREPARING: "Preparando",
  READY: "Pronto",
  PICKED_UP: "Coletado",
  DELIVERING: "A caminho",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  ACCEPTED: "bg-blue-500/20 text-blue-400",
  PREPARING: "bg-indigo-500/20 text-indigo-400",
  READY: "bg-green-500/20 text-green-400",
  PICKED_UP: "bg-teal-500/20 text-teal-400",
  DELIVERING: "bg-cyan-500/20 text-cyan-400",
  DELIVERED: "bg-emerald-500/20 text-emerald-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

export default function DashboardPage() {
  const { data, loading } = useQuery(GET_DASHBOARD_STATS, { pollInterval: 30000 });
  const stats = data?.dashboardStats;

  if (loading) {
    return <p className="text-gray-400">Carregando...</p>;
  }

  if (!stats) {
    return <p className="text-gray-400">Erro ao carregar dados</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Usuarios</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Lojas</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalStores}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Pedidos</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalOrders}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Receita Total</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            R$ {Number(stats.totalRevenue).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-purple-600">
          <p className="text-sm text-gray-400">Receita Plataforma</p>
          <p className="text-3xl font-bold text-purple-400 mt-1">
            R$ {Number(stats.platformRevenue).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Planos + Promocoes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 border border-cyan-800">
          <p className="text-sm text-gray-400">Entregadores Online</p>
          <p className="text-3xl font-bold text-cyan-400 mt-1">{stats.onlineDeliverers}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Entregas</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalDeliveries}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-yellow-800">
          <p className="text-sm text-gray-400">Entregas Ativas</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.activeDeliveries}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-emerald-800">
          <p className="text-sm text-gray-400">Entregas Concluidas</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.completedDeliveries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Usuarios por Tipo</h2>
          <div className="space-y-3">
            {stats.usersByRole.map((r: { role: string; count: number }) => (
              <div key={r.role} className="flex items-center justify-between">
                <span className="text-gray-300">{roleLabels[r.role] || r.role}</span>
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Pedidos por Status</h2>
          <div className="space-y-3">
            {stats.ordersByStatus.map((s: { status: string; count: number }) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-gray-300">{statusLabels[s.status] || s.status}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[s.status] || "bg-gray-600 text-gray-300"}`}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
