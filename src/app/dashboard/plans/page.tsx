"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_VENDOR_USERS,
  GET_AVAILABLE_PLANS,
  UPDATE_VENDOR_PLAN,
  UPDATE_PLAN_CONFIG,
} from "@/lib/graphql";
import { useState, useRef } from "react";

// L2: Locale-formatted currency
const formatBRL = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

const planLabels: Record<string, string> = {
  FREE: "Gratuito",
  PRO: "Pro",
  PREMIUM: "Premium",
  ENTERPRISE: "Enterprise",
  CUSTOM: "Personalizado",
};

const planColors: Record<string, string> = {
  FREE: "bg-gray-600/20 text-gray-300",
  PRO: "bg-blue-600/20 text-blue-400",
  PREMIUM: "bg-purple-600/20 text-purple-400",
  ENTERPRISE: "bg-amber-600/20 text-amber-400",
  CUSTOM: "bg-emerald-600/20 text-emerald-400",
};

const planBorders: Record<string, string> = {
  FREE: "border-gray-700 bg-gray-800",
  PRO: "border-blue-600 bg-blue-900/20",
  PREMIUM: "border-purple-600 bg-purple-900/20",
  ENTERPRISE: "border-amber-600 bg-amber-900/20",
  CUSTOM: "border-emerald-600 bg-emerald-900/20",
};

const supportLabels: Record<string, string> = {
  normal: "Normal",
  priority: "Prioritario",
  dedicated: "Dedicado",
};

const priorityLabels: Record<number, string> = {
  0: "Sem destaque",
  1: "Destaque normal",
  2: "Destaque alto",
  3: "Destaque premium",
};

function FeatureCheck({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {enabled ? (
        <span className="text-green-400 shrink-0">&#10003;</span>
      ) : (
        <span className="text-red-400 shrink-0">&#10007;</span>
      )}
      <span className={enabled ? "text-gray-300" : "text-gray-500"}>{label}</span>
    </li>
  );
}

