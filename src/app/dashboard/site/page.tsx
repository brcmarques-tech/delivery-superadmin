"use client";
import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Globe, Save, RefreshCw, Type, Eye } from "lucide-react";

const GET_SITE_CONFIG = gql`
  query GetAllSiteConfig {
    getAllSiteConfig {
      key
      value
      updatedAt
    }
  }
`;

const SET_SITE_CONFIG = gql`
  mutation SetSiteConfig($key: String!, $value: String!) {
    setSiteConfig(key: $key, value: $value) {
      key
      value
    }
  }
`;

const EDITABLE_FIELDS = [
  { key: "hero_title", label: "Título do hero", section: "hero", type: "text", placeholder: "Compre local. Venda mais. Tudo num app." },
  { key: "hero_subtitle", label: "Subtítulo do hero", section: "hero", type: "textarea", placeholder: "Conectamos clientes a lojas e serviços locais..." },
  { key: "platform_description", label: "Descrição da plataforma", section: "hero", type: "textarea", placeholder: "Marketplace local para produtos e serviços." },
  { key: "contact_whatsapp", label: "WhatsApp", section: "contato", type: "text", placeholder: "+55 53 8442-4244" },
  { key: "contact_email", label: "E-mail de contato", section: "contato", type: "text", placeholder: "contato@bcmtech.com.br" },
  { key: "app_download_url", label: "URL de download do app", section: "app", type: "text", placeholder: "https://... (deixe em branco se não disponível)" },
  { key: "app_download_text", label: "Texto do botão de download", section: "app", type: "text", placeholder: "Baixar app Android" },
];

const TOGGLE_FIELDS = [
  { key: "show_stats", label: "Mostrar seção de estatísticas", description: "Exibe contadores animados (lojas, clientes, etc.)" },
  { key: "show_testimonials", label: "Mostrar depoimentos", description: "Exibe cards de depoimentos de clientes" },
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero / Cabeçalho",
  contato: "Informações de Contato",
  app: "Download do App",
};

type ConfigMap = Record<string, string>;

export default function SitePage() {
  const { data, loading, refetch } = useQuery(GET_SITE_CONFIG);
  const [setSiteConfig] = useMutation(SET_SITE_CONFIG);

  const [values, setValues] = useState<ConfigMap>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.getAllSiteConfig) {
      const map: ConfigMap = {};
      data.getAllSiteConfig.forEach((c: { key: string; value: string }) => {
        map[c.key] = c.value;
      });
      setValues(map);
    }
  }, [data]);

  const handleSave = async (key: string) => {
    setSaving(key);
    setSuccess(null);
    setError(null);
    try {
      await setSiteConfig({ variables: { key, value: values[key] ?? "" } });
      setSuccess(key);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const handleToggle = async (key: string) => {
    const newVal = values[key] === "true" ? "false" : "true";
    setValues((v) => ({ ...v, [key]: newVal }));
    setSaving(key);
    try {
      await setSiteConfig({ variables: { key, value: newVal } });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  const sections = ["hero", "contato", "app"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Conteúdo do Site</h1>
          <p className="text-sm text-gray-400">Edite as informações exibidas em shop.bcmtech.com.br</p>
        </div>
        <button
          onClick={() => refetch()}
          className="ml-auto p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Recarregar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">{error}</div>
      )}

      {/* Editable text fields by section */}
      {sections.map((section) => {
        const fields = EDITABLE_FIELDS.filter((f) => f.section === section);
        if (!fields.length) return null;
        return (
          <div key={section} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <h2 className="font-semibold text-white text-sm">{SECTION_LABELS[section]}</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {fields.map((field) => (
                <div key={field.key} className="px-5 py-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {success === field.key ? (
                      <span className="text-xs text-green-400">Salvo!</span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {values[field.key] !== data?.getAllSiteConfig?.find((c: any) => c.key === field.key)?.value
                          ? "Alterações não salvas"
                          : ""}
                      </span>
                    )}
                    <button
                      onClick={() => handleSave(field.key)}
                      disabled={saving === field.key}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {saving === field.key ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Salvar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Toggle fields */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <h2 className="font-semibold text-white text-sm">Visibilidade de Seções</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {TOGGLE_FIELDS.map((field) => {
            const isOn = values[field.key] === "true";
            return (
              <div key={field.key} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">{field.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{field.description}</div>
                </div>
                <button
                  onClick={() => handleToggle(field.key)}
                  disabled={saving === field.key}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isOn ? "bg-purple-600" : "bg-gray-600"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      isOn ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-800/40 text-sm text-blue-300">
        <strong>Nota:</strong> As alterações ficam disponíveis no site em até 5 minutos (cache ISR). Para forçar a atualização imediata, rebuilde o container do shopping-site.
      </div>
    </div>
  );
}
