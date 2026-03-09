"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_DELIVERIES } from "@/lib/graphql";
import { useState } from "react";

export default function DeliveriesPage() {
  const { data, loading } = useQuery(GET_ALL_DELIVERIES, { pollInterval: 15000 });
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const deliveries = data?.allDeliveries || [];

  function getStatus(d: any) {
    if (d.deliveredAt) return "DELIVERED";
    if (d.pickedUpAt) return "DELIVERING";
    return "PICKED_UP";
  }

  const filtered = deliveries.filter((d: any) => {
    const status = getStatus(d);
    if (statusFilter !== "ALL" && status !== statusFilter) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      d.deliverer?.name?.toLowerCase().includes(q) ||
      d.order?.orderNumber?.toLowerCase().includes(q) ||
      d.order?.store?.name?.toLowerCase().includes(q) ||
      d.order?.customer?.name?.toLowerCase().includes(q)
    );
  });

  const active = deliveries.filter((d: any) => !d.deliveredAt).length;
  const completed = deliveries.filter((d: any) => d.deliveredAt).length;

  const statusLabels: Record<string, string> = {
    PICKED_UP: "Coletado",
    DELIVERING: "A caminho",
    DELIVERED: "Entregue",
  };

  const statusColors: Record<string, string> = {
    PICKED_UP: "bg-teal-500/20 text-teal-400",
    DELIVERING: "bg-cyan-500/20 text-cyan-400",
    DELIVERED: "bg-emerald-500/20 text-emerald-400",
  };

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Entregas ({deliveries.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{deliveries.length}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-800">
          <p className="text-sm text-gray-400">Em andamento</p>
          <p className="text-2xl font-bold text-cyan-400">{active}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-emerald-800">
          <p className="text-sm text-gray-400">Concluidas</p>
          <p className="text-2xl font-bold text-emerald-400">{completed}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por entregador, pedido, loja..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 max-w-md px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">Todos</option>
          <option value="PICKED_UP">Coletado</option>
          <option value="DELIVERING">A caminho</option>
          <option value="DELIVERED">Entregue</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((d: any) => {
          const status = getStatus(d);
          return (
            <div key={d.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold">#{d.order?.orderNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                    {statusLabels[status]}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(d.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Entregador</p>
                  <p className="text-white">{d.deliverer?.name || "—"}</p>
                  <p className="text-gray-400">{d.deliverer?.phone || ""}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Loja</p>
                  <p className="text-white">{d.order?.store?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Cliente</p>
                  <p className="text-white">{d.order?.customer?.name || "—"}</p>
                  <p className="text-gray-400">{d.order?.customer?.phone || ""}</p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p className="text-gray-500">Endereco de entrega</p>
                <p className="text-gray-300">{d.order?.deliveryAddress || "—"}</p>
              </div>

              <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
                <span>Taxa: R$ {Number(d.order?.deliveryFee || 0).toFixed(2)}</span>
                <span>Total pedido: R$ {Number(d.order?.total || 0).toFixed(2)}</span>
                {d.pickedUpAt && <span>Coletado: {new Date(d.pickedUpAt).toLocaleString("pt-BR")}</span>}
                {d.deliveredAt && <span>Entregue: {new Date(d.deliveredAt).toLocaleString("pt-BR")}</span>}
              </div>

              {/* Payout info for completed deliveries with app deliverers */}
              {d.deliveredAt && !d.order?.store?.hasOwnDelivery && (
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-2 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">Vendedor:</span>
                    <span className="text-white font-semibold">R$ {Number(d.vendorPayoutAmount || 0).toFixed(2)}</span>
                    {d.vendorPayoutStatus === "completed" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">Pago</span>
                    )}
                    {d.vendorPayoutStatus === "failed" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">Falhou</span>
                    )}
                    {d.vendorPayoutMpId && <span className="text-gray-600">MP: {d.vendorPayoutMpId}</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">Entregador:</span>
                    <span className="text-white font-semibold">R$ {Number(d.payoutAmount || 0).toFixed(2)}</span>
                    {d.payoutStatus === "completed" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">Pago</span>
                    )}
                    {d.payoutStatus === "failed" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">Falhou</span>
                    )}
                    {d.payoutStatus === "pending_confirmation" && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">Aguardando confirmacao</span>
                    )}
                    {d.payoutMpId && <span className="text-gray-600">MP: {d.payoutMpId}</span>}
                  </div>
                </div>
              )}
              {d.deliveredAt && d.order?.store?.hasOwnDelivery && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-4 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-gray-600/20 text-gray-400 font-semibold">Entrega propria</span>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-8">Nenhuma entrega encontrada</p>
        )}
      </div>
    </div>
  );
}
