"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS } from "@/lib/graphql";
import { useState } from "react";

const statusLabels: Record<string, { label: string; color: string }> = {
  AWAITING_PAYMENT: { label: "Aguardando pagamento", color: "bg-orange-500/20 text-orange-400" },
  PENDING: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400" },
  ACCEPTED: { label: "Aceito", color: "bg-blue-500/20 text-blue-400" },
  PREPARING: { label: "Preparando", color: "bg-indigo-500/20 text-indigo-400" },
  READY: { label: "Pronto", color: "bg-green-500/20 text-green-400" },
  PICKED_UP: { label: "Coletado", color: "bg-teal-500/20 text-teal-400" },
  DELIVERING: { label: "A caminho", color: "bg-cyan-500/20 text-cyan-400" },
  DELIVERED: { label: "Entregue", color: "bg-emerald-500/20 text-emerald-400" },
  CANCELLED: { label: "Cancelado", color: "bg-red-500/20 text-red-400" },
};

const allStatuses = ["", "AWAITING_PAYMENT", "PENDING", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "DELIVERING", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const { data, loading } = useQuery(GET_ALL_ORDERS, { pollInterval: 15000 });
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const orders = data?.allOrders || [];

  const filtered = orders.filter((o: any) => {
    const matchesSearch =
      !filter ||
      o.orderNumber.toLowerCase().includes(filter.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(filter.toLowerCase()) ||
      o.store?.name.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Todos os Pedidos ({orders.length})
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por numero, cliente ou loja..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos os status</option>
          {allStatuses.filter(Boolean).map((s) => (
            <option key={s} value={s}>{statusLabels[s]?.label || s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((order: any) => {
          const status = statusLabels[order.status] || {
            label: order.status,
            color: "bg-gray-600 text-gray-300",
          };

          return (
            <div
              key={order.id}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white text-lg">
                    #{order.orderNumber}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                  {order.isPickup && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400">
                      Retirada
                    </span>
                  )}
                  {order.paymentMethod && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-600/30 text-gray-400">
                      {order.paymentMethod === "MP_MARKETPLACE" ? "MP Split" : order.paymentMethod}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cliente</p>
                  <p className="text-white">{order.customer?.name}</p>
                  <p className="text-gray-400 text-sm">{order.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Loja</p>
                  <p className="text-white">{order.store?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Endereco</p>
                  <p className="text-gray-300 text-sm">{order.deliveryAddress}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-3 mb-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-gray-300">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-gray-400">
                      R$ {Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-400">
                    Subtotal: R$ {Number(order.subtotal).toFixed(2)}
                  </span>
                  <span className="text-gray-400">
                    Entrega: R$ {Number(order.deliveryFee).toFixed(2)}
                  </span>
                </div>
                <span className="font-bold text-xl text-white">
                  R$ {Number(order.total).toFixed(2)}
                </span>
              </div>

              {!order.isPickup && order.delivery && Number(order.deliveryFee) > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Divisao do pagamento</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-orange-500/10 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-orange-400/70 mb-0.5">Vendedor recebe</p>
                      <p className="text-orange-400 font-semibold">
                        R$ {Number(order.subtotal).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-teal-500/10 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-teal-400/70 mb-0.5">Entregador recebe</p>
                      <p className="text-teal-400 font-semibold">
                        R$ {Number(order.deliveryFee).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {order.delivery && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Entregador</p>
                  <p className="text-gray-300 text-sm">
                    {order.delivery.deliverer?.name} - {order.delivery.deliverer?.phone}
                  </p>
                </div>
              )}

              {order.notes && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Observacoes</p>
                  <p className="text-gray-300 text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Nenhum pedido encontrado</p>
        )}
      </div>
    </div>
  );
}
