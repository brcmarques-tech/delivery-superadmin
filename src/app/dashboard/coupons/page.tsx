"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { POLL_BACKGROUND, skipPollWhenHidden } from "@/lib/polling"; // KAN-246
import {
  GET_ALL_COUPONS,
  ADMIN_TOGGLE_COUPON,
  ADMIN_DELETE_COUPON,
} from "@/lib/graphql";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minimumOrder: number | null;
  maxDiscount: number | null;
  maxUses: number;
  usesCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  store: { id: string; name: string; owner: { id: string; name: string } };
}

export default function CouponsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_COUPONS, { pollInterval: POLL_BACKGROUND, ...skipPollWhenHidden });
  const [toggleCoupon] = useMutation(ADMIN_TOGGLE_COUPON);
  const [deleteCoupon] = useMutation(ADMIN_DELETE_COUPON);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  // Erro visível + guard de in-flight: antes toggle/delete faziam await sem
  // try/catch nem estado de carregando — falha silenciosa (o admin achava que
  // deu certo) e cliques repetidos disparavam mutations duplicadas.
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const coupons: Coupon[] = data?.allCoupons || [];

  const filtered = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.store?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.store?.owner?.name?.toLowerCase().includes(search.toLowerCase());

    const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
    const maxedOut = c.maxUses > 0 && c.usesCount >= c.maxUses;

    if (filterStatus === "ACTIVE") return matchSearch && c.isActive && !expired && !maxedOut;
    if (filterStatus === "INACTIVE") return matchSearch && !c.isActive;
    if (filterStatus === "EXPIRED") return matchSearch && expired;
    if (filterStatus === "MAXED") return matchSearch && maxedOut;
    return matchSearch;
  });

  // Stats
  const totalActive = coupons.filter((c) => c.isActive && !(c.expiresAt && new Date(c.expiresAt) < new Date())).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usesCount, 0);
  const totalCoupons = coupons.length;

  async function handleToggle(id: string) {
    if (busyId) return;
    setBusyId(id);
    setActionError(null);
    try {
      await toggleCoupon({ variables: { id } });
      await refetch();
    } catch (e: any) {
      setActionError(e?.message || "Nao foi possivel alterar o cupom.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (busyId) return;
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    setBusyId(id);
    setActionError(null);
    try {
      await deleteCoupon({ variables: { id } });
      await refetch();
    } catch (e: any) {
      setActionError(e?.message || "Nao foi possivel excluir o cupom.");
    } finally {
      setBusyId(null);
    }
  }

  function getStatus(c: Coupon): { label: string; color: string } {
    const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
    const maxedOut = c.maxUses > 0 && c.usesCount >= c.maxUses;
    if (!c.isActive) return { label: "Desativado", color: "bg-gray-500/20 text-gray-400" };
    if (expired) return { label: "Expirado", color: "bg-red-500/20 text-red-400" };
    if (maxedOut) return { label: "Esgotado", color: "bg-yellow-500/20 text-yellow-400" };
    return { label: "Ativo", color: "bg-green-500/20 text-green-400" };
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Cupons</h1>

      {actionError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-200 cursor-pointer">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total de Cupons</p>
          <p className="text-2xl font-bold text-white">{totalCoupons}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Cupons Ativos</p>
          <p className="text-2xl font-bold text-green-400">{totalActive}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total de Usos</p>
          <p className="text-2xl font-bold text-purple-400">{totalUses}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por codigo, loja ou vendedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="ALL">Todos</option>
          <option value="ACTIVE">Ativos</option>
          <option value="INACTIVE">Desativados</option>
          <option value="EXPIRED">Expirados</option>
          <option value="MAXED">Esgotados</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-10 border border-gray-700 text-center">
          <p className="text-gray-400">Nenhum cupom encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const status = getStatus(c);
            return (
              <div
                key={c.id}
                className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="font-mono text-lg font-bold text-white bg-gray-700 px-3 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Desconto</p>
                        <p className="text-white">
                          {c.discountType === "PERCENT"
                            ? `${c.discountValue}%`
                            : `R$ ${Number(c.discountValue).toFixed(2)}`}
                          {c.maxDiscount && c.discountType === "PERCENT"
                            ? ` (max R$ ${Number(c.maxDiscount).toFixed(2)})`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Pedido Minimo</p>
                        <p className="text-white">
                          {c.minimumOrder ? `R$ ${Number(c.minimumOrder).toFixed(2)}` : "Sem minimo"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Usos</p>
                        <p className="text-white">
                          {c.maxUses > 0 ? `${c.usesCount}/${c.maxUses}` : `${c.usesCount} (ilimitado)`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Loja</p>
                        <p className="text-orange-400">{c.store.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Vendedor</p>
                        <p className="text-teal-400">{c.store.owner.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Expira</p>
                        <p className="text-white">
                          {c.expiresAt
                            ? new Date(c.expiresAt).toLocaleDateString("pt-BR")
                            : "Sem expiracao"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mt-2">
                      Criado em {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(c.id)}
                      disabled={busyId === c.id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                        c.isActive
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      }`}
                    >
                      {c.isActive ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={busyId === c.id}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Excluir
                    </button>
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
