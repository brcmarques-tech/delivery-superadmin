"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_ORDERS } from "@/lib/graphql";
import { useState } from "react";
import { gql } from "@apollo/client";

// L2: Locale-formatted currency
const formatBRL = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

// H7: Dispute management queries/mutations
const GET_DISPUTED_ORDERS = gql`
  query DisputedOrders {
    disputedOrders {
      id orderNumber status total subtotal deliveryFee
      disputeReason disputeStatus
      deliveryAddress notes createdAt
      customer { id name email phone }
      store { id name }
      items { id quantity totalPrice product { name price } }
    }
  }
`;

const RESOLVE_DISPUTE = gql`
  mutation ResolveDispute($orderId: String!, $resolution: String!, $notes: String) {
    resolveDispute(orderId: $orderId, resolution: $resolution, notes: $notes) {
      id disputeStatus
    }
  }
`;

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
  // L1: TODO — Replace `any` types with proper Order interface
  const { data, loading } = useQuery(GET_ALL_ORDERS, { pollInterval: 15000 });
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // H5: Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 20;
  // H7: Dispute management
  const [activeTab, setActiveTab] = useState<"orders" | "disputes">("orders");
  const { data: disputeData, loading: disputeLoading, refetch: refetchDisputes } = useQuery(GET_DISPUTED_ORDERS, { skip: activeTab !== "disputes" });
  const [resolveDispute] = useMutation(RESOLVE_DISPUTE);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  // L4: TODO — Add dark mode support

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

  // H7: Dispute resolution handler
  async function handleResolveDispute(orderId: string, resolution: "REFUND_CUSTOMER" | "RELEASE_VENDOR") {
    const label = resolution === "REFUND_CUSTOMER" ? "reembolsar o cliente" : "liberar pagamento ao vendedor";
    if (!confirm(`Confirma ${label} para o pedido?`)) return;
    setDisputeError(null);
    setResolvingId(orderId);
    try {
      await resolveDispute({ variables: { orderId, resolution } });
      refetchDisputes();
    } catch (err: unknown) {
      setDisputeError(err instanceof Error ? err.message : "Erro ao resolver disputa");
    }
    setResolvingId(null);
  }

  const disputedOrders = disputeData?.disputedOrders || [];

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Todos os Pedidos ({orders.length})
      </h1>

      {/* H7: Tab toggle for orders vs disputes */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === "orders" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab("disputes")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === "disputes" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Disputas
        </button>
      </div>

      {/* H7: Disputes tab content */}
      {activeTab === "disputes" && (
        <div className="mb-6">
          {disputeError && (
            <div className="mb-4 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl text-sm flex items-center justify-between">
              <span>{disputeError}</span>
              <button onClick={() => setDisputeError(null)} className="text-red-400 hover:text-red-300 cursor-pointer ml-2">&#10005;</button>
            </div>
          )}
          {disputeLoading ? (
            <p className="text-gray-400">Carregando disputas...</p>
          ) : disputedOrders.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
              <p className="text-gray-400">Nenhuma disputa encontrada</p>
              <p className="text-gray-500 text-sm mt-1">Disputas aparecerão aqui quando clientes contestarem pedidos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedOrders.map((order: any) => (
                <div key={order.id} className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-orange-600/40">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">#{order.orderNumber}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">
                        Disputado
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">Cliente: {order.customer?.name} | Loja: {order.store?.name}</p>
                  <p className="text-gray-400 text-sm mb-3">Motivo: {order.disputeReason || "Nao informado"}</p>
                  <p className="text-white font-bold mb-3">Total: {formatBRL(order.total)}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleResolveDispute(order.id, "REFUND_CUSTOMER")}
                      disabled={resolvingId === order.id}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-600/30 transition cursor-pointer disabled:opacity-50"
                    >
                      A favor do cliente (reembolso)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(order.id, "RELEASE_VENDOR")}
                      disabled={resolvingId === order.id}
                      className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-600/30 transition cursor-pointer disabled:opacity-50"
                    >
                      A favor do vendedor (liberar)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

      {/* H5: Pagination info */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">Mostrando {Math.min(page * pageSize + 1, filtered.length)}-{Math.min((page + 1) * pageSize, filtered.length)} de {filtered.length}</p>
      )}

      <div className="space-y-4">
        {filtered.slice(page * pageSize, (page + 1) * pageSize).map((order: any) => {
          const status = statusLabels[order.status] || {
            label: order.status,
            color: "bg-gray-600 text-gray-300",
          };

          return (
            <div
              key={order.id}
              className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center flex-wrap gap-2">
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
                      {order.paymentMethod === "MP_MARKETPLACE" ? "Split" : order.paymentMethod}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                      {item.quantity}x {item.product?.name || 'Produto removido'}
                    </span>
                    <span className="text-gray-400">
                      {formatBRL(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 border-t border-gray-700 pt-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-400">
                    Subtotal: {formatBRL(order.subtotal)}
                  </span>
                  <span className="text-gray-400">
                    Entrega: {formatBRL(order.deliveryFee)}
                  </span>
                </div>
                <span className="font-bold text-xl text-white">
                  {formatBRL(order.total)}
                </span>
              </div>

              {!order.isPickup && order.delivery && Number(order.deliveryFee) > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Divisao do pagamento</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-orange-500/10 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-orange-400/70 mb-0.5">Vendedor recebe</p>
                      <p className="text-orange-400 font-semibold">
                        {formatBRL(order.subtotal)}
                      </p>
                    </div>
                    <div className="bg-teal-500/10 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-teal-400/70 mb-0.5">Entregador recebe</p>
                      <p className="text-teal-400 font-semibold">
                        {formatBRL(order.deliveryFee)}
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

      {/* H5: Pagination controls */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-400">
            Pagina {page + 1} de {Math.ceil(filtered.length / pageSize)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / pageSize) - 1, p + 1))}
            disabled={page >= Math.ceil(filtered.length / pageSize) - 1}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            Proximo
          </button>
        </div>
      )}
      </>}
    </div>
  );
}
