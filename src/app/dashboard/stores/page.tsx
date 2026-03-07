"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_STORES, TOGGLE_STORE_ACTIVE } from "@/lib/graphql";
import { useState } from "react";

export default function StoresPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_STORES);
  const [toggleActive] = useMutation(TOGGLE_STORE_ACTIVE);
  const [filter, setFilter] = useState("");

  const stores = data?.allStores || [];

  const filtered = stores.filter(
    (s: any) =>
      !filter ||
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.owner?.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.city?.toLowerCase().includes(filter.toLowerCase())
  );

  async function handleToggleActive(storeId: string) {
    await toggleActive({ variables: { id: storeId } });
    refetch();
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Lojas ({stores.length})</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, dono ou cidade..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((store: any) => (
          <div
            key={store.id}
            className={`bg-gray-800 rounded-2xl p-6 border ${
              store.isActive ? "border-gray-700" : "border-red-800/50 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">{store.name}</h2>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    store.isOpen
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {store.isOpen ? "Aberta" : "Fechada"}
                </span>
              </div>
            </div>

            {store.description && (
              <p className="text-gray-400 text-sm mb-3">{store.description}</p>
            )}

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Dono</span>
                <span className="text-gray-300">{store.owner?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-300">{store.owner?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cidade</span>
                <span className="text-gray-300">{store.city} - {store.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefone</span>
                <span className="text-gray-300">{store.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxa entrega</span>
                <span className="text-gray-300">R$ {Number(store.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tempo estimado</span>
                <span className="text-gray-300">{store.estimatedDeliveryMinutes} min</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{store.products?.length || 0}</p>
                <p className="text-xs text-gray-400">Produtos</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{store.categories?.length || 0}</p>
                <p className="text-xs text-gray-400">Categorias</p>
              </div>
            </div>

            <button
              onClick={() => handleToggleActive(store.id)}
              className={`w-full py-2 rounded-xl text-sm font-semibold cursor-pointer transition active:scale-95 ${
                store.isActive
                  ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
              }`}
            >
              {store.isActive ? "Desativar Loja" : "Ativar Loja"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
