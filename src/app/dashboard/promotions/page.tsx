"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_PROMOTIONS,
  TOGGLE_PROMOTION_ACTIVE,
  MARK_PROMOTION_PAID,
} from "@/lib/graphql";

export default function PromotionsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_PROMOTIONS);
  const [toggleActive] = useMutation(TOGGLE_PROMOTION_ACTIVE);
  const [markPaid] = useMutation(MARK_PROMOTION_PAID);

  const promotions = data?.allPromotions || [];

  async function handleToggleActive(id: string) {
    await toggleActive({ variables: { id } });
    refetch();
  }

  async function handleMarkPaid(id: string) {
    await markPaid({ variables: { id } });
    refetch();
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Promocoes ({promotions.length})
      </h1>

      {promotions.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">Nenhuma promocao criada ainda</p>
          <p className="text-gray-500 text-sm mt-2">
            Vendedores com plano Pro ou Premium podem criar promocoes pelo painel
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo: any) => {
            const isExpired = new Date(promo.endDate) < new Date();
            const isLive =
              promo.isActive &&
              promo.isPaid &&
              !isExpired &&
              new Date(promo.startDate) <= new Date();

            return (
              <div
                key={promo.id}
                className={`bg-gray-800 rounded-2xl border overflow-hidden ${
                  isLive ? "border-green-600" : "border-gray-700"
                }`}
              >
                {promo.imageUrl && (
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white flex-1">
                      {promo.title}
                    </h3>
                    {isLive && (
                      <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                        AO VIVO
                      </span>
                    )}
                    {isExpired && (
                      <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                        EXPIRADO
                      </span>
                    )}
                  </div>

                  {promo.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {promo.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-300 space-y-1 mb-4">
                    <p>Loja: {promo.store?.name}</p>
                    <p>Vendedor: {promo.store?.owner?.name}</p>
                    <p>Valor: R$ {Number(promo.price).toFixed(2)}</p>
                    <p>
                      Periodo:{" "}
                      {new Date(promo.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(promo.endDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.isPaid
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {promo.isPaid ? "Pago" : "Pendente"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.isActive
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-gray-600/20 text-gray-400"
                      }`}
                    >
                      {promo.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleToggleActive(promo.id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        promo.isActive
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      }`}
                    >
                      {promo.isActive ? "Desativar" : "Ativar"}
                    </button>
                    {!promo.isPaid && (
                      <button
                        onClick={() => handleMarkPaid(promo.id)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition cursor-pointer"
                      >
                        Marcar Pago
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
