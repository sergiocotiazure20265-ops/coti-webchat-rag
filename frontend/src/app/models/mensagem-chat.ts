import { RagResponse } from './rag-response';
export interface MensagemChat {
  autor: 'usuario' | 'agente';
  texto: string;
  dataHora: Date;
  detalhes?: RagResponse;
}
