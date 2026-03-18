"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

interface DashboardChartsProps {
  ordersByDay: { date: string; count: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  usersByRole: { role: string; count: number }[];
  statusLabels: Record<string, string>;
  statusChartColors: Record<string, string>;
  roleLabels: Record<string, string>;
}

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: "#3b82f6",
  VENDOR: "#a855f7",
  DELIVERER: "#06b6d4",
  ADMIN: "#f59e0b",
  SUPERADMIN: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.dataKey === "revenue" ? `R$ ${Number(p.value).toFixed(2)}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardCharts({
  ordersByDay,
  ordersByStatus,
  usersByRole,
  statusLabels,
  statusChartColors,
  roleLabels,
}: DashboardChartsProps) {
  // Format dates for chart
  const chartData = ordersByDay.map((d) => ({
    ...d,
    label: new Date(d.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  }));

  const pieData = ordersByStatus
    .filter((s) => s.count > 0)
    .map((s) => ({
      name: statusLabels[s.status] || s.status,
      value: s.count,
      color: statusChartColors[s.status] || "#6b7280",
    }));

  const barData = usersByRole
    .filter((r) => r.count > 0)
    .map((r) => ({
      name: roleLabels[r.role] || r.role,
      count: r.count,
      color: ROLE_COLORS[r.role] || "#6b7280",
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Orders per day (area chart) */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 lg:col-span-2">
        <h2 className="text-lg font-bold text-white mb-4">Pedidos e Receita (últimos 30 dias)</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Area yAxisId="left" type="monotone" dataKey="count" name="Pedidos" stroke="#a855f7" fill="url(#colorCount)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="revenue" name="Receita" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-12">Sem dados no período</p>
        )}
      </div>

      {/* Orders by status (pie chart) */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Pedidos por Status</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "#d1d5db" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#9ca3af" }}
                formatter={(value) => <span style={{ color: "#d1d5db" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-12">Sem dados</p>
        )}
      </div>

      {/* Users by role (bar chart) */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Usuários por Tipo</h2>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "#d1d5db" }}
                formatter={(value: number) => [value, "Usuários"]}
              />
              <Bar dataKey="count" name="Usuários" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-12">Sem dados</p>
        )}
      </div>
    </div>
  );
}
