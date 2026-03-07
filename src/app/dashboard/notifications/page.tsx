"use client";

import { useQuery } from "@apollo/client";
import { GET_NOTIFICATION_LOGS } from "@/lib/graphql";
import { useState } from "react";

interface NotifLog {
  id: string;
  type: string;
  to: string;
  userName: string;
  subject: string;
  message: string;
  success: boolean;
  error: string | null;
  createdAt: string;
}

const typeColors: Record<string, string> = {
  EMAIL: "bg-blue-500/20 text-blue-400",
  WHATSAPP: "bg-green-500/20 text-green-400",
};

const typeIcons: Record<string, string> = {
  EMAIL: "📧",
  WHATSAPP: "📱",
};

export default function NotificationsPage() {
  const { data, loading } = useQuery(GET_NOTIFICATION_LOGS, { pollInterval: 15000 });
  const [typeFilter, setTypeFilter] = useState("");

  const logs: NotifLog[] = data?.notificationLogs || [];
  const filtered = typeFilter ? logs.filter((l) => l.type === typeFilter) : logs;

  const totalEmail = logs.filter((l) => l.type === "EMAIL").length;
  const totalWhatsapp = logs.filter((l) => l.type === "WHATSAPP").length;
  const totalFailed = logs.filter((l) => !l.success).length;

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Notificacoes Enviadas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">Emails enviados</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalEmail}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">WhatsApp enviados</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalWhatsapp}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">Falhas</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{totalFailed}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTypeFilter("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
            !typeFilter ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setTypeFilter("EMAIL")}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
            typeFilter === "EMAIL" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          📧 Email
        </button>
        <button
          onClick={() => setTypeFilter("WHATSAPP")}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
            typeFilter === "WHATSAPP" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          📱 WhatsApp
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Nenhuma notificacao enviada ainda</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.id}
            className={`bg-gray-800 rounded-xl p-4 border ${
              log.success ? "border-gray-700" : "border-red-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[log.type] || "bg-gray-600 text-gray-300"}`}>
                  {typeIcons[log.type]} {log.type}
                </span>
                <span className="text-white font-medium">{log.userName}</span>
                <span className="text-gray-500 text-sm">{log.to}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  log.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {log.success ? "Enviado" : "Falhou"}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(log.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-gray-300 font-medium">{log.subject}</span> — {log.message}
            </p>
            {log.error && (
              <p className="text-xs text-red-400 mt-1">Erro: {log.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
