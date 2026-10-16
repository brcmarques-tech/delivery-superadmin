"use client";

import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import ErrorState from "@/components/ErrorState";
import { POLL_BACKGROUND, skipPollWhenHidden } from "@/lib/polling";

/**
 * REPASSES RETIDOS — o dinheiro que a plataforma deve e que não aparecia.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTA TELA EXISTE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Em dois caminhos o dinheiro de um pedido concluído fica retido na plataforma
 * em vez de ir para quem é de direito:
 *
 *   ENTREGADOR — no PIX com split-on-charge ele não entra na divisão da
 *   cobrança, porque só é conhecido no READY, depois de o pagamento já ter
 *   sido dividido. O frete dele fica com a plataforma e o repasse é manual.
 *
 *   LOJISTA — quando a transferência é recusada por bloqueio de origem
 *   (allowlist de IP do Pagar.me, KAN-299). O repasse FOI tentado; o provedor
 *   recusou por configuração nossa.
 *
 * Os dois existiam apenas como marcador de texto em `notes`. Dava para achar
 * com LIKE e não dava para somar. Na prática a plataforma não sabia quanto
 * devia, nem a quem — e quem não sabe quanto deve, não paga.
 *
 * A tela mostra o TOTAL em aberto em primeiro lugar de propósito: é o número
 * que diz se isto está sob controle ou virando uma bola de neve.
 *
 * Dar baixa aqui é registro de um pagamento feito POR FORA (PIX manual), não
 * uma ordem de pagamento. Enquanto não existir PIX-out (KAN-300), é assim que
 * esse dinheiro sai. O texto do botão diz isso, para ninguém achar que clicar
 * transfere.
 */

const DELIVERER_PAYABLES = gql`
  query DelivererPayables($apenasAbertos: Boolean) {
    delivererPayables(apenasAbertos: $apenasAbertos) {
      id
      orderNumber
      total
      deliveryFee
      completedAt
      delivererPayableCents
      delivererPayablePaidAt
      store {
        id
        name
      }
      delivery {
        id
        deliverer {
          id
          name
          phone
        }
      }
    }
  }
`;

const VENDOR_PAYABLES = gql`
  query VendorPayables($apenasAbertos: Boolean) {
    vendorPayables(apenasAbertos: $apenasAbertos) {
      id
      orderNumber
      total
      completedAt
      vendorPayableCents
      vendorPayablePaidAt
      store {
        id
        name
        owner {
          id
          name
          phone
        }
      }
    }
  }
`;

const BAIXA_ENTREGADOR = gql`
  mutation MarkDelivererPayablePaid($orderId: String!) {
    markDelivererPayablePaid(orderId: $orderId) {
      id
      delivererPayablePaidAt
    }
  }
`;

const BAIXA_LOJISTA = gql`
  mutation MarkVendorPayablePaid($orderId: String!) {
    markVendorPayablePaid(orderId: $orderId) {
      id
      vendorPayablePaidAt
    }
  }
`;

const brl = (centavos?: number | null) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    (Number(centavos) || 0) / 100,
  );

const dia = (d?: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "—");

