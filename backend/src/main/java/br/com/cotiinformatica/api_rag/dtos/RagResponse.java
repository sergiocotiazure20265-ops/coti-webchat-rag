package br.com.cotiinformatica.api_rag.dtos;

public record RagResponse(
        AtendimentoResponse atendimento,
        Integer tokensEntrada,
        Integer tokensSaida,
        Integer totalTokens,
        Double custoEstimado
) {
}
