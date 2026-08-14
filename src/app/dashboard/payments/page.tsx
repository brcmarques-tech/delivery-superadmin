"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_PAYMENTS } from "@/lib/graphql";
import { useState, useEffect } from "react";
import ErrorState from "@/components/ErrorState";

import { POLL_BACKGROUND, skipPollWhenHidden } from "@/lib/polling"; // KAN-246
// L2: Locale-formatted currency
const formatBRL = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

const typeLabels: Record<string, string> = {
  PLAN_UPGRADE: "Plano",
  PROMOTION: "Promocao",
  DELIVERER_PAYOUT: "Repasse Entregador",
  VENDOR_PAYOUT: "Repasse Vendedor",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
};

export default function PaymentsPage() {
  // L1: TODO — Replace `any` types with proper Payment interface
  const { data, loading, error, refetch } = useQuery(GET_ALL_PAYMENTS, { pollInterval: POLL_BACKGROUND, ...skipPollWhenHidden });
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  // H4: Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // KAN-242: sem isto, estando na pagina 3 e aplicando um filtro que reduz o
  // resultado a poucos itens, `filtered.slice(page*20, ...)` volta vazio e a
  // tela diz "nenhum pagamento" mesmo havendo resultados — confuso numa tela
  // financeira. Qualquer mudanca de filtro volta para a primeira pagina.
  useEffect(() => {
    setPage(0);
  }, [filter, typeFilter, statusFilter]);
  // L4: TODO — Add dark mode support

  const payments = data?.allPayments || [];

  const filtered = payments.filter((p: any) => {
    if (typeFilter !== "ALL" && p.type !== typeFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      (p.vendorUser || p.appUser)?.name?.toLowerCase().includes(q) ||
      (p.vendorUser || p.appUser)?.email?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  // BUGFIX: os cards somavam client-side os (ate) 100 pagamentos da lista e
  // apresentavam como o total da plataforma — com 900 pagamentos, "Receita
  // aprovada" era uma fracao do real, sem aviso. Agora os totais vem do
  // servidor (tabela inteira); a lista continua paginada.
  const summary = data?.paymentsSummary;
  const totalCount = summary?.totalCount ?? payments.length;
  const totalApproved = summary?.approvedAmount ?? 0;
  const totalPending = summary?.pendingAmount ?? 0;
  const listaTruncada = payments.length < totalCount;

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  // Query falhou e nao ha dados em cache: sem isto a tela mostrava
  // "0 pagamentos" e "R$ 0,00 de receita aprovada" — numa tela financeira
  // isso e lido como "o dinheiro sumiu", nao como "a requisicao falhou".
  if (error && !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Pagamentos da Plataforma</h1>
        <ErrorState
          title="Nao foi possivel carregar os pagamentos."
          description="Isto nao significa que nao ha pagamentos — a consulta falhou. Verifique sua conexao e tente novamente."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Pagamentos da Plataforma ({totalCount})</h1>
      <p className="text-sm text-gray-500 mb-6">
        Planos, promocoes e repasses de entregadores — pedidos de lojas sao processados via split direto pelo Pagar.me
        {listaTruncada && (
          <span className="block text-yellow-500/80 mt-1">
            Lista mostrando os {payments.length} mais recentes de {totalCount}. Os cards de totais cobrem todos.
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total pagamentos</p>
          <p className="text-2xl font-bold text-white">{totalCount}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-emerald-800">
          <p className="text-sm text-gray-400">Receita aprovada</p>
          <p className="text-2xl font-bold text-emerald-400">{formatBRL(totalApproved)}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 border border-yellow-800">
          <p className="text-sm text-gray-400">Pendente</p>
          <p className="text-2xl font-bold text-yellow-400">{formatBRL(totalPending)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nome, email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 min-w-0 w-full sm:min-w-[200px] sm:w-auto max-w-md px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="min-w-0 w-full sm:min-w-[200px] sm:w-auto px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">Todos tipos</option>
          <option value="PLAN_UPGRADE">Planos</option>
          <option value="PROMOTION">Promocoes</option>
          <option value="DELIVERER_PAYOUT">Repasse Entregador</option>
          <option value="VENDOR_PAYOUT">Repasse Vendedor</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-w-0 w-full sm:min-w-[200px] sm:w-auto px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">Todos status</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </select>
      </div>

      {/* H4: Pagination info */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">Mostrando {Math.min(page * pageSize + 1, filtered.length)}-{Math.min((page + 1) * pageSize, filtered.length)} de {filtered.length}</p>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.slice(page * pageSize, (page + 1) * pageSize).map((p: any) => (
          <div key={p.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            {/* Top row: date + status */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                {new Date(p.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status] || "bg-gray-600 text-gray-300"}`}>
                {statusLabels[p.status] || p.status}
              </span>
            </div>

            {/* User */}
            <p className="text-white font-bold text-sm mb-0.5">{(p.vendorUser || p.appUser)?.name}</p>
            <p className="text-gray-400 text-xs break-all mb-3">{(p.vendorUser || p.appUser)?.email}</p>

            {/* Type + description */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                p.type === "PLAN_UPGRADE" ? "bg-purple-500/20 text-purple-400" : p.type === "DELIVERER_PAYOUT" ? "bg-cyan-500/20 text-cyan-400" : p.type === "VENDOR_PAYOUT" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
              }`}>
                {typeLabels[p.type] || p.type}
              </span>
              {p.description && (
                <span className="text-gray-300 text-xs truncate">{p.description}</span>
              )}
            </div>

            {/* Amount */}
            <p className={`text-base font-bold ${Number(p.amount) < 0 ? "text-red-400" : "text-emerald-400"}`}>
              {formatBRL(p.amount)}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-8">Nenhum pagamento encontrado</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-3 sm:px-4">Data</th>
              <th className="text-left py-3 px-3 sm:px-4">Usuario</th>
              <th className="text-left py-3 px-3 sm:px-4">Tipo</th>
              <th className="text-left py-3 px-3 sm:px-4">Descricao</th>
              <th className="text-right py-3 px-3 sm:px-4">Valor</th>
              <th className="text-center py-3 px-3 sm:px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(page * pageSize, (page + 1) * pageSize).map((p: any) => (
              <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-3 sm:px-4 text-gray-400 whitespace-nowrap">
                  {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <p className="text-white">{(p.vendorUser || p.appUser)?.name}</p>
                  <p className="text-gray-500 text-xs">{(p.vendorUser || p.appUser)?.email}</p>
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.type === "PLAN_UPGRADE" ? "bg-purple-500/20 text-purple-400" : p.type === "DELIVERER_PAYOUT" ? "bg-cyan-500/20 text-cyan-400" : p.type === "VENDOR_PAYOUT" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {typeLabels[p.type] || p.type}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-gray-300 max-w-[120px] sm:max-w-xs truncate">{p.description}</td>
                <td className="py-3 px-3 sm:px-4 text-right text-white font-semibold">
                  {formatBRL(p.amount)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status] || "bg-gray-600 text-gray-300"}`}>
                    {statusLabels[p.status] || p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-8">Nenhum pagamento encontrado</p>
        )}
      </div>

      {/* H4: Pagination controls */}
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
    </div>
  );
}
