"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_PROMOTIONS,
  TOGGLE_PROMOTION_ACTIVE,
  MARK_PROMOTION_PAID,
  GET_PROMO_PRICE_PER_DAY,
  SET_PROMO_PRICE_PER_DAY,
} from "@/lib/graphql";
import { useState, useEffect } from "react";

// L2: Locale-formatted currency
const formatBRL = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

export default function PromotionsPage() {
  // L1: TODO — Replace `any` types with proper Promotion interface
  const { data, loading, refetch } = useQuery(GET_ALL_PROMOTIONS);
  const { data: priceData, refetch: refetchPrice } = useQuery(GET_PROMO_PRICE_PER_DAY);
  const [toggleActive] = useMutation(TOGGLE_PROMOTION_ACTIVE);
  const [markPaid] = useMutation(MARK_PROMOTION_PAID);
  const [setPromoPrice, { loading: savingPrice }] = useMutation(SET_PROMO_PRICE_PER_DAY);

  const promotions = data?.allPromotions || [];
  const currentPrice = priceData?.promoPricePerDay ?? 1;
  const [priceInput, setPriceInput] = useState("");
  // H1: Error state
  const [error, setError] = useState<string | null>(null);
  // L4: TODO — Add dark mode support

  useEffect(() => {
    if (priceData?.promoPricePerDay != null) {
      setPriceInput(String(priceData.promoPricePerDay));
    }
  }, [priceData]);

  async function handleToggleActive(id: string) {
    setError(null);
    try {
      await toggleActive({ variables: { id } });
      refetch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status da promocao");
    }
  }

  async function handleMarkPaid(id: string) {
    // M4: Payment verification — ask for payment reference/proof
    const reference = prompt("Informe o comprovante ou referencia do pagamento:");
    if (reference === null) return; // user cancelled
    if (!reference.trim()) {
      setError("E necessario informar uma referencia de pagamento.");
      return;
    }
    if (!confirm("Marcar como pago? A promocao ficara visivel no app.")) return;
    setError(null);
    try {
      // M4: Log payment reference client-side (API doesn't support reference field yet)
      console.log(`[AUDIT ${new Date().toISOString()}] Promotion payment marked: id=${id}, reference=${reference.trim()}`);
      // TODO: Pass payment reference to API when supported
      await markPaid({ variables: { id } });
      refetch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao marcar como pago");
    }
  }

  async function handleSavePrice() {
    const val = parseFloat(priceInput);
    if (isNaN(val) || val < 0) return;
    // M5: Confirmation on promo price change
    if (!confirm("Alterar preco de promocao por dia?")) return;
    setError(null);
    try {
      // H8: Audit trail
      console.log(`[AUDIT ${new Date().toISOString()}] Promo price per day changed: ${currentPrice} -> ${val}`);
      await setPromoPrice({ variables: { price: val } });
      refetchPrice();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar preco");
    }
  }

  const pending = promotions.filter((p: any) => !p.isPaid);
  const active = promotions.filter((p: any) => p.isPaid);

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Promoções ({promotions.length})</h1>
      </div>

      {/* H1: Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 cursor-pointer ml-2">&#10005;</button>
        </div>
      )}

      {/* Config de preço por dia */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Configuração de preço</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-gray-300 text-sm">Preço por dia de anúncio:</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">R$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSavePrice}
              disabled={savingPrice || parseFloat(priceInput) === currentPrice}
              className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
            >
              {savingPrice ? "..." : "Salvar"}
            </button>
          </div>
          <span className="text-gray-500 text-xs">Atual: {formatBRL(currentPrice)}/dia</span>
        </div>
      </div>

      {/* Promoções pendentes */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-yellow-400 mb-4">Aguardando pagamento ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((promo: any) => {
              const imgUrl = promo.product?.imageUrl || promo.imageUrl;
              return (
                <div key={promo.id} className="bg-gray-800 rounded-2xl border border-yellow-600/40 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  {imgUrl ? (
                    <img src={imgUrl} alt={promo.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-gray-500 text-xl flex-shrink-0">📢</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{promo.title}</h3>
                    {promo.product && (
                      <p className="text-sm text-gray-400">
                        {promo.product.name}: <span className="line-through">{formatBRL(promo.product.price)}</span>{" "}
                        <span className="text-green-400 font-semibold">{formatBRL(promo.promotionalPrice)}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{promo.store?.name}</span>
                      <span>{promo.store?.owner?.name}</span>
                      <span>{new Date(promo.startDate).toLocaleDateString("pt-BR")} - {new Date(promo.endDate).toLocaleDateString("pt-BR")}</span>
                      <span className="text-yellow-400">Anúncio: {formatBRL(promo.adCost)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:flex-shrink-0">
                    <button
                      onClick={() => handleMarkPaid(promo.id)}
                      className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-600/30 transition cursor-pointer"
                    >
                      ✓ Aprovar / Marcar Pago
                    </button>
                    <button
                      onClick={() => handleToggleActive(promo.id)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-600/30 transition cursor-pointer"
                    >
                      Desativar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Todas as promoções */}
      <h2 className="text-lg font-bold text-white mb-4">
        {pending.length > 0 ? "Promoções aprovadas" : "Todas as promoções"} ({active.length})
      </h2>

      {active.length === 0 && pending.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-6 sm:p-12 border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">Nenhuma promoção criada ainda</p>
          <p className="text-gray-500 text-sm mt-2">Vendedores com plano Pro ou Premium podem criar promoções pelo painel</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((promo: any) => {
            const isExpired = new Date(promo.endDate) < new Date();
            const isLive = promo.isActive && promo.isPaid && !isExpired && new Date(promo.startDate) <= new Date();
            const imgUrl = promo.product?.imageUrl || promo.imageUrl;

            return (
              <div key={promo.id} className={`bg-gray-800 rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${isLive ? "border-green-600/40" : "border-gray-700"}`}>
                {imgUrl ? (
                  <img src={imgUrl} alt={promo.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-gray-500 text-xl flex-shrink-0">📢</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{promo.title}</h3>
                    {isLive && <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">AO VIVO</span>}
                    {isExpired && <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-semibold">EXPIRADO</span>}
                    {!promo.isActive && <span className="bg-gray-600/20 text-gray-400 px-2 py-0.5 rounded-full text-xs font-semibold">INATIVO</span>}
                  </div>
                  {promo.product && (
                    <p className="text-sm text-gray-400">
                      {promo.product.name}: <span className="line-through">{formatBRL(promo.product.price)}</span>{" "}
                      <span className="text-green-400 font-semibold">{formatBRL(promo.promotionalPrice)}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{promo.store?.name}</span>
                    <span>{promo.store?.owner?.name}</span>
                    <span>{new Date(promo.startDate).toLocaleDateString("pt-BR")} - {new Date(promo.endDate).toLocaleDateString("pt-BR")}</span>
                    <span>Anúncio: {formatBRL(promo.adCost)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(promo.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition cursor-pointer w-full sm:w-auto sm:flex-shrink-0 ${
                    promo.isActive
                      ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                      : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                  }`}
                >
                  {promo.isActive ? "Desativar" : "Ativar"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
