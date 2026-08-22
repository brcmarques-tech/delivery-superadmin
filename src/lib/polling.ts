// KAN-246: opções de polling compartilhadas.
//
// Várias telas do superadmin faziam `pollInterval` sobre queries `GET_ALL_*`
// sem paginação — `GET_ALL_ORDERS` e `GET_ALL_DELIVERIES` recarregavam a
// coleção inteira a cada 15s. Com a aba aberta o dia todo (que é o normal num
// painel de operação), isso é carga constante no backend e tráfego repetido de
// payloads grandes mesmo quando nada mudou e ninguém está olhando.
//
// `skipPollAttempt` (Apollo 3.9+) deixa pular a rodada quando a aba está em
// segundo plano. Não muda o comportamento percebido: ao voltar para a aba, o
// próximo ciclo busca os dados atualizados.
//
// Isto é mitigação, não a solução final — a correta é paginação/filtro no
// servidor (KAN-245) e subscriptions no lugar de polling onde há tempo real.

/** Intervalo para telas operacionais (pedidos, entregas). */
export const POLL_OPERATIONAL = 30000;

/** Intervalo para telas de consulta (financeiro, cupons, dashboard). */
export const POLL_BACKGROUND = 60000;

/**
 * Espalhe em `useQuery` junto do `pollInterval` para não pollar com a aba
 * em segundo plano.
 */
export const skipPollWhenHidden = {
  skipPollAttempt: () => typeof document !== 'undefined' && document.hidden,
};
