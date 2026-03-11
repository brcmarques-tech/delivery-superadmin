"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATION_LOGS, RESEND_NOTIFICATION } from "@/lib/graphql";
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
  const [resending, setResending] = useState<string | null>(null);

  const logs: NotifLog[] = data?.notificationLogs || [];
  const totalSent = logs.filter((l) => l.success).length;
  const totalFailed = logs.filter((l) => !l.success).length;

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

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Notificacoes Enviadas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">Total de emails</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{logs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">Enviados com sucesso</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalSent}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-sm text-gray-400">Falhas</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{totalFailed}</p>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Nenhuma notificacao enviada ainda</p>
        </div>
      )}

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`bg-gray-800 rounded-xl p-4 border ${
              log.success ? "border-gray-700" : "border-red-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">
                  Email
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
              <div className="flex items-center justify-between mt-1">
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