export default function RepassesPage() {
  const [aba, setAba] = useState<"entregador" | "lojista">("entregador");
  const [apenasAbertos, setApenasAbertos] = useState(true);
  const [baixando, setBaixando] = useState<string | null>(null);
  const [erroBaixa, setErroBaixa] = useState<string | null>(null);

  const ent = useQuery(DELIVERER_PAYABLES, {
    variables: { apenasAbertos },
    pollInterval: POLL_BACKGROUND,
    ...skipPollWhenHidden,
  });
  const loj = useQuery(VENDOR_PAYABLES, {
    variables: { apenasAbertos },
    pollInterval: POLL_BACKGROUND,
    ...skipPollWhenHidden,
  });

  const [baixaEntregador] = useMutation(BAIXA_ENTREGADOR);
  const [baixaLojista] = useMutation(BAIXA_LOJISTA);

  const listaEnt = ent.data?.delivererPayables || [];
  const listaLoj = loj.data?.vendorPayables || [];

  const somaEnt = listaEnt
    .filter((o: any) => !o.delivererPayablePaidAt)
    .reduce((s: number, o: any) => s + (Number(o.delivererPayableCents) || 0), 0);
  const somaLoj = listaLoj
    .filter((o: any) => !o.vendorPayablePaidAt)
    .reduce((s: number, o: any) => s + (Number(o.vendorPayableCents) || 0), 0);

  async function darBaixa(orderId: string, tipo: "entregador" | "lojista") {
    if (baixando) return;
    setBaixando(orderId);
    setErroBaixa(null);
    try {
      if (tipo === "entregador") {
        await baixaEntregador({ variables: { orderId } });
        await ent.refetch();
      } else {
        await baixaLojista({ variables: { orderId } });
        await loj.refetch();
      }
    } catch (e: any) {
      // A mensagem do servidor vai literal: ela distingue "ja foi baixado" de
      // "nao existe", e as duas pedem reacoes diferentes de quem concilia.
      setErroBaixa(e?.graphQLErrors?.[0]?.message || e?.message || "Não deu para dar baixa.");
    } finally {
      setBaixando(null);
    }
  }

  const erro = ent.error || loj.error;
  if (erro) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Repasses retidos</h1>
        <ErrorState
          title="Não deu para carregar os repasses retidos"
          description={erro.message}
          onRetry={() => { ent.refetch(); loj.refetch(); }}
        />
      </div>
    );
  }

  const carregando = (aba === "entregador" ? ent.loading : loj.loading) && !ent.data && !loj.data;
  const lista: any[] = aba === "entregador" ? listaEnt : listaLoj;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-1">Repasses retidos</h1>
      <p className="text-sm text-gray-400 mb-5">
        Dinheiro de pedidos concluídos que ficou com a plataforma e é devido a terceiros.
      </p>

      {/* O total em aberto vem antes da lista: e o numero que diz se isto
          esta sob controle ou virando bola de neve. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Devido a entregadores</p>
          <p className="text-2xl font-bold text-amber-400">{brl(somaEnt)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {listaEnt.filter((o: any) => !o.delivererPayablePaidAt).length} pedido(s) em aberto
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Devido a lojistas</p>
          <p className="text-2xl font-bold text-amber-400">{brl(somaLoj)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {listaLoj.filter((o: any) => !o.vendorPayablePaidAt).length} pedido(s) em aberto
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setAba("entregador")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            aba === "entregador" ? "bg-white/15 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Entregadores ({listaEnt.length})
        </button>
        <button
          onClick={() => setAba("lojista")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            aba === "lojista" ? "bg-white/15 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Lojistas ({listaLoj.length})
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={apenasAbertos}
            onChange={(e) => setApenasAbertos(e.target.checked)}
            className="accent-amber-400"
          />
          só em aberto
        </label>
      </div>

      {/* Por que cada caso esta retido. Sem isto a tela parece uma lista de
          falhas, e nao duas situacoes com causas e saidas diferentes. */}
      <p className="text-xs text-gray-500 mb-4">
        {aba === "entregador"
          ? "No PIX com split na cobrança o entregador não entra na divisão — ele só é conhecido no READY, depois de o pagamento já ter sido dividido. O frete dele fica retido e o repasse é manual."
          : "A transferência foi tentada e o provedor recusou por bloqueio de origem (allowlist de IP do Pagar.me). Liberar o IP destrava estes casos e também a antecipação — ver KAN-299."}
      </p>

      {erroBaixa && (
        <p className="text-sm text-red-400 mb-3 rounded-xl bg-red-500/10 p-3">{erroBaixa}</p>
      )}

      {carregando ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : lista.length === 0 ? (
        <p className="text-gray-400 text-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          {apenasAbertos
            ? "Nenhum repasse em aberto. Nada devido neste momento."
            : "Nenhum repasse registrado."}
        </p>
      ) : (
        <div className="space-y-2">
          {lista.map((o: any) => {
            const ehEntregador = aba === "entregador";
            const centavos = ehEntregador ? o.delivererPayableCents : o.vendorPayableCents;
            const pagoEm = ehEntregador ? o.delivererPayablePaidAt : o.vendorPayablePaidAt;
            const quem = ehEntregador ? o.delivery?.deliverer : o.store?.owner;
            return (
              <div
                key={o.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm">
                    #{o.orderNumber}
                    <span className="text-gray-500 font-normal"> · {o.store?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {quem?.name || "—"}
                    {quem?.phone ? ` · ${quem.phone}` : ""}
                    {" · concluído em "}
                    {dia(o.completedAt)}
                  </p>
                </div>
                <p className="text-lg font-bold text-amber-400 whitespace-nowrap">{brl(centavos)}</p>
                {pagoEm ? (
                  <span className="text-xs text-emerald-400 whitespace-nowrap">
                    baixado em {dia(pagoEm)}
                  </span>
                ) : (
                  <button
                    onClick={() => darBaixa(o.id, aba)}
                    disabled={baixando === o.id}
                    // O texto diz "registrar", nao "pagar": clicar NAO
                    // transfere dinheiro. Enquanto nao existir PIX-out
                    // (KAN-300) o pagamento sai por fora, e isto e so a baixa.
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    title="Registra que o pagamento já foi feito por fora. Não transfere dinheiro."
                  >
                    {baixando === o.id ? "Registrando..." : "Registrar como pago"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
