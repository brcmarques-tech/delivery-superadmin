"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_DELIVERIES,
  GET_DELIVERY_PRICES,
  SET_DELIVERY_PRICE_PER_KM,
  SET_DELIVERY_BASE_PRICE,
  SET_DELIVERY_COMMISSION,
  SET_MINIMUM_ORDER_PLATFORM,
} from "@/lib/graphql";
import { useState, useEffect } from "react";

export default function DeliveriesPage() {
  const { data, loading } = useQuery(GET_ALL_DELIVERIES, { pollInterval: 15000 });
  const { data: deliveryData, refetch: refetchDelivery } = useQuery(GET_DELIVERY_PRICES);
  const [setDeliveryPerKm, { loading: savingKm }] = useMutation(SET_DELIVERY_PRICE_PER_KM);
  const [setDeliveryBase, { loading: savingBase }] = useMutation(SET_DELIVERY_BASE_PRICE);
  const [setDeliveryCommission, { loading: savingCommission }] = useMutation(SET_DELIVERY_COMMISSION);
  const [setMinOrder, { loading: savingMinOrder }] = useMutation(SET_MINIMUM_ORDER_PLATFORM);

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const currentPerKm = deliveryData?.deliveryPricePerKm ?? 1.5;
  const currentBase = deliveryData?.deliveryBasePrice ?? 3;
  const currentCommission = deliveryData?.deliveryCommissionPercent ?? 1;
  const currentMinOrder = deliveryData?.minimumOrderPlatform ?? 10;
  const [perKmInput, setPerKmInput] = useState("");
  const [baseInput, setBaseInput] = useState("");
  const [commissionInput, setCommissionInput] = useState("");
  const [minOrderInput, setMinOrderInput] = useState("");

  useEffect(() => {
    if (deliveryData?.deliveryPricePerKm != null) setPerKmInput(String(deliveryData.deliveryPricePerKm));
    if (deliveryData?.deliveryBasePrice != null) setBaseInput(String(deliveryData.deliveryBasePrice));
    if (deliveryData?.deliveryCommissionPercent != null) setCommissionInput(String(deliveryData.deliveryCommissionPercent));
    if (deliveryData?.minimumOrderPlatform != null) setMinOrderInput(String(deliveryData.minimumOrderPlatform));
  }, [deliveryData]);

  async function handleSaveDeliveryPerKm() {
    const val = parseFloat(perKmInput);
    if (isNaN(val) || val < 0) return;
    await setDeliveryPerKm({ variables: { price: val } });
    refetchDelivery();
  }

  async function handleSaveDeliveryBase() {
    const val = parseFloat(baseInput);
    if (isNaN(val) || val < 0) return;
    await setDeliveryBase({ variables: { price: val } });
    refetchDelivery();
  }

  async function handleSaveCommission() {
    const val = parseFloat(commissionInput);
    if (isNaN(val) || val < 0 || val > 100) return;
    await setDeliveryCommission({ variables: { percent: val } });
    refetchDelivery();
  }

  async function handleSaveMinOrder() {
    const val = parseFloat(minOrderInput);
    if (isNaN(val) || val < 0) return;
    await setMinOrder({ variables: { price: val } });
    refetchDelivery();
  }

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

      {/* Configurações de entrega */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Configurações de entrega</h2>

        {/* Taxa de entrega */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Taxa de entrega (por distância)</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm">Base:</label>
              <span className="text-gray-400">R$</span>
              <input type="number" step="0.01" min="0" value={baseInput} onChange={(e) => setBaseInput(e.target.value)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              <button onClick={handleSaveDeliveryBase} disabled={savingBase || parseFloat(baseInput) === currentBase}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50">
                {savingBase ? "..." : "Salvar"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm">Por km:</label>
              <span className="text-gray-400">R$</span>
              <input type="number" step="0.01" min="0" value={perKmInput} onChange={(e) => setPerKmInput(e.target.value)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              <button onClick={handleSaveDeliveryPerKm} disabled={savingKm || parseFloat(perKmInput) === currentPerKm}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50">
                {savingKm ? "..." : "Salvar"}
              </button>
            </div>
            <span className="text-gray-500 text-xs">Ex: 5km = R$ {(currentBase + 5 * currentPerKm).toFixed(2)}</span>
          </div>
        </div>

        {/* Comissão */}
        <div className="mb-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Comissão da plataforma sobre entregas</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm">Percentual:</label>
              <input type="number" step="0.1" min="0" max="100" value={commissionInput} onChange={(e) => setCommissionInput(e.target.value)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              <span className="text-gray-400">%</span>
              <button onClick={handleSaveCommission} disabled={savingCommission || parseFloat(commissionInput) === currentCommission}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50">
                {savingCommission ? "..." : "Salvar"}
              </button>
            </div>
            <span className="text-gray-500 text-xs">Atual: {currentCommission}% — Ex: entrega R$ 10,00 = R$ {(10 * currentCommission / 100).toFixed(2)} p/ plataforma</span>
          </div>
        </div>

        {/* Pedido mínimo plataforma */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Pedido mínimo (entregadores do app)</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm">Valor mínimo:</label>
              <span className="text-gray-400">R$</span>
              <input type="number" step="0.01" min="0" value={minOrderInput} onChange={(e) => setMinOrderInput(e.target.value)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              <button onClick={handleSaveMinOrder} disabled={savingMinOrder || parseFloat(minOrderInput) === currentMinOrder}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50">
                {savingMinOrder ? "..." : "Salvar"}
              </button>
            </div>
            <span className="text-gray-500 text-xs">Atual: R$ {currentMinOrder.toFixed(2)} — Lojas com entregadores do app não aceitam pedidos abaixo deste valor</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
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
            <div key={d.id} className="bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                <span>Taxa: R$ {Number(d.order?.deliveryFee || 0).toFixed(2)}</span>
                <span>Total pedido: R$ {Number(d.order?.total || 0).toFixed(2)}</span>
                {d.pickedUpAt && <span>Coletado: {new Date(d.pickedUpAt).toLocaleString("pt-BR")}</span>}
                {d.deliveredAt && <span>Entregue: {new Date(d.deliveredAt).toLocaleString("pt-BR")}</span>}
              </div>

              {/* Payout info for completed deliveries with app deliverers */}
              {d.deliveredAt && !d.order?.store?.hasOwnDelivery && (
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
                <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
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
