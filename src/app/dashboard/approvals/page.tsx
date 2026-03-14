"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PENDING_APP_APPROVALS,
  GET_PENDING_VENDOR_APPROVALS,
  APPROVE_APP_USER,
  APPROVE_VENDOR_USER,
  REJECT_APP_USER,
  REJECT_VENDOR_USER,
} from "@/lib/graphql";
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
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  identityPhotoUrl?: string | null;
  createdAt: string;
  _source: "app" | "vendor";
}

export default function ApprovalsPage() {
  const { data: appData, loading: loadingApp, refetch: refetchApp } = useQuery(GET_PENDING_APP_APPROVALS);
  const { data: vendorData, loading: loadingVendor, refetch: refetchVendor } = useQuery(GET_PENDING_VENDOR_APPROVALS);
  const [approveAppUser] = useMutation(APPROVE_APP_USER);
  const [approveVendorUser] = useMutation(APPROVE_VENDOR_USER);
  const [rejectAppUser] = useMutation(REJECT_APP_USER);
  const [rejectVendorUser] = useMutation(REJECT_VENDOR_USER);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const loading = loadingApp || loadingVendor;

  const appPending: PendingUser[] = (appData?.pendingAppApprovals || []).map((u: any) => ({ ...u, _source: "app" }));
  const vendorPending: PendingUser[] = (vendorData?.pendingVendorApprovals || []).map((u: any) => ({ ...u, _source: "vendor" }));
  const pending = [...appPending, ...vendorPending];

  async function handleApprove(user: PendingUser) {
    setProcessing(user.id);
    try {
      if (user._source === "vendor") {
        await approveVendorUser({ variables: { id: user.id } });
        refetchVendor();
      } else {
        await approveAppUser({ variables: { id: user.id } });
        refetchApp();
      }
    } catch {
      alert("Erro ao aprovar usuario");
    }
    setProcessing(null);
  }

  async function handleReject(user: PendingUser) {
    if (!rejectReason.trim()) {
      alert("Informe o motivo da rejeicao");
      return;
    }
    setProcessing(user.id);
    try {
      if (user._source === "vendor") {
        await rejectVendorUser({ variables: { id: user.id, reason: rejectReason } });
        refetchVendor();
      } else {
        await rejectAppUser({ variables: { id: user.id, reason: rejectReason } });
        refetchApp();
      }
      setRejectingId(null);
      setRejectReason("");
    } catch {
      alert("Erro ao rejeitar usuario");
    }
    setProcessing(null);
  }

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
          <div key={user.id} className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user._source === "vendor"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user._source === "vendor" ? "Vendedor" : "Entregador"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
                  <p>Email: <span className="text-gray-300">{user.email}</span></p>
                  <p>Telefone: <span className="text-gray-300">{user.phone}</span></p>
                  <p>Cargo atual: <span className="text-gray-300">{roleLabels[user.role] || user.role}</span></p>
                  <p>Solicitado em: <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span></p>
                </div>

                {user._source === "app" && user.pendingRole === "DELIVERER" && (
                  <div className="mt-3 p-3 bg-gray-700/50 rounded-xl">
                    <p className="text-sm font-medium text-gray-300 mb-2">Dados do entregador:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
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
                          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 ml-0 sm:ml-6">
                <button
                  onClick={() => handleApprove(user)}
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
              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Motivo da rejeicao..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm border border-gray-600 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => handleReject(user)}
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
