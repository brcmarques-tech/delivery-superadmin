"use client";

import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import ErrorState from "@/components/ErrorState";
import { POLL_BACKGROUND, skipPollWhenHidden } from "@/lib/polling";

/**
 * PAINEL FINANCEIRO (KAN-102)
 *
 * O que esta tela responde, e que antes não tinha onde olhar:
 *
 *   quanto ENTROU no período, quanto é da PLATAFORMA (comissão + frete das
 *   entregas feitas por entregador do app), quanto é das LOJAS, quanto ainda
 *   está em CUSTÓDIA (pago e não liquidado) e quanto está PARADO como dívida
 *   nossa porque o repasse não saiu.
 *
 * O painel geral já mostrava volume e "receita da plataforma" soltos; o que
 * faltava era a divisão — sem ela não dá para responder "a comissão está
 * cobrindo o custo?" nem "esta loja está no plano certo?".
 *
 * TRÊS CUIDADOS DE LEITURA, escritos na própria tela para ninguém decidir
 * errado olhando o número bonito:
 *
 *   1. só entra pedido PAGO. Pedido aguardando pagamento e cancelado ficam
 *      de fora — faturamento que não entrou não é faturamento;
 *   2. "em custódia" é dinheiro que ainda vai ser repassado, não lucro;
 *   3. a comissão aqui é a BRUTA. A taxa do Pagar.me sai dela, e quem fica
 *      com o resto (e com o arredondamento) é a plataforma.
 */
const PAINEL_FINANCEIRO = gql`
  query PainelFinanceiro($dias: Int) {
    painelFinanceiro(dias: $dias) {
      periodoDias
      resumo {
        pedidosPagos
        volumeVendido
        comissaoDaPlataforma
        freteTotal
        freteDaPlataforma
        parteDosVendedores
        emCustodia
      }
      repasses {
        vendedoresLiquidados
        vendedoresPendentes
        entregadoresLiquidados
        passivoDeVendedores
        passivoDeEntregadores
        passivoJaPago
      }
      porLoja {
        storeId
        storeName
        pedidos
        volume
        comissao
        parteDaLoja
        aReceber
        percentualMedioDeComissao
      }
      porDia {
        dia
        volume
        comissao
      }
    }
  }
`;

const PERIODOS = [
  { dias: 7, rotulo: "7 dias" },
  { dias: 30, rotulo: "30 dias" },
  { dias: 90, rotulo: "90 dias" },
  { dias: 365, rotulo: "1 ano" },
];

const dinheiro = (v: number) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Cartao({
  titulo,
  valor,
  detalhe,
  destaque,
}: {
  titulo: string;
  valor: string;
  detalhe?: string;
  destaque?: "bom" | "atencao" | "neutro";
}) {
  const cor =
    destaque === "bom"
      ? "text-emerald-400"
      : destaque === "atencao"
        ? "text-amber-400"
        : "text-white";
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{titulo}</p>
      <p className={`mt-1 text-2xl font-bold ${cor}`}>{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-gray-500">{detalhe}</p>}
    </div>
  );
}

