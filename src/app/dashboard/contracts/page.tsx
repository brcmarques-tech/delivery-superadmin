"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import {
  GET_CONTRACT_CONTENT,
  GET_CONTRACT_UPDATED_AT,
  UPDATE_CONTRACT_CONTENT,
} from "@/lib/graphql";
import { DEFAULTS, type ContractType } from "@/lib/contract-defaults"; // KAN-256


const TABS: { key: ContractType; label: string }[] = [
  { key: "vendor", label: "Vendedor" },
  { key: "customer", label: "Cliente" },
  { key: "deliverer", label: "Entregador" },
  { key: "subscription", label: "Assinatura" },
];


export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<ContractType>("vendor");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { data: contentData, loading, refetch: refetchContent } = useQuery(GET_CONTRACT_CONTENT, {
    variables: { type: activeTab },
    fetchPolicy: "network-only",
  });
  const { data: updatedAtData, refetch: refetchUpdatedAt } = useQuery(GET_CONTRACT_UPDATED_AT, {
    variables: { type: activeTab },
    fetchPolicy: "network-only",
  });
  const [updateContract, { loading: updating }] = useMutation(UPDATE_CONTRACT_CONTENT);

  useEffect(() => {
    if (contentData?.contractContent !== undefined) {
      const serverContent = contentData.contractContent;
      setContent(serverContent || DEFAULTS[activeTab]);
    }
  }, [contentData, activeTab]);

  useEffect(() => {
    setSaved(false);
  }, [activeTab]);

  function handleTabChange(tab: ContractType) {
    setActiveTab(tab);
    refetchContent({ type: tab });
    refetchUpdatedAt({ type: tab });
  }

  async function handleSave() {
    try {
      await updateContract({ variables: { type: activeTab, content } });
      setSaved(true);
      setShowConfirm(false);
      refetchContent({ type: activeTab });
      refetchUpdatedAt({ type: activeTab });
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  }

  function handleLoadDefault() {
    setContent(DEFAULTS[activeTab]);
  }

  const updatedAt = updatedAtData?.contractUpdatedAt;
  const hasContent = content.trim().length > 0;
  const serverContent = contentData?.contractContent || "";
  const isModified = serverContent ? serverContent !== content : DEFAULTS[activeTab] !== content;

  const tabLabels: Record<ContractType, string> = {
    vendor: "Termos de Uso — Vendedor",
    customer: "Termos de Uso — Cliente",
    deliverer: "Termos de Uso — Entregador",
    subscription: "Contrato de Assinatura de Plano",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Contratos</h1>
      <p className="text-gray-400 text-sm mb-6">
        Gerencie os contratos da plataforma por perfil. Ao salvar, todos os usu&aacute;rios do perfil correspondente dever&atilde;o aceitar novamente.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === tab.key
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{tabLabels[activeTab]}</h2>
          <div className="flex items-center gap-3">
            {updatedAt && (
              <span className="text-xs text-gray-500">
                Atualizado em {new Date(updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {!updatedAt && !loading && (
              <span className="text-xs text-amber-500">Contrato padr&atilde;o (n&atilde;o salvo)</span>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">
                Edite o contrato abaixo. Use linhas em branco para separar par&aacute;grafos.
              </p>
              <button
                onClick={handleLoadDefault}
                className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
              >
                Restaurar padr&atilde;o
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:border-purple-500 resize-y min-h-[200px] md:min-h-[500px]"
              placeholder="Cole ou escreva o contrato aqui..."
            />
          </>
        )}

        {/* Preview */}
        {hasContent && (
          <button
            onClick={() => setShowPreview(true)}
            className="mt-4 text-sm text-purple-400 cursor-pointer hover:text-purple-300 font-medium"
          >
            Pr&eacute;-visualizar como o usu&aacute;rio v&ecirc;
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!isModified || updating}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Salvar e Renovar Aceites
          </button>
          {saved && (
            <span className="text-green-400 text-sm font-medium">
              Salvo! Todos os usu&aacute;rios precisar&atilde;o aceitar novamente.
            </span>
          )}
        </div>
      </div>

      {/* Warning box */}
      <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6">
        <h3 className="text-red-400 font-bold mb-2">Aten&ccedil;&atilde;o</h3>
        <ul className="text-red-300/80 text-sm space-y-1">
          <li>&bull; Ao salvar, <strong>todos</strong> os usu&aacute;rios que j&aacute; aceitaram este contrato ter&atilde;o o aceite resetado.</li>
          <li>&bull; Eles ser&atilde;o obrigados a ler e aceitar a nova vers&atilde;o no pr&oacute;ximo acesso.</li>
          <li>&bull; Conforme CDC (art. 6&ordm;, III), LGPD (art. 8&ordm;, &sect;6&ordm;) e Marco Civil da Internet.</li>
          <li>&bull; Cada contrato &eacute; independente: alterar um n&atilde;o afeta os demais.</li>
          <li>&bull; O contrato de Assinatura &eacute; complementar ao de Vendedor &mdash; n&atilde;o o substitui.</li>
        </ul>
      </div>

      {/* Preview modal — exact replica of what the user sees */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{tabLabels[activeTab]}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Pr&eacute;-visualiza&ccedil;&atilde;o — exatamente como o usu&aacute;rio v&ecirc;.
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {content}
            </div>

            <div className="p-6 border-t border-gray-200 space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  disabled
                  className="mt-0.5 w-5 h-5 accent-orange-500"
                />
                <span className="text-sm text-gray-800">
                  {activeTab === "subscription"
                    ? "Li e aceito o Contrato de Assinatura, estou ciente das condi\u00e7\u00f5es de pagamento, renova\u00e7\u00e3o e cancelamento."
                    : activeTab === "vendor"
                      ? "Li e aceito os Termos de Uso da Plataforma, a Pol\u00edtica de Privacidade e estou ciente das minhas responsabilidades como vendedor."
                      : activeTab === "deliverer"
                        ? "Li e aceito os Termos de Uso da Plataforma e estou ciente de que atuo como profissional aut\u00f4nomo, sem v\u00ednculo empregat\u00edcio."
                        : "Li e aceito os Termos de Uso da Plataforma e a Pol\u00edtica de Privacidade."}
                </span>
              </label>

              <button
                disabled
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold opacity-40 cursor-not-allowed"
              >
                Aceitar e Continuar
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Fechar pr&eacute;-visualiza&ccedil;&atilde;o
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-3">Confirmar altera&ccedil;&atilde;o</h3>
            <p className="text-gray-300 text-sm mb-2">
              Ao salvar, <strong>todos os usu&aacute;rios</strong> que j&aacute; aceitaram &quot;{tabLabels[activeTab]}&quot; ter&atilde;o o aceite invalidado.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Eles precisar&atilde;o ler e aceitar a nova vers&atilde;o no pr&oacute;ximo acesso.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
              >
                {updating ? "Salvando..." : "Confirmar e Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
