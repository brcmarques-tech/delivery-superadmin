"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_USERS,
  GET_AVAILABLE_PLANS,
  UPDATE_VENDOR_PLAN,
} from "@/lib/graphql";
import { useState } from "react";

const planLabels: Record<string, string> = {
  FREE: "Gratuito",
  PRO: "Pro",
  PREMIUM: "Premium",
};

const planColors: Record<string, string> = {
  FREE: "bg-gray-600/20 text-gray-300",
  PRO: "bg-blue-600/20 text-blue-400",
  PREMIUM: "bg-purple-600/20 text-purple-400",
};

export default function PlansPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_USERS);
  const { data: plansData } = useQuery(GET_AVAILABLE_PLANS);
  const [updatePlan] = useMutation(UPDATE_VENDOR_PLAN);
  const [filter, setFilter] = useState("");

  const vendors =
    data?.allUsers?.filter(
      (u: any) => u.role === "VENDOR"
    ) || [];

  const filtered = vendors.filter(
    (u: any) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())
  );

  const plans = plansData?.availablePlans || [];

  async function handlePlanChange(userId: string, plan: string) {
    await updatePlan({ variables: { id: userId, plan, durationMonths: 1 } });
    refetch();
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Planos de Vendedores
      </h1>

      {/* Plan info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map((p: any) => (
          <div
            key={p.plan}
            className={`rounded-2xl p-6 border ${
              p.plan === "PREMIUM"
                ? "border-purple-600 bg-purple-900/20"
                : p.plan === "PRO"
                ? "border-blue-600 bg-blue-900/20"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <h3 className="text-lg font-bold text-white">
              {planLabels[p.plan]}
            </h3>
            <p className="text-2xl font-bold text-white mt-2">
              {p.monthlyPrice === 0
                ? "Gratis"
                : `R$ ${Number(p.monthlyPrice).toFixed(2)}/mes`}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>Ate {p.maxStores} loja(s)</li>
              <li>Sem comissao por pedido</li>
              <li>
                Promocoes:{" "}
                {p.canPromote ? (
                  <span className="text-green-400">Sim</span>
                ) : (
                  <span className="text-red-400">Nao</span>
                )}
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Buscar vendedor..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full md:w-80 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 mb-6 focus:outline-none focus:border-purple-500"
      />

      {/* Vendors table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Nome</th>
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Email</th>
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Lojas</th>
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Plano Atual</th>
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Expira em</th>
              <th className="px-3 sm:px-6 py-4 text-sm text-gray-400">Alterar Plano</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user: any) => (
              <tr
                key={user.id}
                className="border-b border-gray-700/50 hover:bg-gray-700/30"
              >
                <td className="px-3 sm:px-6 py-4 text-white">{user.name}</td>
                <td className="px-3 sm:px-6 py-4 text-gray-300">{user.email}</td>
                <td className="px-3 sm:px-6 py-4 text-gray-300">
                  {user.stores?.length || 0}
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      planColors[user.vendorPlan || "FREE"]
                    }`}
                  >
                    {planLabels[user.vendorPlan || "FREE"] || "Gratuito"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 text-gray-300 text-sm">
                  {user.planExpiresAt
                    ? new Date(user.planExpiresAt).toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <select
                    value={user.vendorPlan || "FREE"}
                    onChange={(e) => handlePlanChange(user.id, e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="FREE">Gratuito</option>
                    <option value="PRO">Pro</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            Nenhum vendedor encontrado
          </p>
        )}
      </div>
    </div>
  );
}