export default function FinanceiroPage() {
  const [dias, setDias] = useState(30);
  const { data, loading, error, refetch } = useQuery(PAINEL_FINANCEIRO, {
    variables: { dias },
    pollInterval: POLL_BACKGROUND,
    ...skipPollWhenHidden,
  });

  if (error)
    return (
      <ErrorState
        title="Nao foi possivel carregar o financeiro."
        description="Os numeros do periodo nao vieram. Tente novamente."
        onRetry={() => { void refetch(); }}
      />
    );

  const painel = data?.painelFinanceiro;
  const r = painel?.resumo;
  const rep = painel?.repasses;
  const passivoAberto = (rep?.passivoDeVendedores || 0) + (rep?.passivoDeEntregadores || 0);
  const receitaDaPlataforma = (r?.comissaoDaPlataforma || 0) + (r?.freteDaPlataforma || 0);

  // Maior volume da lista, para a barra de participação ter escala.
  const maiorVolume = Math.max(1, ...(painel?.porLoja || []).map((l: any) => Number(l.volume)));
  const maiorDia = Math.max(1, ...(painel?.porDia || []).map((d: any) => Number(d.volume)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-sm text-gray-400">
            Somente pedidos <strong>pagos</strong> — aguardando pagamento e cancelados ficam de fora.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {PERIODOS.map((p) => (
            <button
              key={p.dias}
              onClick={() => setDias(p.dias)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                dias === p.dias ? "bg-white/15 text-white font-semibold" : "text-gray-400 hover:text-white"
              }`}
            >
              {p.rotulo}
            </button>
          ))}
        </div>
      </div>

      {loading && !painel ? (
        <p className="text-gray-400">Carregando…</p>
      ) : !painel ? (
        <p className="text-gray-400">Sem dados no período.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Cartao
              titulo="Volume vendido"
              valor={dinheiro(r.volumeVendido)}
              detalhe={`${r.pedidosPagos} pedido(s) pago(s)`}
            />
            <Cartao
              titulo="Receita da plataforma"
              valor={dinheiro(receitaDaPlataforma)}
              detalhe={`comissão ${dinheiro(r.comissaoDaPlataforma)} + frete ${dinheiro(r.freteDaPlataforma)}`}
              destaque="bom"
            />
            <Cartao
              titulo="Parte das lojas"
              valor={dinheiro(r.parteDosVendedores)}
              detalhe="total − comissão − frete das entregas pelo app"
            />
            <Cartao
              titulo="Em custódia"
              valor={dinheiro(r.emCustodia)}
              detalhe="pago e ainda não liquidado — não é lucro"
              destaque="neutro"
            />
          </div>

          {/* A dívida em aberto primeiro, como na tela de repasses: é o número
              que diz se isto está sob controle ou virando bola de neve. */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-white">Repasses</h2>
              <a href="/dashboard/repasses" className="text-xs text-cyan-400 hover:underline">
                ver retidos em detalhe →
              </a>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Cartao
                titulo="Dívida em aberto"
                valor={dinheiro(passivoAberto)}
                detalhe={`lojistas ${dinheiro(rep.passivoDeVendedores)} · entregadores ${dinheiro(rep.passivoDeEntregadores)}`}
                destaque={passivoAberto > 0 ? "atencao" : "bom"}
              />
              <Cartao titulo="Já pago por fora" valor={dinheiro(rep.passivoJaPago)} />
              <Cartao
                titulo="Lojistas liquidados"
                valor={String(rep.vendedoresLiquidados)}
                detalhe={`${rep.vendedoresPendentes} pendente(s)`}
              />
              <Cartao
                titulo="Entregadores liquidados"
                valor={String(rep.entregadoresLiquidados)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold text-white">Por loja</h2>
            <p className="text-xs text-gray-500 mb-3">
              O percentual médio cobrado denuncia loja no plano errado: FREE 5%, PRO 2%,
              PREMIUM e ENTERPRISE 0%.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-gray-400">
                  <tr>
                    <th className="py-2 pr-3">Loja</th>
                    <th className="py-2 pr-3 text-right">Pedidos</th>
                    <th className="py-2 pr-3 text-right">Volume</th>
                    <th className="py-2 pr-3 text-right">Comissão</th>
                    <th className="py-2 pr-3 text-right">% médio</th>
                    <th className="py-2 pr-3 text-right">Parte da loja</th>
                    <th className="py-2 text-right">A receber</th>
                  </tr>
                </thead>
                <tbody>
                  {painel.porLoja.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-gray-500">
                        Nenhuma venda paga no período.
                      </td>
                    </tr>
                  )}
                  {painel.porLoja.map((l: any) => (
                    <tr key={l.storeId} className="border-t border-white/5">
                      <td className="py-2 pr-3">
                        <div className="text-white">{l.storeName}</div>
                        <div className="mt-1 h-1 rounded bg-white/10">
                          <div
                            className="h-1 rounded bg-cyan-500"
                            style={{ width: `${Math.max(2, (Number(l.volume) / maiorVolume) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-right text-gray-300">{l.pedidos}</td>
                      <td className="py-2 pr-3 text-right text-white">{dinheiro(l.volume)}</td>
                      <td className="py-2 pr-3 text-right text-emerald-400">{dinheiro(l.comissao)}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">
                        {Number(l.percentualMedioDeComissao).toFixed(2)}%
                      </td>
                      <td className="py-2 pr-3 text-right text-gray-300">{dinheiro(l.parteDaLoja)}</td>
                      <td
                        className={`py-2 text-right ${Number(l.aReceber) > 0 ? "text-amber-400" : "text-gray-500"}`}
                      >
                        {dinheiro(l.aReceber)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold text-white mb-3">Volume por dia</h2>
            {painel.porDia.length === 0 ? (
              <p className="text-gray-500 text-sm">Sem vendas no período.</p>
            ) : (
              // Um unico dia com flex-1 virava um retangulo cheio ocupando a
              // largura toda — parecia erro de render, nao um grafico. Barra
              // com largura maxima e alinhada a esquerda resolve sem depender
              // de quantos dias o periodo trouxe.
              <div className="flex items-end justify-start gap-1 h-32">
                {painel.porDia.map((d: any) => (
                  <div key={d.dia} className="group relative flex-1 min-w-[6px] max-w-[48px]">
                    <div
                      className="w-full rounded-t bg-cyan-600/70 group-hover:bg-cyan-400 transition"
                      style={{ height: `${Math.max(2, (Number(d.volume) / maiorDia) * 120)}px` }}
                    />
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white group-hover:block">
                      {d.dia}: {dinheiro(d.volume)} · comissão {dinheiro(d.comissao)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
