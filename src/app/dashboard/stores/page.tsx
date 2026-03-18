"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_STORES, TOGGLE_STORE_ACTIVE, SET_STORE_VERIFICATION, REQUEST_STORE_DELETE } from "@/lib/graphql";
import { useState } from "react";

const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  NONE: { label: "Sem medalha", color: "text-gray-500", bg: "bg-gray-600/20", emoji: "—" },
  BRONZE: { label: "Bronze", color: "text-amber-500", bg: "bg-amber-500/20", emoji: "🥉" },
  SILVER: { label: "Prata", color: "text-gray-300", bg: "bg-gray-400/20", emoji: "🥈" },
  GOLD: { label: "Ouro", color: "text-yellow-400", bg: "bg-yellow-500/20", emoji: "🥇" },
  DIAMOND: { label: "Diamante", color: "text-cyan-400", bg: "bg-cyan-500/20", emoji: "💎" },
};

const LEVELS = ["NONE", "BRONZE", "SILVER", "GOLD", "DIAMOND"];

export default function StoresPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_STORES);
  const [toggleActive] = useMutation(TOGGLE_STORE_ACTIVE);
  const [setVerification] = useMutation(SET_STORE_VERIFICATION);
  const [requestDelete] = useMutation(REQUEST_STORE_DELETE);
  const [filter, setFilter] = useState("");
  const [editingBadge, setEditingBadge] = useState<string | null>(null);
  const [badgeForm, setBadgeForm] = useState({ level: "NONE", score: 0 });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  function startEditBadge(store: any) {
    setEditingBadge(store.id);
    setBadgeForm({
      level: store.verificationLevel || "NONE",
      score: store.verificationScore || 0,
    });
  }

  async function saveBadge() {
    if (!editingBadge) return;
    await setVerification({
      variables: { storeId: editingBadge, level: badgeForm.level, score: badgeForm.score },
    });
    setEditingBadge(null);
    refetch();
  }

  async function handleRequestDelete() {
    if (!deletingId || !deletePassword) {
      setDeleteError("Digite sua senha para confirmar");
      return;
    }
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await requestDelete({ variables: { storeId: deletingId, password: deletePassword } });
      setDeleteSuccess(true);
    } catch (err: any) {
      setDeleteError(err?.graphQLErrors?.[0]?.message || err?.message || "Erro ao solicitar exclusao");
    }
    setDeleteLoading(false);
  }

  function closeDeleteModal() {
    setDeletingId(null);
    setDeletePassword("");
    setDeleteError("");
    setDeleteSuccess(false);
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Lojas ({stores.length})</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar por nome, dono ou cidade..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-lg px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Badge edit modal */}
      {editingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingBadge(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Editar Medalha</h3>
              <button onClick={() => setEditingBadge(null)} className="text-gray-400 hover:text-white cursor-pointer">&#10005;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Nivel</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {LEVELS.map((lvl) => {
                    const b = BADGE_CONFIG[lvl];
                    return (
                      <button
                        key={lvl}
                        onClick={() => setBadgeForm({ ...badgeForm, level: lvl })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          badgeForm.level === lvl
                            ? `${b.bg} ${b.color} ring-2 ring-current`
                            : "bg-gray-700/50 text-gray-500 hover:bg-gray-700"
                        }`}
                      >
                        <span className="text-lg">{b.emoji}</span>
                        <span>{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Pontuacao</label>
                <input
                  type="number"
                  min="0"
                  value={badgeForm.score}
                  onChange={(e) => setBadgeForm({ ...badgeForm, score: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveBadge}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingBadge(null)}
                  className="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeDeleteModal}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-sm mx-4 max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {deleteSuccess ? (
              <>
                <h3 className="text-lg font-bold text-green-400 mb-2">Email enviado!</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Um email de confirmacao foi enviado. Clique no link do email para concluir a exclusao da loja.
                </p>
                <p className="text-xs text-gray-500 mb-6">O link expira em 30 minutos.</p>
                <button
                  onClick={closeDeleteModal}
                  className="w-full px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer"
                >
                  Fechar
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white mb-2">Excluir loja?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Esta acao e irreversivel. Digite sua senha para confirmar. Um email de confirmacao sera enviado.
                </p>
                {deleteError && (
                  <div className="mb-4 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
                    {deleteError}
                  </div>
                )}
                <input
                  type="password"
                  placeholder="Sua senha..."
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRequestDelete()}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestDelete}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
                  >
                    {deleteLoading ? "Verificando..." : "Confirmar exclusao"}
                  </button>
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((store: any) => {
          const badge = BADGE_CONFIG[store.verificationLevel] || BADGE_CONFIG.NONE;
          return (
            <div
              key={store.id}
              className={`bg-gray-800 rounded-2xl p-4 sm:p-6 border ${
                store.isActive ? "border-gray-700" : "border-red-800/50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{store.name}</h2>
                  {store.verificationLevel && store.verificationLevel !== "NONE" && (
                    <span className="text-lg" title={badge.label}>{badge.emoji}</span>
                  )}
                </div>
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
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">Dono</span>
                  <span className="text-gray-300 text-right">{store.owner?.name}</span>
                </div>
                <div className="flex justify-between gap-2 flex-wrap">
                  <span className="text-gray-500 shrink-0">Email</span>
                  <span className="text-gray-300 text-right break-all">{store.owner?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cidade</span>
                  <span className="text-gray-300">{store.city} - {store.state}</span>
                </div>
                {store.street && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Endereco</span>
                    <span className="text-gray-300 text-right max-w-[150px] sm:max-w-[200px]">{store.street}, {store.number} - {store.neighborhood}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Telefone</span>
                  <span className="text-gray-300">{store.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entrega</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    store.hasOwnDelivery ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {store.hasOwnDelivery ? "Propria" : "App"}
                  </span>
                </div>
                {store.freeDelivery ? (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxa entrega</span>
                    <span className="text-emerald-400 font-semibold">Gratis</span>
                  </div>
                ) : (
                  <>
                    {store.freeDeliveryAbove && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gratis acima de</span>
                        <span className="text-gray-300">R$ {Number(store.freeDeliveryAbove).toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                {store.hasOwnDelivery ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tempo estimado</span>
                      <span className="text-gray-300">{store.estimatedDeliveryMinutes} min</span>
                    </div>
                    {Number(store.minimumOrder) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pedido minimo</span>
                        <span className="text-gray-300">R$ {Number(store.minimumOrder).toFixed(2)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">Tempo estimado</span>
                    <span className="text-gray-400 text-xs text-right">Calculado por distancia</span>
                  </div>
                )}
                {store.deliveryStartTime && store.deliveryEndTime && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">Horario entregas</span>
                    <span className="text-gray-300 text-right">{store.deliveryStartTime} - {store.deliveryEndTime}</span>
                  </div>
                )}
              </div>

              {/* Stats + Badge */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{store.products?.length || 0}</p>
                  <p className="text-xs text-gray-400">Produtos</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{store.totalSales || 0}</p>
                  <p className="text-xs text-gray-400">Vendas</p>
                </div>
                <button
                  onClick={() => startEditBadge(store)}
                  className={`${badge.bg} rounded-xl p-3 text-center cursor-pointer transition hover:ring-2 hover:ring-purple-500`}
                  title="Clique para editar medalha"
                >
                  <p className="text-xl">{badge.emoji}</p>
                  <p className={`text-xs font-semibold ${badge.color}`}>{badge.label}</p>
                  <p className="text-[10px] text-gray-500">{store.verificationScore || 0} pts</p>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(store.id)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer transition active:scale-95 ${
                    store.isActive
                      ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                      : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                  }`}
                >
                  {store.isActive ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => setDeletingId(store.id)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition active:scale-95 bg-red-600/20 text-red-400 hover:bg-red-600/40"
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
