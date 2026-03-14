"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_APP_USERS, REGISTER_SUPERADMIN, UPDATE_SUPERADMIN_PERMISSIONS, TOGGLE_APP_USER_ACTIVE, UPDATE_NOTIFICATION_EMAIL } from "@/lib/graphql";
import { useState } from "react";

const PERMISSION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  approvals: "Aprovacoes",
  users: "Usuarios",
  stores: "Lojas",
  orders: "Pedidos",
  deliveries: "Entregas",
  payments: "Pagamentos",
  plans: "Planos",
  badges: "Selos",
  promotions: "Promocoes",
  coupons: "Cupons",
  contracts: "Contratos",
  notifications: "Notificacoes",
  settings: "Configuracoes",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS);

function getPermissions(permStr: string | null): Record<string, boolean> {
  if (!permStr) {
    // null = all permissions
    const all: Record<string, boolean> = {};
    ALL_PERMISSIONS.forEach((p) => (all[p] = true));
    return all;
  }
  try {
    return JSON.parse(permStr);
  } catch {
    const all: Record<string, boolean> = {};
    ALL_PERMISSIONS.forEach((p) => (all[p] = true));
    return all;
  }
}

export default function SettingsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_APP_USERS);
  const [registerSuperadmin] = useMutation(REGISTER_SUPERADMIN);
  const [updatePermissions] = useMutation(UPDATE_SUPERADMIN_PERMISSIONS);
  const [toggleActive] = useMutation(TOGGLE_APP_USER_ACTIVE);
  const [updateNotifEmail] = useMutation(UPDATE_NOTIFICATION_EMAIL);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [newPerms, setNewPerms] = useState<Record<string, boolean>>(() => {
    const all: Record<string, boolean> = {};
    ALL_PERMISSIONS.forEach((p) => (all[p] = true));
    return all;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<Record<string, boolean>>({});
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editNotifEmail, setEditNotifEmail] = useState("");

  const admins = (data?.allAppUsers || []).filter((u: any) => u.role === "SUPERADMIN");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !email || !password || !phone) {
      setError("Preencha todos os campos");
      return;
    }
    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    setSaving(true);
    try {
      await registerSuperadmin({
        variables: {
          name,
          email,
          password,
          phone,
          permissions: JSON.stringify(newPerms),
        },
      });
      setSuccess("Super admin cadastrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setShowForm(false);
      const allPerms: Record<string, boolean> = {};
      ALL_PERMISSIONS.forEach((p) => (allPerms[p] = true));
      setNewPerms(allPerms);
      refetch();
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
    }
    setSaving(false);
  }

  async function handleSavePermissions(userId: string) {
    setSaving(true);
    try {
      await updatePermissions({
        variables: { id: userId, permissions: JSON.stringify(editPerms) },
      });
      setEditingId(null);
      refetch();
    } catch (err: any) {
      alert("Erro ao salvar permissoes: " + err.message);
    }
    setSaving(false);
  }

  async function handleSaveNotifEmail(userId: string) {
    setSaving(true);
    try {
      await updateNotifEmail({ variables: { email: editNotifEmail } });
      setEditingEmailId(null);
      refetch();
    } catch (err: any) {
      alert("Erro ao salvar email: " + err.message);
    }
    setSaving(false);
  }

  async function handleToggleActive(userId: string) {
    await toggleActive({ variables: { id: userId } });
    refetch();
  }

  if (loading) return <p className="text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Configuracoes</h1>

      {/* Section: Super Admins */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Super Admins ({admins.length})
          </h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-purple-700 transition"
          >
            {showForm ? "Cancelar" : "+ Novo Super Admin"}
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 bg-green-500/20 text-green-400 rounded-xl text-sm">
            {success}
          </div>
        )}

        {/* Register form */}
        {showForm && (
          <form
            onSubmit={handleRegister}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6"
          >
            <h3 className="text-white font-semibold mb-4">Cadastrar novo Super Admin</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Permissions for new admin */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Permissoes</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {ALL_PERMISSIONS.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newPerms[perm] ?? false}
                      onChange={(e) =>
                        setNewPerms({ ...newPerms, [perm]: e.target.checked })
                      }
                      className="rounded accent-purple-500"
                    />
                    {PERMISSION_LABELS[perm]}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    ALL_PERMISSIONS.forEach((p) => (all[p] = true));
                    setNewPerms(all);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  Marcar todos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const none: Record<string, boolean> = {};
                    ALL_PERMISSIONS.forEach((p) => (none[p] = false));
                    setNewPerms(none);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer"
                >
                  Desmarcar todos
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {saving ? "Salvando..." : "Cadastrar"}
            </button>
          </form>
        )}

        {/* Admin list */}
        <div className="space-y-4">
          {admins.map((admin: any) => {
            const perms = getPermissions(admin.permissions);
            const isEditing = editingId === admin.id;

            return (
              <div
                key={admin.id}
                className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {admin.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {admin.isActive ? "Ativo" : "Inativo"}
                      </span>
                      {!admin.permissions && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                          Admin Master
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 space-y-0.5">
                      <p>{admin.email}</p>
                      <p>{admin.phone}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">Email notificacao:</span>
                        {editingEmailId === admin.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="email"
                              value={editNotifEmail}
                              onChange={(e) => setEditNotifEmail(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSaveNotifEmail(admin.id)}
                              className="px-2 py-0.5 bg-gray-700 text-white rounded text-xs border border-gray-600 focus:outline-none focus:border-purple-500 w-48"
                              placeholder="email@exemplo.com"
                            />
                            <button onClick={() => handleSaveNotifEmail(admin.id)} className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer">Salvar</button>
                            <button onClick={() => setEditingEmailId(null)} className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer">X</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingEmailId(admin.id); setEditNotifEmail(admin.notificationEmail || ""); }}
                            className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                          >
                            {admin.notificationEmail || "Nao configurado — clique para definir"}
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs">
                        Cadastro:{" "}
                        {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {/* Current permissions display */}
                    {!isEditing && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {ALL_PERMISSIONS.map((perm) => (
                          <span
                            key={perm}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              perms[perm]
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-gray-700 text-gray-600"
                            }`}
                          >
                            {PERMISSION_LABELS[perm]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setEditingId(null);
                        } else {
                          setEditingId(admin.id);
                          setEditPerms(getPermissions(admin.permissions));
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-semibold cursor-pointer hover:bg-purple-600/30 transition"
                    >
                      {isEditing ? "Cancelar" : "Editar permissoes"}
                    </button>
                    <button
                      onClick={() => handleToggleActive(admin.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        admin.isActive
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      }`}
                    >
                      {admin.isActive ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>

                {/* Edit permissions panel */}
                {isEditing && (
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-xl">
                    <p className="text-sm font-medium text-gray-300 mb-3">
                      Editar permissoes
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                      {ALL_PERMISSIONS.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editPerms[perm] ?? false}
                            onChange={(e) =>
                              setEditPerms({
                                ...editPerms,
                                [perm]: e.target.checked,
                              })
                            }
                            className="rounded accent-purple-500"
                          />
                          {PERMISSION_LABELS[perm]}
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          const all: Record<string, boolean> = {};
                          ALL_PERMISSIONS.forEach((p) => (all[p] = true));
                          setEditPerms(all);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Marcar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const none: Record<string, boolean> = {};
                          ALL_PERMISSIONS.forEach((p) => (none[p] = false));
                          setEditPerms(none);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer"
                      >
                        Desmarcar todos
                      </button>
                    </div>
                    <button
                      onClick={() => handleSavePermissions(admin.id)}
                      disabled={saving}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {saving ? "Salvando..." : "Salvar permissoes"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {admins.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Nenhum super admin encontrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
