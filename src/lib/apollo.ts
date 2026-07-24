import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// KAN-258: o fallback silencioso para localhost era um risco real de deploy —
// se `NEXT_PUBLIC_API_URL` nao fosse injetada no build, o painel chamaria
// `localhost:3000` em producao e simplesmente nao carregaria nada, sem nenhuma
// pista de que a causa foi configuracao. Em producao agora falha ruidosamente
// no console e cai no dominio publico. (Mesma correcao ja aplicada no
// storefront.)
const API_URL = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[apollo] NEXT_PUBLIC_API_URL nao definida em producao — usando o dominio publico como fallback. Configure a variavel no deploy.',
    );
    return 'https://api.bcmtech.com.br/graphql';
  }
  return 'http://localhost:3000/graphql';
})();
const WS_URL = API_URL.replace(/^http/, 'ws');

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: WS_URL,
        connectionParams: () => {
          const token = localStorage.getItem('token');
          return { authorization: token ? `Bearer ${token}` : '' };
        },
      }),
    )
  : null;

// KAN-216: portado do vendor-panel. O superadmin (painel mais sensivel) rodava
// sem tratamento de erro nem retry — token expirado gerava falha silenciosa sem
// deslogar, e falha de rede nao tinha nova tentativa.
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (typeof window === 'undefined') return;
  const sessionExpired = graphQLErrors?.some(
    (e) => e.message?.includes('SESSION_EXPIRED') || e.extensions?.code === 'UNAUTHENTICATED'
  );
  if (sessionExpired && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    return;
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (!err.message?.includes('SESSION_EXPIRED') && err.extensions?.code !== 'UNAUTHENTICATED') {
        console.error(`[GraphQL Error]: ${err.message}`);
        if (typeof window !== 'undefined' && (window as any).__apolloErrorToast) {
          (window as any).__apolloErrorToast(err.message);
        }
      }
    }
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError.message}`);
  }
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
});

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink),
    )
  : authLink.concat(httpLink);

export const apolloClient = new ApolloClient({
  link: errorLink.concat(retryLink).concat(splitLink),
  cache: new InMemoryCache(),
});
