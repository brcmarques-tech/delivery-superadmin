"use client";

import { useQuery, gql } from "@apollo/client";

/**
 * A EVIDÊNCIA DE UMA ENTREGA, na aba de disputas.
 *
 * Por que isto existe: a aba mostrava só `disputeReason` — o que o CLIENTE
 * escreveu. Quem decide via um lado da história e tinha de escolher no escuro.
 *
 * E a escolha é cara nos dois sentidos. Recuperar repasse já feito é
 * impossível (KAN-303): decidir a favor do cliente depois de o dinheiro sair
 * sai do bolso da plataforma. Decidir a favor do vendedor sem evidência manda
 * embora um cliente que pode estar certo.
 *
 * NENHUM CÓDIGO APARECE AQUI, nem para o superadmin. O que decide a disputa é
 * SE e QUANDO cada código foi registrado, com qual GPS, não qual era o número.
 * A query `evidenciaDeEntrega` não devolve os valores — é a disciplina do tipo
 * no servidor, e não uma escolha desta tela.
 *
 * Para pedido SEM código (criado antes do deploy) não há o que mostrar, e o
 * componente não desenha nada: uma caixa vazia só faria quem decide procurar
 * uma informação que nunca existiu.
 */

const EVIDENCIA_DE_ENTREGA = gql`
  query EvidenciaDeEntrega($orderId: String!) {
    evidenciaDeEntrega(orderId: $orderId) {
      usaCodigo
      codigoDaLojaEm
      codigoDoEntregadorEm
      codigoDoClienteEm
      coletaLat
      coletaLng
      entregaLat
      entregaLng
      entregaSemCodigoEm
      entregaSemCodigoMotivo
      janelaDeContestacaoHoras
      janelaVenceEm
      tentativasErradas
      bloqueadoAte
      confirmadoPeloClienteEm
    }
  }
`;

const hora = (d?: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR") : null;

function Linha({
  rotulo,
  quando,
  ausente,
}: {
  rotulo: string;
  quando?: string | null;
  /** O que dizer quando não aconteceu. Dizer o que NÃO houve é metade da prova. */
  ausente: string;
}) {
  const q = hora(quando);
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-gray-400 text-xs">{rotulo}</span>
      <span className={`text-xs text-right ${q ? "text-gray-200" : "text-amber-400"}`}>
        {q || ausente}
      </span>
    </div>
  );
}

function Mapa({ lat, lng, rotulo }: { lat?: number | null; lng?: number | null; rotulo: string }) {
  if (lat == null || lng == null) {
    return (
      <div className="flex items-center justify-between gap-3 py-1">
        <span className="text-gray-400 text-xs">{rotulo}</span>
        <span className="text-xs text-amber-400">sem GPS registrado</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-gray-400 text-xs">{rotulo}</span>
      {/* Link para o mapa: a coordenada crua não diz nada a quem decide.
          Ver o ponto no mapa é o que responde "ele esteve mesmo lá?". */}
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-400 underline hover:text-blue-300"
      >
        {Number(lat).toFixed(5)}, {Number(lng).toFixed(5)} — ver no mapa
      </a>
    </div>
  );
}

export function EvidenciaDeEntrega({ orderId }: { orderId: string }) {
  const { data, loading, error } = useQuery(EVIDENCIA_DE_ENTREGA, {
    variables: { orderId },
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return <div className="h-24 animate-pulse rounded-xl bg-white/5 mb-3" />;
  }
  if (error) {
    return (
      <p className="text-xs text-amber-400 mb-3">
        Não deu para carregar a evidência desta entrega: {error.message}
      </p>
    );
  }

  const e = data?.evidenciaDeEntrega;
  if (!e || !e.usaCodigo) return null;

  const semCodigo = !!e.entregaSemCodigoEm;
  const janelaVenceu = e.janelaVenceEm ? new Date(e.janelaVenceEm) < new Date() : false;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3 mb-3">
      <p className="text-xs font-bold text-gray-300 mb-2">Evidência da entrega</p>

      <Linha
        rotulo="Código da loja registrado pelo entregador"
        quando={e.codigoDaLojaEm}
        ausente="nunca registrado"
      />
      <Linha
        rotulo="Código do entregador registrado pela loja"
        quando={e.codigoDoEntregadorEm}
        ausente="nunca registrado"
      />
      <Linha
        rotulo="Código do cliente registrado na entrega"
        quando={e.codigoDoClienteEm}
        ausente={semCodigo ? "não houve — entrega registrada sem código" : "nunca registrado"}
      />
      <Linha
        rotulo="Cliente confirmou o recebimento"
        quando={e.confirmadoPeloClienteEm}
        ausente="não confirmou"
      />

      <div className="border-t border-white/10 mt-2 pt-2">
        <Mapa lat={e.coletaLat} lng={e.coletaLng} rotulo="Onde o entregador estava na coleta" />
        <Mapa lat={e.entregaLat} lng={e.entregaLng} rotulo="Onde ele estava na entrega" />
      </div>

      {semCodigo && (
        <div className="border-t border-white/10 mt-2 pt-2">
          <p className="text-xs text-gray-400 mb-1">
            Entrega registrada SEM o código do cliente em {hora(e.entregaSemCodigoEm)}
          </p>
          {/* O texto do entregador em destaque: é a contraparte do
              `disputeReason` do cliente, e a disputa é entre os dois. */}
          <p className="text-xs text-gray-200 italic bg-white/5 rounded-lg p-2">
            &ldquo;{e.entregaSemCodigoMotivo}&rdquo;
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Janela de contestação: {e.janelaDeContestacaoHoras}h, {janelaVenceu ? "venceu" : "vence"} em{" "}
            {hora(e.janelaVenceEm)}
          </p>
        </div>
      )}

      {/* Tentativas erradas não provam má-fé — digitar errado acontece. Mas
          cinco tentativas num pedido contestado é um fato que quem decide tem
          de ver, então aparece em vez de ficar só no log. */}
      {e.tentativasErradas > 0 && (
        <p className="text-xs text-amber-400 mt-2">
          {e.tentativasErradas} tentativa(s) de código incorreto neste pedido
          {e.bloqueadoAte ? ` — bloqueado até ${hora(e.bloqueadoAte)}` : ""}
        </p>
      )}
    </div>
  );
}
