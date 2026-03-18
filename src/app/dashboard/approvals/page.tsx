"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PENDING_APP_APPROVALS,
  GET_PENDING_VENDOR_APPROVALS,
  GET_ALL_APP_USERS,
  GET_ALL_VENDOR_USERS,
  APPROVE_APP_USER,
  APPROVE_VENDOR_USER,
  REJECT_APP_USER,
  REJECT_VENDOR_USER,
  GET_APPROVAL_LOGS,
} from "@/lib/graphql";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  CUSTOMER: "Cliente",
  VENDOR: "Vendedor",
  DELIVERER: "Entregador",
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
};

type Tab = "pending" | "approved" | "rejected" | "logs";

interface ApprovalLogEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: string;
  action: string;
  role: string;
  reason: string | null;
  createdAt: string;
  profilePhotoUrl: string | null;
  identityPhotoUrl: string | null;
  identityPhotoBackUrl: string | null;
}

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
  identityPhotoBackUrl?: string | null;
  profilePhotoUrl?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  _source: "app" | "vendor";
}

// ─── Image Lightbox ───
function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition cursor-pointer"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─── Clickable Photo ───
function ClickablePhoto({
  src,
  alt,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  onOpen: (src: string, alt: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <img
        src={src}
        alt={alt}
        onClick={() => onOpen(src, alt)}
        className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border border-gray-600 cursor-pointer hover:opacity-80 hover:border-purple-500 transition"
      />
    </div>
  );
}

// ─── User Card ───
function UserCard({
  user,
  tab,
  processing,
  rejectingId,
  rejectReason,
  onApprove,
  onRejectStart,
  onRejectConfirm,
  onRejectReasonChange,
  onOpenImage,
}: {
  user: PendingUser;
  tab: Tab;
  processing: string | null;
  rejectingId: string | null;
  rejectReason: string;
  onApprove: (u: PendingUser) => void;
  onRejectStart: (id: string) => void;
  onRejectConfirm: (u: PendingUser) => void;
  onRejectReasonChange: (v: string) => void;
  onOpenImage: (src: string, alt: string) => void;
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user._source === "vendor"
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {user._source === "vendor" ? "Vendedor" : roleLabels[user.pendingRole || user.role] || "Entregador"}
            </span>
            {tab === "approved" && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/20 text-green-400">
                Aprovado
              </span>
            )}
            {tab === "rejected" && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-500/20 text-red-400">
                Rejeitado
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
            <p>Email: <span className="text-gray-300">{user.email}</span></p>
            <p>Telefone: <span className="text-gray-300">{user.phone}</span></p>
            <p>Cargo: <span className="text-gray-300">{roleLabels[user.role] || user.role}</span></p>
            <p>Solicitado em: <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span></p>
            {tab === "approved" && user.approvedAt && (
              <p>Aprovado em: <span className="text-green-400">{new Date(user.approvedAt).toLocaleDateString("pt-BR")}</span></p>
            )}
            {tab === "rejected" && user.rejectedAt && (
              <p>Rejeitado em: <span className="text-red-400">{new Date(user.rejectedAt).toLocaleDateString("pt-BR")}</span></p>
            )}
          </div>

          {tab === "rejected" && user.rejectionReason && (
            <div className="mt-2 p-2 bg-red-500/10 rounded-lg">
              <p className="text-sm text-red-400">
                <span className="font-medium">Motivo:</span> {user.rejectionReason}
              </p>
            </div>
          )}

          {/* Deliverer data */}
          {user._source === "app" && (user.pendingRole === "DELIVERER" || user.role === "DELIVERER") && (
            <div className="mt-3 p-3 bg-gray-700/50 rounded-xl">
              <p className="text-sm font-medium text-gray-300 mb-2">Dados do entregador:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-400">
                <p>CPF: <span className="text-gray-300">{user.cpf || "-"}</span></p>
                <p>Veiculo: <span className="text-gray-300">{user.vehicleType || "-"}</span></p>
                <p>Placa: <span className="text-gray-300">{user.vehiclePlate || "-"}</span></p>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                {user.profilePhotoUrl && (
                  <ClickablePhoto src={user.profilePhotoUrl} alt="Rosto" label="Selfie:" onOpen={onOpenImage} />
                )}
                {user.identityPhotoUrl && (
                  <ClickablePhoto src={user.identityPhotoUrl} alt="Documento (frente)" label="Documento (frente):" onOpen={onOpenImage} />
                )}
                {user.identityPhotoBackUrl && (
                  <ClickablePhoto src={user.identityPhotoBackUrl} alt="Documento (verso)" label="Documento (verso):" onOpen={onOpenImage} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions only for pending */}
        {tab === "pending" && (
          <div className="flex flex-wrap gap-2 ml-0 sm:ml-6">
            <button
              onClick={() => onApprove(user)}
              disabled={processing === user.id}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-green-700 disabled:opacity-50 transition"
            >
              Aprovar
            </button>
            <button
              onClick={() => onRejectStart(user.id)}
              disabled={processing === user.id}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium cursor-pointer hover:bg-red-600/30 disabled:opacity-50 transition"
            >
              Rejeitar
            </button>
          </div>
        )}
      </div>

      {tab === "pending" && rejectingId === user.id && (
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Motivo da rejeicao..."
            value={rejectReason}
            onChange={(e) => onRejectReasonChange(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm border border-gray-600 focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => onRejectConfirm(user)}
            disabled={processing === user.id}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-red-700 disabled:opacity-50 transition"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───
export default function ApprovalsPage() {
  const { data: appData, loading: loadingApp, refetch: refetchApp } = useQuery(GET_PENDING_APP_APPROVALS);
  const { data: vendorData, loading: loadingVendor, refetch: refetchVendor } = useQuery(GET_PENDING_VENDOR_APPROVALS);
  const { data: allAppData, loading: loadingAllApp, refetch: refetchAllApp } = useQuery(GET_ALL_APP_USERS);
  const { data: allVendorData, loading: loadingAllVendor, refetch: refetchAllVendor } = useQuery(GET_ALL_VENDOR_USERS);
  const { data: logsData, loading: loadingLogs, refetch: refetchLogs } = useQuery(GET_APPROVAL_LOGS);
  const [approveAppUser] = useMutation(APPROVE_APP_USER);
  const [approveVendorUser] = useMutation(APPROVE_VENDOR_USER);
  const [rejectAppUser] = useMutation(REJECT_APP_USER);
  const [rejectVendorUser] = useMutation(REJECT_VENDOR_USER);

  const [tab, setTab] = useState<Tab>("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [filter, setFilter] = useState("");

  const loading = loadingApp || loadingVendor || loadingAllApp || loadingAllVendor || loadingLogs;

  const logs: ApprovalLogEntry[] = logsData?.approvalLogs || [];

  // Pending
  const appPending: PendingUser[] = (appData?.pendingAppApprovals || []).map((u: any) => ({ ...u, _source: "app" }));
  const vendorPending: PendingUser[] = (vendorData?.pendingVendorApprovals || []).map((u: any) => ({ ...u, _source: "vendor" }));
  const pending = [...appPending, ...vendorPending];

  // History from all users
  const allApp: PendingUser[] = (allAppData?.allAppUsers || []).map((u: any) => ({ ...u, _source: "app" }));
  const allVendor: PendingUser[] = (allVendorData?.allVendorUsers || []).map((u: any) => ({ ...u, _source: "vendor" }));
  const allUsers = [...allApp, ...allVendor];

  const approved = allUsers
    .filter((u) => u.approvedAt)
    .sort((a, b) => new Date(b.approvedAt!).getTime() - new Date(a.approvedAt!).getTime());

  const rejected = allUsers
    .filter((u) => u.rejectedAt)
    .sort((a, b) => new Date(b.rejectedAt!).getTime() - new Date(a.rejectedAt!).getTime());

  // Filter
  const currentList = tab === "pending" ? pending : tab === "approved" ? approved : tab === "rejected" ? rejected : [];
  const filtered = filter
    ? currentList.filter(
        (u) =>
          u.name.toLowerCase().includes(filter.toLowerCase()) ||
          u.email.toLowerCase().includes(filter.toLowerCase())
      )
    : currentList;

  const filteredLogs = filter
    ? logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(filter.toLowerCase()) ||
          l.userEmail.toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  async function handleApprove(user: PendingUser) {
    setProcessing(user.id);
    try {
      if (user._source === "vendor") {
        await approveVendorUser({ variables: { id: user.id } });
        refetchVendor();
        refetchAllVendor();
        refetchLogs();
      } else {
        await approveAppUser({ variables: { id: user.id } });
        refetchApp();
        refetchAllApp();
        refetchLogs();
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
        refetchAllVendor();
        refetchLogs();
      } else {
        await rejectAppUser({ variables: { id: user.id, reason: rejectReason } });
        refetchApp();
        refetchAllApp();
        refetchLogs();
      }
      setRejectingId(null);
      setRejectReason("");
    } catch {
      alert("Erro ao rejeitar usuario");
    }
    setProcessing(null);
  }

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    { key: "pending", label: "Pendentes", count: pending.length, color: "bg-yellow-600 text-white" },
    { key: "approved", label: "Aprovadas", count: approved.length, color: "bg-green-600 text-white" },
    { key: "rejected", label: "Rejeitadas", count: rejected.length, color: "bg-red-600 text-white" },
    { key: "logs", label: "Historico", count: logs.length, color: "bg-purple-600 text-white" },
  ];

  return (
    <div>
      {lightbox && <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}

      <h2 className="text-2xl font-bold text-white mb-6">Aprovacoes</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setFilter(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              tab === t.key ? t.color : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Search */}
      {(tab === "approved" || tab === "rejected" || tab === "logs") && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {loading && <p className="text-gray-400">Carregando...</p>}

      {/* Tabs: pending, approved, rejected */}
      {tab !== "logs" && (
        <>
          {!loading && filtered.length === 0 && (
            <div className="bg-gray-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">
                {tab === "pending" ? "\u2713" : tab === "approved" ? "\uD83D\uDC4D" : "\uD83D\uDEAB"}
              </p>
              <p className="text-gray-400 text-lg">
                {tab === "pending"
                  ? "Nenhuma aprovacao pendente"
                  : tab === "approved"
                  ? "Nenhuma aprovacao encontrada"
                  : "Nenhuma rejeicao encontrada"}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((user) => (
              <UserCard
                key={user.id + user._source}
                user={user}
                tab={tab}
                processing={processing}
                rejectingId={rejectingId}
                rejectReason={rejectReason}
                onApprove={handleApprove}
                onRejectStart={(id) => setRejectingId(rejectingId === id ? null : id)}
                onRejectConfirm={handleReject}
                onRejectReasonChange={setRejectReason}
                onOpenImage={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </div>
        </>
      )}

      {/* Tab: logs */}
      {tab === "logs" && (
        <>
          {!loading && filteredLogs.length === 0 && (
            <div className="bg-gray-800 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">Nenhum registro encontrado</p>
            </div>
          )}

          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${log.action === "APPROVED" ? "bg-green-500" : "bg-red-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">{log.userName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        log.action === "APPROVED" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {log.action === "APPROVED" ? "Aprovado" : "Rejeitado"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        log.userType === "vendor" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {roleLabels[log.role] || log.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{log.userEmail}</p>
                    {log.reason && (
                      <p className="text-sm text-red-400 mt-1">Motivo: {log.reason}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString("pt-BR")} {new Date(log.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {(log.profilePhotoUrl || log.identityPhotoUrl || log.identityPhotoBackUrl) && (
                  <div className="mt-3 flex flex-wrap gap-3 ml-7">
                    {log.profilePhotoUrl && (
                      <ClickablePhoto src={log.profilePhotoUrl} alt="Selfie" label="Selfie" onOpen={(src, alt) => setLightbox({ src, alt })} />
                    )}
                    {log.identityPhotoUrl && (
                      <ClickablePhoto src={log.identityPhotoUrl} alt="Doc (frente)" label="Doc (frente)" onOpen={(src, alt) => setLightbox({ src, alt })} />
                    )}
                    {log.identityPhotoBackUrl && (
                      <ClickablePhoto src={log.identityPhotoBackUrl} alt="Doc (verso)" label="Doc (verso)" onOpen={(src, alt) => setLightbox({ src, alt })} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
