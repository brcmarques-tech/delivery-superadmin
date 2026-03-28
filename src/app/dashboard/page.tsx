"use client";

import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "@/lib/graphql";
import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), { ssr: false });

const roleLabels: Record<string, string> = {
  CUSTOMER: "Clientes",
  VENDOR: "Vendedores",
  DELIVERER: "Entregadores",
  ADMIN: "Admins",
  SUPERADMIN: "Super Admins",
};

const statusLabels: Record<string, string> = {
  AWAITING_PAYMENT: "Aguardando Pgto",
  PAYMENT_REVIEW: "Revisão Pgto",
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  PREPARING: "Preparando",
  READY: "Pronto",
  VENDOR_CONFIRMED_PICKUP: "Coleta Confirmada",
  PICKED_UP: "Coletado",
  DELIVERING: "A caminho",
  DELIVERER_CONFIRMED_DELIVERY: "Entrega Confirmada",
  DELIVERED: "Entregue",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  REJECTED: "Rejeitado",
  EXPIRED: "Expirado",
  DISPUTED: "Disputado",
};

const statusColors: Record<string, string> = {
  AWAITING_PAYMENT: "bg-amber-500/20 text-amber-400",
  PAYMENT_REVIEW: "bg-orange-500/20 text-orange-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  ACCEPTED: "bg-blue-500/20 text-blue-400",
  PREPARING: "bg-indigo-500/20 text-indigo-400",
  READY: "bg-green-500/20 text-green-400",
  VENDOR_CONFIRMED_PICKUP: "bg-lime-500/20 text-lime-400",
  PICKED_UP: "bg-teal-500/20 text-teal-400",
  DELIVERING: "bg-cyan-500/20 text-cyan-400",
  DELIVERER_CONFIRMED_DELIVERY: "bg-sky-500/20 text-sky-400",
  DELIVERED: "bg-emerald-500/20 text-emerald-400",
  COMPLETED: "bg-green-600/20 text-green-300",
  CANCELLED: "bg-red-500/20 text-red-400",
  REJECTED: "bg-rose-500/20 text-rose-400",
  EXPIRED: "bg-gray-500/20 text-gray-400",
  DISPUTED: "bg-purple-500/20 text-purple-400",
};

const statusChartColors: Record<string, string> = {
  AWAITING_PAYMENT: "#f59e0b",
  PAYMENT_REVIEW: "#f97316",
  PENDING: "#eab308",
  ACCEPTED: "#3b82f6",
  PREPARING: "#6366f1",
  READY: "#22c55e",
  VENDOR_CONFIRMED_PICKUP: "#84cc16",
  PICKED_UP: "#14b8a6",
  DELIVERING: "#06b6d4",
  DELIVERER_CONFIRMED_DELIVERY: "#0ea5e9",
  DELIVERED: "#10b981",
  COMPLETED: "#16a34a",
  CANCELLED: "#ef4444",
  REJECTED: "#f43f5e",
  EXPIRED: "#6b7280",
  DISPUTED: "#a855f7",
};

// L2: Locale-formatted currency
const formatBRL = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

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
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Dashboard</h1>

      {/* Row 1: Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <StatCard label="Usuários" value={stats.totalUsers} />
        <StatCard label="Lojas" value={stats.totalStores} />
        <StatCard label="Pedidos" value={stats.totalOrders} />
        <StatCard label="Receita Total" value={formatBRL(stats.totalRevenue)} color="text-emerald-400" />
        {/* M3: Clarified label for platformRevenue breakdown */}
        <StatCard label="Receita Plataforma" value={formatBRL(stats.platformRevenue)} color="text-purple-400" border="border-purple-600" sub="Planos + Promocoes + Comissoes" />
        <StatCard label="Aprovações Pendentes" value={stats.pendingApprovals} color={stats.pendingApprovals > 0 ? "text-orange-400" : "text-white"} border={stats.pendingApprovals > 0 ? "border-orange-600" : "border-gray-700"} />
      </div>

      {/* Row 2: Delivery stats + KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <StatCard label="Entregadores Online" value={stats.onlineDeliverers} color="text-cyan-400" border="border-cyan-800" />
        <StatCard label="Total Entregas" value={stats.totalDeliveries} />
        <StatCard label="Entregas Ativas" value={stats.activeDeliveries} color="text-yellow-400" border="border-yellow-800" />
        <StatCard label="Entregas Concluídas" value={stats.completedDeliveries} color="text-emerald-400" border="border-emerald-800" />
        <StatCard label="Ticket Médio" value={formatBRL(stats.avgTicket)} color="text-blue-400" border="border-blue-800" />
        <StatCard label="Taxa Cancelamento" value={`${Number(stats.cancellationRate).toFixed(1)}%`} color={stats.cancellationRate > 10 ? "text-red-400" : "text-green-400"} border={stats.cancellationRate > 10 ? "border-red-800" : "border-green-800"} />
        <StatCard label="Agendamentos" value={stats.totalAppointments} color="text-violet-400" border="border-violet-800" />
        <StatCard label="Receita Agendamentos" value={formatBRL(stats.appointmentRevenue)} color="text-violet-400" border="border-violet-800" />
      </div>

      {/* Row 3: Charts */}
      <DashboardCharts
        ordersByDay={stats.ordersByDay}
        ordersByStatus={stats.ordersByStatus}
        usersByRole={stats.usersByRole}
        statusLabels={statusLabels}
        statusChartColors={statusChartColors}
        roleLabels={roleLabels}
      />

      {/* Row 4: Recent orders + Top stores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {/* Recent orders */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Pedidos Recentes</h2>
          <div className="space-y-3">
            {stats.recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">#{o.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[o.status] || "bg-gray-600 text-gray-300"}`}>
                      {statusLabels[o.status] || o.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{o.customerName} — {o.storeName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-emerald-400">{formatBRL(o.total)}</p>
                  <p className="text-[10px] text-gray-500">{new Date(o.createdAt).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum pedido ainda</p>
            )}
          </div>
        </div>

        {/* Top stores */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Top Lojas</h2>
          <div className="space-y-3">
            {stats.topStores.map((s: any, i: number) => (
              <div key={s.storeId} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                  i === 1 ? "bg-gray-400/20 text-gray-300" :
                  i === 2 ? "bg-amber-600/20 text-amber-500" :
                  "bg-gray-700 text-gray-500"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{s.storeName}</p>
                  <p className="text-xs text-gray-500">{s.orderCount} pedidos</p>
                </div>
                <span className="text-emerald-400 font-semibold text-sm shrink-0">{formatBRL(s.revenue)}</span>
              </div>
            ))}
            {stats.topStores.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Nenhuma loja ainda</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Tables (users by role + orders by status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Usuários por Tipo</h2>
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

        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
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

function StatCard({ label, value, color, border, sub }: {
  label: string;
  value: string | number;
  color?: string;
  border?: string;
  sub?: string;
}) {
  return (
    <div className={`bg-gray-800 rounded-2xl p-4 border ${border || "border-gray-700"}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color || "text-white"}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}
