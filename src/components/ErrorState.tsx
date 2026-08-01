"use client";

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  /** Linha principal: o que nao foi possivel carregar. */
  title?: string;
  /** Linha de apoio: o que o admin pode fazer. */
  description?: string;
  /** Se informado, mostra o botao "Tentar novamente". */
  onRetry?: () => void;
}

/**
 * Estado de erro de carregamento (query falhou).
 *
 * Existe para que uma query com erro nunca caia no estado vazio: sem isto,
 * `loading` vira false, `data` fica undefined e a tela mostra "Nenhum pedido
 * encontrado" ou "R$ 0,00" de receita — o admin acha que os dados sumiram.
 * Sempre renderizar ANTES do empty state.
 */
export default function ErrorState({
  title = "Nao foi possivel carregar os dados.",
  description = "Verifique sua conexao e tente novamente.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-8 border border-red-800/50 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" strokeWidth={1.5} />
      <p className="text-white font-semibold">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
