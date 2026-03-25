"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_BADGE_CONFIG,
  UPDATE_BADGE_THRESHOLDS,
  UPDATE_BADGE_POINTS,
  UPDATE_BADGE_REWARDS,
  GET_ALL_STORES,
  SET_STORE_VERIFICATION,
} from "@/lib/graphql";
import { useState, useEffect } from "react";

const LEVELS = ["BRONZE", "SILVER", "GOLD", "DIAMOND"] as const;

const BADGE_UI: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  NONE:    { emoji: "—",  label: "Sem selo",  color: "text-gray-500",   bg: "bg-gray-600/20" },
  BRONZE:  { emoji: "🥉", label: "Bronze",    color: "text-amber-500",  bg: "bg-amber-500/20" },
  SILVER:  { emoji: "🥈", label: "Prata",     color: "text-gray-300",   bg: "bg-gray-400/20" },
  GOLD:    { emoji: "🥇", label: "Ouro",      color: "text-yellow-400", bg: "bg-yellow-500/20" },
  DIAMOND: { emoji: "💎", label: "Diamante",  color: "text-cyan-400",   bg: "bg-cyan-500/20" },
};

const REWARD_LABELS: Record<string, { label: string; suffix: string; description: string; type: string }> = {
  freePromoDays:        { label: "Dias de promocao gratis", suffix: "dias",   description: "Dias de promocao gratuita creditados",          type: "Sempre" },
  commissionReduction:  { label: "Reducao de comissao",     suffix: "% (1 sem)", description: "Reducao percentual na comissao por 1 semana",  type: "Sempre" },
  freeTrialDays:        { label: "Trial gratis",            suffix: "dias",   description: "Dias de plano gratis (so na 1a conquista)",      type: "1a vez" },
  subscriptionDiscount: { label: "Desconto na assinatura",  suffix: "%",      description: "Desconto no plano (da 2a conquista em diante)",  type: "Da 2a+" },
  couponValue:          { label: "Cupom de desconto",       suffix: "%",      description: "Cupom criado automaticamente (da 2a em diante)", type: "Da 2a+" },
};