export default function PlansPage() {
  // L1: TODO — Replace `any` types with proper interfaces (VendorUser, PlanConfig)
  const { data, loading, refetch } = useQuery(GET_ALL_VENDOR_USERS);
  const { data: plansData, refetch: refetchPlans } = useQuery(GET_AVAILABLE_PLANS);
  const [updatePlan] = useMutation(UPDATE_VENDOR_PLAN);
  const [updatePlanConfig] = useMutation(UPDATE_PLAN_CONFIG);
  const [filter, setFilter] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    maxStores: 0,
    monthlyPrice: 0,
    quarterlyPrice: 0,
    semiannualPrice: 0,
    annualPrice: 0,
    quarterlyDiscount: 10,
    semiannualDiscount: 20,
    annualDiscount: 30,
    commissionPercent: 0,
    freePromosPerWeek: 0,
    maxProductsPerStore: 0,
    maxEmailsPerMonth: 0,
    listingPriority: 0,
    highlightDaysPerMonth: 0,
    canUseCoupons: false,
    hasAnalytics: false,
    supportLevel: "normal",
    isContactSales: false,
  });
  const [saving, setSaving] = useState(false);
  // H1: Error state for mutations
  const [error, setError] = useState<string | null>(null);
  // C3: Pending plan change state (confirmation before mutation)
  const [pendingPlanChange, setPendingPlanChange] = useState<{ vendorId: string; vendorName: string; plan: string } | null>(null);
  // L3: Track loading per vendor for plan change dropdown
  const [changingPlanFor, setChangingPlanFor] = useState<string | null>(null);
  // L4: TODO — Add dark mode support via CSS variables or theme toggle

  const vendors =
    data?.allVendorUsers || [];

  const filtered = vendors.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(filter.toLowerCase()) ||
      u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const plans = plansData?.availablePlans || [];

  // C3: Confirm plan change via pending state (don't fire mutation on select onChange)
  async function confirmPlanChange() {
    if (!pendingPlanChange) return;
    setError(null);
    setChangingPlanFor(pendingPlanChange.vendorId);
    try {
      // H8: Audit trail log
      console.log(`[AUDIT ${new Date().toISOString()}] Plan change: vendor=${pendingPlanChange.vendorId}, newPlan=${pendingPlanChange.plan}`);
      // TODO: Implement server-side audit logging for financial config changes
      await updatePlan({ variables: { id: pendingPlanChange.vendorId, plan: pendingPlanChange.plan, durationMonths: 1 } });
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar plano";
      setError(msg);
    }
    setChangingPlanFor(null);
    setPendingPlanChange(null);
  }

  function calcDiscount(monthly: number, total: number, months: number): number {
    if (monthly <= 0) return 0;
    const fullPrice = monthly * months;
    return Math.round((1 - total / fullPrice) * 100);
  }

  function startEdit(p: any) {
    const mp = Number(p.monthlyPrice);
    setEditingPlan(p.plan);
    setEditForm({
      maxStores: p.maxStores,
      monthlyPrice: mp,
      quarterlyPrice: Number(p.quarterlyPrice),
      semiannualPrice: Number(p.semiannualPrice),
      annualPrice: Number(p.annualPrice),
      quarterlyDiscount: calcDiscount(mp, Number(p.quarterlyPrice), 3) || 10,
      semiannualDiscount: calcDiscount(mp, Number(p.semiannualPrice), 6) || 20,
      annualDiscount: calcDiscount(mp, Number(p.annualPrice), 12) || 30,
      commissionPercent: Number(p.commissionPercent),
      freePromosPerWeek: p.freePromosPerWeek ?? 0,
      maxProductsPerStore: p.maxProductsPerStore ?? 0,
      maxEmailsPerMonth: p.maxEmailsPerMonth ?? 0,
      listingPriority: p.listingPriority ?? 0,
      highlightDaysPerMonth: p.highlightDaysPerMonth ?? 0,
      canUseCoupons: p.canUseCoupons ?? false,
      hasAnalytics: p.hasAnalytics ?? false,
      supportLevel: p.supportLevel ?? "normal",
      isContactSales: p.isContactSales ?? false,
    });
  }

  function autoCalcPrices(monthly: number, qd?: number, sd?: number, ad?: number) {
    setEditForm((f) => {
      const q = qd ?? f.quarterlyDiscount;
      const s = sd ?? f.semiannualDiscount;
      const a = ad ?? f.annualDiscount;
      return {
        ...f,
        monthlyPrice: monthly,
        quarterlyDiscount: q,
        semiannualDiscount: s,
        annualDiscount: a,
        quarterlyPrice: Math.round(monthly * 3 * (1 - q / 100) * 100) / 100,
        semiannualPrice: Math.round(monthly * 6 * (1 - s / 100) * 100) / 100,
        annualPrice: Math.round(monthly * 12 * (1 - a / 100) * 100) / 100,
      };
    });
  }

  async function saveEdit() {
    if (!editingPlan) return;

    // H3: Input validation bounds
    if (editForm.commissionPercent < 0 || editForm.commissionPercent > 100) {
      setError("Comissao deve ser entre 0% e 100%.");
      return;
    }
    if (editForm.monthlyPrice < 0) {
      setError("Preco mensal nao pode ser negativo.");
      return;
    }
    if (editForm.quarterlyPrice < 0) {
      setError("Preco trimestral nao pode ser negativo.");
      return;
    }
    if (editForm.semiannualPrice < 0) {
      setError("Preco semestral nao pode ser negativo.");
      return;
    }
    if (editForm.annualPrice < 0) {
      setError("Preco anual nao pode ser negativo.");
      return;
    }
    if (editForm.maxStores < 0) {
      setError("Max lojas nao pode ser negativo.");
      return;
    }
    if (editForm.maxProductsPerStore < 0) {
      setError("Max produtos por loja nao pode ser negativo.");
      return;
    }

    // C2: Confirmation dialog before saving plan config
    // Bug 3.7: o texto antigo ("afetara todos os vendors") prometia o oposto da
    // realidade — no Pagar.me, assinaturas ATIVAS congelam o preco da criacao.
    // Limites/comissao valem ja; preco novo so para novas assinaturas.
    if (!confirm(
      `Salvar alteracoes no plano ${planLabels[editingPlan] || editingPlan}?\n\n` +
      `• Limites, comissao e recursos valem IMEDIATAMENTE para todos os vendedores deste plano.\n` +
      `• Precos novos valem para NOVAS assinaturas. Assinaturas ja ativas continuam sendo cobradas pelo valor antigo ate serem migradas/renovadas.`
    )) return;

    setError(null);
    setSaving(true);
    try {
      // H8: Audit trail log
      console.log(`[AUDIT ${new Date().toISOString()}] Plan config update: plan=${editingPlan}`, editForm);
      // TODO: Implement server-side audit logging for financial config changes
      await updatePlanConfig({
        variables: {
          plan: editingPlan,
          ...editForm,
        },
      });
      setEditingPlan(null);
      refetchPlans();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar configuracao do plano";
      setError(msg);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Planos de Vendedores
      </h1>

      {/* H1: Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 cursor-pointer ml-2">&#10005;</button>
        </div>
      )}

      {/* C3: Plan change confirmation modal */}
      {pendingPlanChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPendingPlanChange(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-3">Confirmar alteracao de plano</h3>
            <p className="text-gray-300 text-sm mb-4">
              Alterar o plano de <span className="font-semibold text-white">{pendingPlanChange.vendorName}</span> para{" "}
              <span className="font-semibold text-purple-400">{planLabels[pendingPlanChange.plan] || pendingPlanChange.plan}</span>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmPlanChange}
                disabled={changingPlanFor !== null}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
              >
                {changingPlanFor ? "Alterando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setPendingPlanChange(null)}
                className="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingPlan(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Editar — {planLabels[editingPlan]}</h3>
              <button onClick={() => setEditingPlan(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition cursor-pointer">
                &#10005;
              </button>
            </div>
            <div className="space-y-3 pb-4">
              <div>
                <label className="text-xs text-gray-400">Preco mensal (R$) — altera os outros automaticamente</label>
                <input type="number" step="0.01" value={editForm.monthlyPrice} onChange={(e) => autoCalcPrices(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Desc. Tri (%)</label>
                  <input type="number" min="0" max="99" value={editForm.quarterlyDiscount} onChange={(e) => autoCalcPrices(editForm.monthlyPrice, parseFloat(e.target.value) || 0, undefined, undefined)} className="w-full mt-1 px-2 py-1.5 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Desc. Sem (%)</label>
                  <input type="number" min="0" max="99" value={editForm.semiannualDiscount} onChange={(e) => autoCalcPrices(editForm.monthlyPrice, undefined, parseFloat(e.target.value) || 0, undefined)} className="w-full mt-1 px-2 py-1.5 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Desc. Anual (%)</label>
                  <input type="number" min="0" max="99" value={editForm.annualDiscount} onChange={(e) => autoCalcPrices(editForm.monthlyPrice, undefined, undefined, parseFloat(e.target.value) || 0)} className="w-full mt-1 px-2 py-1.5 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Tri (R$)</label>
                  <div className="mt-1 px-2 py-1.5 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 text-xs">{editForm.quarterlyPrice.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Sem (R$)</label>
                  <div className="mt-1 px-2 py-1.5 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 text-xs">{editForm.semiannualPrice.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Anual (R$)</label>
                  <div className="mt-1 px-2 py-1.5 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 text-xs">{editForm.annualPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Max lojas</label>
                  <input type="number" value={editForm.maxStores} onChange={(e) => setEditForm({ ...editForm, maxStores: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Comissao (%)</label>
                  <input type="number" step="0.1" min="0" max="100" value={editForm.commissionPercent} onChange={(e) => setEditForm({ ...editForm, commissionPercent: parseFloat(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Promos gratis/semana</label>
                  <input type="number" min="0" value={editForm.freePromosPerWeek} onChange={(e) => setEditForm({ ...editForm, freePromosPerWeek: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Max produtos/loja (0=ilim.)</label>
                  <input type="number" min="0" value={editForm.maxProductsPerStore} onChange={(e) => setEditForm({ ...editForm, maxProductsPerStore: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Max emails/mes (0=ilim.)</label>
                  <input type="number" min="0" value={editForm.maxEmailsPerMonth} onChange={(e) => setEditForm({ ...editForm, maxEmailsPerMonth: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Prioridade listagem (0-3)</label>
                  <input type="number" min="0" max="3" value={editForm.listingPriority} onChange={(e) => setEditForm({ ...editForm, listingPriority: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Dias destaque/mes (0-30)</label>
                  <input type="number" min="0" max="30" value={editForm.highlightDaysPerMonth} onChange={(e) => setEditForm({ ...editForm, highlightDaysPerMonth: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Nivel de suporte</label>
                  <select value={editForm.supportLevel} onChange={(e) => setEditForm({ ...editForm, supportLevel: e.target.value })} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500 cursor-pointer">
                    <option value="normal">Normal</option>
                    <option value="priority">Prioritario</option>
                    <option value="dedicated">Dedicado</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={editForm.canUseCoupons} onChange={(e) => setEditForm({ ...editForm, canUseCoupons: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                  Cupons
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={editForm.hasAnalytics} onChange={(e) => setEditForm({ ...editForm, hasAnalytics: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                  Analytics
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={editForm.isContactSales} onChange={(e) => setEditForm({ ...editForm, isContactSales: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                  Sob consulta
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={saveEdit} disabled={saving} className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50">
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => setEditingPlan(null)} className="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan info cards */}
      <div className="relative mb-8">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-gray-700 border border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:border-purple-500 transition cursor-pointer hidden md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-gray-700 border border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:border-purple-500 transition cursor-pointer hidden md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 md:px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {plans.map((p: any) => (
          <div
            key={p.plan}
            className={`rounded-2xl p-5 border relative min-w-[250px] w-[250px] shrink-0 ${planBorders[p.plan] || "border-gray-700 bg-gray-800"}`}
          >
            <button
              onClick={() => startEdit(p)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition cursor-pointer"
              title="Editar plano"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-white">
              {planLabels[p.plan]}
            </h3>
            {p.isContactSales ? (
              <>
                <p className="text-2xl font-bold text-white mt-2">Sob consulta</p>
                <p className="mt-4 text-sm text-gray-400">Plano configuravel — o vendedor entra em contato para negociar</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-white mt-2">
                  {Number(p.monthlyPrice) === 0
                    ? "Gratis"
                    : `${formatBRL(p.monthlyPrice)}/mes`}
                </p>
                {Number(p.monthlyPrice) > 0 && (
                  <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                    <p>Tri: {formatBRL(p.quarterlyPrice)} <span className="text-green-400">(-{calcDiscount(Number(p.monthlyPrice), Number(p.quarterlyPrice), 3)}%)</span></p>
                    <p>Sem: {formatBRL(p.semiannualPrice)} <span className="text-green-400">(-{calcDiscount(Number(p.monthlyPrice), Number(p.semiannualPrice), 6)}%)</span></p>
                    <p>Anual: {formatBRL(p.annualPrice)} <span className="text-green-400">(-{calcDiscount(Number(p.monthlyPrice), Number(p.annualPrice), 12)}%)</span></p>
                  </div>
                )}
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  <li>Ate {p.maxStores} loja(s)</li>
                  <li>
                    {Number(p.commissionPercent) === 0 ? (
                      <span className="text-green-400">Sem comissao</span>
                    ) : (
                      <span className="text-yellow-400">{Number(p.commissionPercent)}% de comissao</span>
                    )}
                  </li>
                  <li>
                    {p.freePromosPerWeek > 0
                      ? `${p.freePromosPerWeek} promos gratis/semana`
                      : "Sem promos gratis"}
                  </li>
                  <li>
                    {p.maxProductsPerStore === 0
                      ? "Produtos ilimitados"
                      : `Ate ${p.maxProductsPerStore} produtos/loja`}
                  </li>
                  <li>
                    {p.maxEmailsPerMonth === 0
                      ? "Emails ilimitados"
                      : `${p.maxEmailsPerMonth} emails/mes`}
                  </li>
                  <li>
                    {p.highlightDaysPerMonth >= 30
                      ? `${priorityLabels[p.listingPriority]} o mes todo`
                      : p.highlightDaysPerMonth > 0
                      ? `${priorityLabels[p.listingPriority]} ${p.highlightDaysPerMonth} dias/mes`
                      : "Sem destaque"}
                  </li>
                  <li>Suporte: {supportLabels[p.supportLevel] ?? "Normal"}</li>
                </ul>
              </>
            )}
            <ul className="mt-3 space-y-1">
              {p.freePromosPerWeek > 0 && <FeatureCheck enabled={true} label="Promocoes" />}
              {p.canUseCoupons && <FeatureCheck enabled={true} label="Cupons" />}
              {p.hasAnalytics && <FeatureCheck enabled={true} label="Analytics" />}
              {!p.freePromosPerWeek && <FeatureCheck enabled={false} label="Promocoes" />}
              {!p.canUseCoupons && <FeatureCheck enabled={false} label="Cupons" />}
              {!p.hasAnalytics && <FeatureCheck enabled={false} label="Analytics" />}
            </ul>
          </div>
        ))}
        </div>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Buscar vendedor..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full md:w-80 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 mb-6 focus:outline-none focus:border-purple-500"
      />

      {/* Vendors mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Nenhum vendedor encontrado
          </p>
        ) : (
          filtered.map((user: any) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-2xl border border-gray-700 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white text-base leading-tight">
                  {user.name}
                </span>
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${
                    planColors[user.vendorPlan || "FREE"]
                  }`}
                >
                  {planLabels[user.vendorPlan || "FREE"] || "Gratuito"}
                </span>
              </div>

              <p className="text-gray-400 text-sm break-all">{user.email}</p>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>
                  <span className="text-gray-500">Lojas: </span>
                  {user.stores?.length || 0}
                </span>
                <span>
                  <span className="text-gray-500">Expira: </span>
                  {user.planExpiresAt
                    ? new Date(user.planExpiresAt).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>

              <select
                value={user.vendorPlan || "FREE"}
                onChange={(e) => setPendingPlanChange({ vendorId: user.id, vendorName: user.name, plan: e.target.value })}
                disabled={changingPlanFor === user.id}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
              >
                <option value="FREE">Gratuito</option>
                <option value="PRO">Pro</option>
                <option value="PREMIUM">Premium</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="CUSTOM">Personalizado</option>
              </select>
            </div>
          ))
        )}
      </div>

      {/* Vendors table (desktop) */}
      <div className="hidden md:block bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden overflow-x-auto">
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
                    onChange={(e) => setPendingPlanChange({ vendorId: user.id, vendorName: user.name, plan: e.target.value })}
                    disabled={changingPlanFor === user.id}
                    className="bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="FREE">Gratuito</option>
                    <option value="PRO">Pro</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ENTERPRISE">Enterprise</option>
                    <option value="CUSTOM">Personalizado</option>
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
