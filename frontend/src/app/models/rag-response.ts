export type AssuntoAtendimento = 'CURSO' | 'VALOR' | 'HORARIO' | 'INSCRICAO' | 'CERTIFICADO' | 'SUPORTE' | 'OUTRO';
export interface AtendimentoResponse {
  assunto: AssuntoAtendimento;
  mensagem: string;
  curso: string | null;
  interesseIdentificado: boolean;
  encaminharParaAtendente: boolean;
  informacaoEncontrada: boolean;
}
export interface RagResponse {
  atendimento: AtendimentoResponse;
  tokensEntrada: number;
  tokensSaida: number;
  totalTokens: number;
  custoEstimado: number;
}
