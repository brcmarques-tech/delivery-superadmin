"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_PENDING_APPROVALS, APPROVE_USER, REJECT_USER } from "@/lib/graphql";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  CUSTOMER: "Cliente",
  VENDOR: "Vendedor",
  DELIVERER: "Entregador",
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
};

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  pendingRole: string;
  cpf: string | null;
  vehicleType: string | null;
  vehiclePlate: string | null;
  identityPhotoUrl: string | null;
  createdAt: string;
}

export default function ApprovalsPage() {
  const { data, loading, refetch } = useQuery(GET_PENDING_APPROVALS);
  const [approveUser] = useMutation(APPROVE_USER);
  const [rejectUser] = useMutation(REJECT_USER);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await approveUser({ variables: { id } });
      refetch();
    } catch {
      alert("Erro ao aprovar usuario");
    }
    setProcessing(null);
  }

  async function handleReject(id: string) {
    if (!rejectReason.trim()) {
      alert("Informe o motivo da rejeicao");
      return;
    }
    setProcessing(id);
    try {
      await rejectUser({ variables: { id, reason: rejectReason } });
      setRejectingId(null);
      setRejectReason("");
      refetch();
    } catch {
      alert("Erro ao rejeitar usuario");
    }
    setProcessing(null);
  }

  const pending: PendingUser[] = data?.pendingApprovals || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Aprovacoes Pendentes
        {pending.length > 0 && (
          <span className="ml-3 text-sm bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
            {pending.length}
          </span>
        )}
      </h2>

      {loading && <p className="text-gray-400">Carregando...</p>}

      {!loading && pending.length === 0 && (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">&#10003;</p>
          <p className="text-gray-400 text-lg">Nenhuma aprovacao pendente</p>
        </div>
      )}

      <div className="space-y-4">
        {pending.map((user) => (
          <div key={user.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      (user.pendingRole || user.role) === "VENDOR"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {(user.pendingRole || user.role) === "VENDOR" ? "Vendedor" : "Entregador"}
                    {!user.pendingRole && " (conta antiga)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
                  <p>Email: <span className="text-gray-300">{user.email}</span></p>
                  <p>Telefone: <span className="text-gray-300">{user.phone}</span></p>
                  <p>Cargo atual: <span className="text-gray-300">{roleLabels[user.role] || user.role}</span></p>
                  <p>Solicitado em: <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span></p>
                </div>

                {user.pendingRole === "DELIVERER" && (
                  <div className="mt-3 p-3 bg-gray-700/50 rounded-xl">
                    <p className="text-sm font-medium text-gray-300 mb-2">Dados do entregador:</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
                      <p>CPF: <span className="text-gray-300">{user.cpf || "-"}</span></p>
                      <p>Veiculo: <span className="text-gray-300">{user.vehicleType || "-"}</span></p>
                      <p>Placa: <span className="text-gray-300">{user.vehiclePlate || "-"}</span></p>
                    </div>
                    {user.identityPhotoUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-1">Foto com identidade:</p>
                        <img
                          src={user.identityPhotoUrl}
                          alt="Identidade"
                          className="w-48 h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button
                  onClick={() => handleApprove(user.id)}
                  disabled={processing === user.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-green-700 disabled:opacity-50 transition"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => setRejectingId(rejectingId === user.id ? null : user.id)}
                  disabled={processing === user.id}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium cursor-pointer hover:bg-red-600/30 disabled:opacity-50 transition"
                >
                  Rejeitar
                </button>
              </div>
            </div>

            {rejectingId === user.id && (
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Motivo da rejeicao..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm border border-gray-600 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => handleReject(user.id)}
                  disabled={processing === user.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-red-700 disabled:opacity-50 transition"
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
