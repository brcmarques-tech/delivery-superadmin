"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATION_LOGS, RESEND_NOTIFICATION, DELETE_NOTIFICATION, CLEAR_ALL_NOTIFICATIONS } from "@/lib/graphql";
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

export default function NotificationsPage() {
  const { data, loading, refetch } = useQuery(GET_NOTIFICATION_LOGS, { pollInterval: 15000 });
  const [resendNotification] = useMutation(RESEND_NOTIFICATION);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);
  const [clearAllNotifications] = useMutation(CLEAR_ALL_NOTIFICATIONS);
  const [resending, setResending] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  const logs: NotifLog[] = data?.notificationLogs || [];
  const totalSent = logs.filter((l) => l.success).length;
  const totalFailed = logs.filter((l) => !l.success).length;

  const filteredLogs = logs.filter((l) => {
    if (filter === "success") return l.success;
    if (filter === "failed") return !l.success;
    return true;
  });

  async function handleResend(id: string) {
    setResending(id);
    try {
      await resendNotification({ variables: { id } });
      await refetch();
    } catch (err: any) {
      alert("Erro ao reenviar: " + err.message);
    }
    setResending(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar esta notificacao?")) return;
    try {
      await deleteNotification({ variables: { id } });
      await refetch();
    } catch (err: any) {
      alert("Erro ao apagar: " + err.message);
    }
  }

  async function handleClearAll() {
    if (!confirm("Apagar TODAS as notificacoes? Esta acao nao pode ser desfeita.")) return;
    try {
      await clearAllNotifications();
      await refetch();
    } catch (err: any) {
      alert("Erro ao limpar: " + err.message);
    }
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <h1 className="text-2xl font-bold text-white">Notificacoes Enviadas</h1>
          {logs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer self-start sm:self-auto"
            >
              Limpar Tudo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-700">
            <p className="text-sm text-gray-400">Total de emails</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{logs.length}</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-700">
            <p className="text-sm text-gray-400">Enviados com sucesso</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{totalSent}</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-700">
            <p className="text-sm text-gray-400">Falhas</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{totalFailed}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(["all", "success", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-lg transition cursor-pointer ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f === "all" ? "Todos" : f === "success" ? "Enviados" : "Falharam"}
            </button>
          ))}
        </div>
      </div>

      {filteredLogs.length === 0 && logs.length === 0 && (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Nenhuma notificacao enviada ainda</p>
        </div>
      )}

      {filteredLogs.length === 0 && logs.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Nenhuma notificacao neste filtro</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`bg-gray-800 rounded-xl p-3 sm:p-4 border ${
              log.success ? "border-gray-700" : "border-red-700/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">
                  Email
                </span>
                <span className="text-white font-medium">{log.userName}</span>
                <span className="text-gray-500 text-sm break-all">{log.to}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  log.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {log.success ? "Enviado" : "Falhou"}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(log.createdAt).toLocaleString("pt-BR")}
                </span>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-gray-500 hover:text-red-400 transition cursor-pointer"
                  title="Apagar"
                >
                  &times;
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-gray-300 font-medium">{log.subject}</span> — {log.message}
            </p>
            {log.error && (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                <p className="text-xs text-red-400">Erro: {log.error}</p>
                <button
                  onClick={() => handleResend(log.id)}
                  disabled={resending === log.id}
                  className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {resending === log.id ? "Reenviando..." : "Reenviar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
