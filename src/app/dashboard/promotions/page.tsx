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

export default function PromotionsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_PROMOTIONS);
  const { data: priceData, refetch: refetchPrice } = useQuery(GET_PROMO_PRICE_PER_DAY);
  const [toggleActive] = useMutation(TOGGLE_PROMOTION_ACTIVE);
  const [markPaid] = useMutation(MARK_PROMOTION_PAID);
  const [setPromoPrice, { loading: savingPrice }] = useMutation(SET_PROMO_PRICE_PER_DAY);

  const promotions = data?.allPromotions || [];
  const currentPrice = priceData?.promoPricePerDay ?? 1;
  const [priceInput, setPriceInput] = useState("");

  useEffect(() => {
    if (priceData?.promoPricePerDay != null) {
      setPriceInput(String(priceData.promoPricePerDay));
    }
  }, [priceData]);

  async function handleToggleActive(id: string) {
    await toggleActive({ variables: { id } });
    refetch();
  }

  async function handleMarkPaid(id: string) {
    if (!confirm("Marcar como pago? A promoção ficará visível no app.")) return;
    await markPaid({ variables: { id } });
    refetch();
  }

  async function handleSavePrice() {
    const val = parseFloat(priceInput);
    if (isNaN(val) || val < 0) return;
    await setPromoPrice({ variables: { price: val } });
    refetchPrice();
  }

  const pending = promotions.filter((p: any) => !p.isPaid);
  const active = promotions.filter((p: any) => p.isPaid);

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Promoções ({promotions.length})</h1>
      </div>

      {/* Config de preço por dia */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Configuração de preço</h2>
        <div className="flex items-center gap-3">
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
          <span className="text-gray-500 text-xs">Atual: R$ {currentPrice.toFixed(2)}/dia</span>
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
                <div key={promo.id} className="bg-gray-800 rounded-2xl border border-yellow-600/40 p-4 flex items-center gap-4">
                  {imgUrl ? (
                    <img src={imgUrl} alt={promo.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-gray-500 text-xl flex-shrink-0">📢</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{promo.title}</h3>
                    {promo.product && (
                      <p className="text-sm text-gray-400">
                        {promo.product.name}: <span className="line-through">R$ {Number(promo.product.price).toFixed(2)}</span>{" "}
                        <span className="text-green-400 font-semibold">R$ {Number(promo.promotionalPrice).toFixed(2)}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{promo.store?.name}</span>
                      <span>{promo.store?.owner?.name}</span>
                      <span>{new Date(promo.startDate).toLocaleDateString("pt-BR")} - {new Date(promo.endDate).toLocaleDateString("pt-BR")}</span>
                      <span className="text-yellow-400">Anúncio: R$ {Number(promo.adCost).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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
        <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
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
              <div key={promo.id} className={`bg-gray-800 rounded-2xl border p-4 flex items-center gap-4 ${isLive ? "border-green-600/40" : "border-gray-700"}`}>
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
                      {promo.product.name}: <span className="line-through">R$ {Number(promo.product.price).toFixed(2)}</span>{" "}
                      <span className="text-green-400 font-semibold">R$ {Number(promo.promotionalPrice).toFixed(2)}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{promo.store?.name}</span>
                    <span>{promo.store?.owner?.name}</span>
                    <span>{new Date(promo.startDate).toLocaleDateString("pt-BR")} - {new Date(promo.endDate).toLocaleDateString("pt-BR")}</span>
                    <span>Anúncio: R$ {Number(promo.adCost).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(promo.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex-shrink-0 ${
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