export default function BadgesPage() {
  const { data, loading, refetch } = useQuery(GET_BADGE_CONFIG);
  const { data: storesData, refetch: refetchStores } = useQuery(GET_ALL_STORES);
  const [updateThresholds] = useMutation(UPDATE_BADGE_THRESHOLDS);
  const [updatePoints] = useMutation(UPDATE_BADGE_POINTS);
  const [updateRewards] = useMutation(UPDATE_BADGE_REWARDS);
  const [setVerification] = useMutation(SET_STORE_VERIFICATION);

  const [thresholds, setThresholds] = useState({ BRONZE: 20, SILVER: 100, GOLD: 300, DIAMOND: 1000 });
  const [points, setPoints] = useState({ PER_PRODUCT: 2, PER_SALE: 5, PER_MONTH_ACTIVE: 3 });
  const [rewards, setRewards] = useState<Record<string, Record<string, number>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  // Prize modal
  const [prizeModal, setPrizeModal] = useState<any>(null);
  const [prizeForm, setPrizeForm] = useState({ level: "BRONZE", score: 0 });

  useEffect(() => {
    if (data?.badgeConfig) {
      try {
        const config = JSON.parse(data.badgeConfig);
        setThresholds(config.thresholds);
        setPoints(config.points);
        setRewards(config.rewards);
      } catch {}
    }
  }, [data]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function saveThresholds() {
    setSaving("thresholds");
    try {
      console.log(`[AUDIT ${new Date().toISOString()}] Badge thresholds updated:`, thresholds);
      await updateThresholds({ variables: { thresholds: JSON.stringify(thresholds) } });
      showToast("Limites salvos!");
      refetch();
    } catch (err: unknown) {
      showToast(`Erro: ${err instanceof Error ? err.message : "Erro ao salvar limites"}`);
    }
    setSaving(null);
  }

  async function savePoints() {
    setSaving("points");
    try {
      console.log(`[AUDIT ${new Date().toISOString()}] Badge points updated:`, points);
      await updatePoints({ variables: { points: JSON.stringify(points) } });
      showToast("Pontuacao salva!");
      refetch();
    } catch (err: unknown) {
      showToast(`Erro: ${err instanceof Error ? err.message : "Erro ao salvar pontuacao"}`);
    }
    setSaving(null);
  }

  async function saveReward(level: string) {
    const r = rewards[level] || {};
    // M6: Bounds validation for badge rewards
    if ((r.commissionReduction ?? 0) < 0 || (r.commissionReduction ?? 0) > 50) {
      showToast("Erro: Reducao de comissao deve ser entre 0 e 50%");
      return;
    }
    if ((r.subscriptionDiscount ?? 0) < 0 || (r.subscriptionDiscount ?? 0) > 50) {
      showToast("Erro: Desconto na assinatura deve ser entre 0 e 50%");
      return;
    }
    if ((r.freeTrialDays ?? 0) < 0 || (r.freeTrialDays ?? 0) > 30) {
      showToast("Erro: Trial gratis deve ser entre 0 e 30 dias");
      return;
    }
    if ((r.couponValue ?? 0) < 0 || (r.couponValue ?? 0) > 50) {
      showToast("Erro: Cupom de desconto deve ser entre 0 e 50%");
      return;
    }
    setSaving(level);
    try {
      // H8: Audit trail
      console.log(`[AUDIT ${new Date().toISOString()}] Badge rewards updated: level=${level}`, r);
      // TODO: Implement server-side audit logging for financial config changes
      await updateRewards({ variables: { level, rewards: JSON.stringify(r) } });
      showToast(`Recompensas ${BADGE_UI[level].label} salvas!`);
      refetch();
    } catch (err: unknown) {
      showToast(`Erro: ${err instanceof Error ? err.message : "Erro ao salvar recompensas"}`);
    }
    setSaving(null);
  }

  async function grantPrize() {
    if (!prizeModal) return;
    try {
      console.log(`[AUDIT ${new Date().toISOString()}] Badge granted: store=${prizeModal.id}, level=${prizeForm.level}, score=${prizeForm.score}`);
      await setVerification({
        variables: { storeId: prizeModal.id, level: prizeForm.level, score: prizeForm.score },
      });
      setPrizeModal(null);
      showToast("Selo concedido!");
      refetchStores();
    } catch (err: unknown) {
      showToast(`Erro: ${err instanceof Error ? err.message : "Erro ao conceder selo"}`);
    }
  }

  const stores = storesData?.allStores || [];

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Selos e Verificacao</h1>
      <p className="text-gray-400 text-sm mb-8 text-center">Configure pontuacao, limites de nivel, recompensas por selo e conceda premios a lojas.</p>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg animate-pulse">
          {toast}
        </div>
      )}

      {/* ─── Section 1: Points per action ─── */}
      <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1 text-center">Pontuacao por Acao</h2>
        <p className="text-gray-500 text-xs mb-4 text-center">Quanto cada acao contribui para o score do selo.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Por produto cadastrado</label>
            <input
              type="number" min="0"
              value={points.PER_PRODUCT}
              onChange={(e) => setPoints({ ...points, PER_PRODUCT: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Por venda completada</label>
            <input
              type="number" min="0"
              value={points.PER_SALE}
              onChange={(e) => setPoints({ ...points, PER_SALE: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Por mes ativo</label>
            <input
              type="number" min="0"
              value={points.PER_MONTH_ACTIVE}
              onChange={(e) => setPoints({ ...points, PER_MONTH_ACTIVE: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={savePoints}
            disabled={saving === "points"}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
          >
            {saving === "points" ? "Salvando..." : "Salvar Pontuacao"}
          </button>
        </div>
      </section>

      {/* ─── Section 2: Level thresholds ─── */}
      <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1 text-center">Limites de Nivel</h2>
        <p className="text-gray-500 text-xs mb-4 text-center">Pontos necessarios para atingir cada nivel de selo.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LEVELS.map((lvl) => {
            const b = BADGE_UI[lvl];
            return (
              <div key={lvl} className={`${b.bg} rounded-xl p-4 text-center`}>
                <span className="text-3xl">{b.emoji}</span>
                <p className={`text-sm font-bold mt-1 ${b.color}`}>{b.label}</p>
                <input
                  type="number" min="0"
                  value={thresholds[lvl as keyof typeof thresholds]}
                  onChange={(e) => setThresholds({ ...thresholds, [lvl]: parseInt(e.target.value) || 0 })}
                  className="w-full mt-2 px-3 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600 text-sm text-center focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-gray-500 mt-1">pontos</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={saveThresholds}
            disabled={saving === "thresholds"}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
          >
            {saving === "thresholds" ? "Salvando..." : "Salvar Limites"}
          </button>
        </div>
      </section>

      {/* ─── Section 3: Rewards per level ─── */}
      <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1 text-center">Recompensas por Nivel</h2>
        <p className="text-gray-500 text-xs mb-6 text-center">Beneficios que cada nivel de selo concede automaticamente.</p>

        <div className="space-y-6">
          {LEVELS.map((lvl) => {
            const b = BADGE_UI[lvl];
            const r = rewards[lvl] || {};
            return (
              <div key={lvl} className={`border border-gray-700 rounded-xl p-4`}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{b.emoji}</span>
                  <h3 className={`text-base font-bold ${b.color}`}>{b.label}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {Object.entries(REWARD_LABELS).map(([key, meta]) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 mb-1 block" title={meta.description}>
                        {meta.label}
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          meta.type === "Sempre" ? "bg-green-600/30 text-green-400" :
                          meta.type === "1a vez" ? "bg-blue-600/30 text-blue-400" :
                          "bg-amber-600/30 text-amber-400"
                        }`}>{meta.type}</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number" min="0" step="any"
                          value={r[key] ?? 0}
                          onChange={(e) => setRewards({
                            ...rewards,
                            [lvl]: { ...r, [key]: parseFloat(e.target.value) || 0 },
                          })}
                          className="flex-1 px-2 py-1.5 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
                        />
                        <span className="text-xs text-gray-500 shrink-0">{meta.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => saveReward(lvl)}
                    disabled={saving === lvl}
                    className="px-4 py-1.5 bg-purple-600/30 text-purple-400 rounded-lg text-xs font-semibold hover:bg-purple-600/50 transition cursor-pointer disabled:opacity-50"
                  >
                    {saving === lvl ? "Salvando..." : `Salvar ${b.label}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Section 4: Grant prizes to stores ─── */}
      <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1 text-center">Conceder Premios</h2>
        <p className="text-gray-500 text-xs mb-4 text-center">Atribua selos manualmente ou ajuste pontuacao de lojas especificas.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stores.map((store: any) => {
            const badge = BADGE_UI[store.verificationLevel] || BADGE_UI.NONE;
            return (
              <button
                key={store.id}
                onClick={() => {
                  setPrizeModal(store);
                  setPrizeForm({ level: store.verificationLevel || "NONE", score: store.verificationScore || 0 });
                }}
                className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition cursor-pointer text-left"
              >
                <span className="text-2xl">{badge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{store.name}</p>
                  <p className="text-xs text-gray-500">{store.verificationScore || 0} pts &middot; {badge.label}</p>
                </div>
                <div className="text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Section 5: How it works summary ─── */}
      <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-3 text-center">Como funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-300 font-semibold">Acumulo de pontos</p>
            <ul className="text-gray-400 space-y-1 list-disc list-inside">
              <li>Cada produto cadastrado soma pontos</li>
              <li>Cada venda completada soma pontos</li>
              <li>Cada mes ativo na plataforma soma pontos</li>
              <li>Plano Enterprise garante minimo Ouro</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300 font-semibold">Sistema de resgate</p>
            <ul className="text-gray-400 space-y-1 list-disc list-inside">
              <li>1a conquista de selo: premios automaticos</li>
              <li>Depois: vendedor escolhe quando resgatar</li>
              <li>Pode acumular para resgatar nivel maior</li>
              <li>Premios nao sao acumulativos (substituem)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300 font-semibold">Tipos de premio</p>
            <ul className="text-gray-400 space-y-1 list-disc list-inside">
              <li><span className="text-green-400">Sempre:</span> dias promo + reducao comissao (1 sem)</li>
              <li><span className="text-blue-400">1a vez:</span> trial gratis</li>
              <li><span className="text-amber-400">Da 2a+:</span> desc. assinatura + cupom</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Prize Modal ─── */}
      {prizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPrizeModal(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Conceder Selo</h3>
                <p className="text-sm text-gray-400">{prizeModal.name}</p>
              </div>
              <button onClick={() => setPrizeModal(null)} className="text-gray-400 hover:text-white cursor-pointer">&#10005;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Nivel do selo</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(["NONE", ...LEVELS] as const).map((lvl) => {
                    const b = BADGE_UI[lvl];
                    return (
                      <button
                        key={lvl}
                        onClick={() => setPrizeForm({ ...prizeForm, level: lvl })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          prizeForm.level === lvl
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
                  type="number" min="0"
                  value={prizeForm.score}
                  onChange={(e) => setPrizeForm({ ...prizeForm, score: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Quick rewards info */}
              {prizeForm.level !== "NONE" && rewards[prizeForm.level] && (
                <div className={`${BADGE_UI[prizeForm.level].bg} rounded-xl p-3`}>
                  <p className={`text-xs font-semibold ${BADGE_UI[prizeForm.level].color} mb-2`}>
                    Recompensas do nivel {BADGE_UI[prizeForm.level].label}:
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-xs text-gray-300">
                    {Object.entries(REWARD_LABELS).map(([key, meta]) => {
                      const val = rewards[prizeForm.level]?.[key] ?? 0;
                      if (val <= 0) return null;
                      return (
                        <div key={key} className="flex justify-between gap-1">
                          <span className="text-gray-500">
                            {meta.label}
                            <span className={`ml-1 text-[9px] ${
                              meta.type === "Sempre" ? "text-green-400" :
                              meta.type === "1a vez" ? "text-blue-400" : "text-amber-400"
                            }`}>({meta.type})</span>
                          </span>
                          <span className="font-semibold">{val} {meta.suffix}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={grantPrize}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  Conceder
                </button>
                <button
                  onClick={() => setPrizeModal(null)}
                  className="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
