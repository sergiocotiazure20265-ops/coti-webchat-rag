# Especificação do Projeto — app-webchat

## 1. Visão geral

O **app-webchat** será uma aplicação frontend desenvolvida em **Angular** para fornecer uma interface de chat web para a API **api-rag**.

O usuário deverá informar seu nome e enviar perguntas por meio de uma interface semelhante a um chat. O frontend enviará essas informações para a API RAG e exibirá a resposta devolvida pelo agente de IA.

A aplicação Angular não deverá acessar diretamente a OpenAI, banco de dados, MongoDB, PostgreSQL ou qualquer outro recurso utilizado internamente pela API. Toda a comunicação relacionada à IA deverá ocorrer exclusivamente por meio da **api-rag**.

---

## 2. Objetivo

Construir uma interface web simples, moderna e responsiva que permita:

- identificar o usuário pelo nome;
- enviar perguntas para o agente de IA;
- exibir a pergunta do usuário no histórico do chat;
- exibir a resposta retornada pela API;
- manter o histórico visual da conversa enquanto a página estiver aberta;
- indicar visualmente quando a aplicação estiver aguardando a resposta da API;
- informar erros de comunicação de forma amigável;
- opcionalmente exibir informações técnicas da resposta, como assunto, tokens utilizados e custo estimado.

---

## 3. Tecnologias

O projeto deverá utilizar:

- Angular;
- TypeScript;
- componentes standalone;
- Angular HttpClient;
- Angular Forms ou Reactive Forms;
- HTML;
- CSS;
- Signals para controle simples de estado, quando conveniente.

Não é necessário instalar bibliotecas externas de componentes para a primeira versão.

---

## 4. Nome do projeto

```text
app-webchat
```

---

## 5. Backend utilizado

A aplicação consumirá a API:

```text
api-rag
```

A API fornecida está configurada para executar em:

```text
http://localhost:8081
```

Endpoint principal do chat:

```http
POST /api/rag
```

Durante o desenvolvimento, recomenda-se utilizar um proxy do Angular para evitar problemas de CORS.

URL utilizada pelo frontend com proxy:

```text
/api/rag
```

---

## 6. Contrato da API

### 6.1 Requisição

Método:

```http
POST
```

Endpoint:

```text
/api/rag
```

Content-Type:

```text
application/json
```

Corpo da requisição:

```json
{
  "nomeUsuario": "Sergio",
  "pergunta": "Tem curso de Java?"
}
```

### 6.2 Interface TypeScript da requisição

```ts
export interface RagRequest {
  nomeUsuario: string;
  pergunta: string;
}
```

---

## 7. Resposta da API

A API retorna uma resposta semelhante a:

```json
{
  "atendimento": {
    "assunto": "CURSO",
    "mensagem": "Olá Sergio! Temos curso de Java disponível...",
    "curso": "Java WebDeveloper",
    "interesseIdentificado": true,
    "encaminharParaAtendente": false,
    "informacaoEncontrada": true
  },
  "tokensEntrada": 850,
  "tokensSaida": 120,
  "totalTokens": 970,
  "custoEstimado": 0.0004525
}
```

### 7.1 Interface de atendimento

```ts
export interface AtendimentoResponse {
  assunto: AssuntoAtendimento;
  mensagem: string;
  curso: string | null;
  interesseIdentificado: boolean;
  encaminharParaAtendente: boolean;
  informacaoEncontrada: boolean;
}
```

### 7.2 Assuntos possíveis

```ts
export type AssuntoAtendimento =
  | 'CURSO'
  | 'VALOR'
  | 'HORARIO'
  | 'INSCRICAO'
  | 'CERTIFICADO'
  | 'SUPORTE'
  | 'OUTRO';
```

### 7.3 Interface da resposta completa

```ts
export interface RagResponse {
  atendimento: AtendimentoResponse;
  tokensEntrada: number;
  tokensSaida: number;
  totalTokens: number;
  custoEstimado: number;
}
```

---

## 8. Estrutura sugerida do projeto Angular

```text
src/
└── app/
    ├── components/
    │   └── chat/
    │       ├── chat.component.ts
    │       ├── chat.component.html
    │       └── chat.component.css
    │
    ├── models/
    │   ├── rag-request.ts
    │   ├── rag-response.ts
    │   └── mensagem-chat.ts
    │
    ├── services/
    │   └── rag.service.ts
    │
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.css
    └── app.config.ts
```

O projeto poderá ser simplificado durante a aula, mas deve preservar a separação entre:

- componente;
- serviço HTTP;
- modelos/interfaces.

---

## 9. Modelo interno das mensagens do chat

O frontend deverá possuir um modelo próprio para representar as mensagens exibidas na tela.

```ts
export interface MensagemChat {
  autor: 'usuario' | 'agente';
  texto: string;
  dataHora: Date;
  detalhes?: {
    assunto?: string;
    tokens?: number;
    custoEstimado?: number;
    encaminharParaAtendente?: boolean;
  };
}
```

Esse modelo é apenas do frontend e não precisa existir na API.

---

## 10. Serviço de comunicação com a API

Criar o serviço:

```text
RagService
```

Responsabilidade:

- receber os dados informados no componente;
- realizar o POST para `/api/rag`;
- enviar um objeto `RagRequest`;
- retornar um `Observable<RagResponse>`.

Assinatura esperada:

```ts
perguntar(request: RagRequest): Observable<RagResponse>
```

O componente não deverá utilizar `HttpClient` diretamente.

---

## 11. Tela principal

A aplicação possuirá uma única tela principal de chat.

Estrutura visual sugerida:

```text
+--------------------------------------------------+
|                  COTI WebChat                    |
|          Atendimento com Inteligência Artificial|
+--------------------------------------------------+
| Seu nome: [ Sergio                            ]  |
+--------------------------------------------------+
|                                                  |
|              Olá! Como posso ajudar?             |
|                                                  |
|                       Tem curso de Java?          |
|                                                  |
| Temos curso de Java disponível...                |
|                                                  |
|                       Qual é o horário?           |
|                                                  |
| O curso acontece...                              |
|                                                  |
+--------------------------------------------------+
| [ Digite sua pergunta...                     ]   |
|                                      [ Enviar ]  |
+--------------------------------------------------+
```

---

## 12. Cabeçalho

O cabeçalho deverá apresentar:

Título:

```text
COTI WebChat
```

Subtítulo:

```text
Atendimento com Inteligência Artificial
```

Opcionalmente poderá apresentar um indicador:

```text
● Online
```

---

## 13. Identificação do usuário

Antes de enviar uma pergunta, o usuário deverá informar seu nome.

Campo:

```text
Seu nome
```

Exemplo:

```text
Sergio
```

Regras:

- obrigatório;
- não permitir envio contendo apenas espaços;
- armazenar o valor enquanto a aplicação estiver aberta;
- não solicitar o nome novamente a cada mensagem;
- o valor deverá ser enviado em todas as requisições através de `nomeUsuario`.

Importante: a API utiliza o nome do usuário para recuperar as últimas conversas armazenadas no MongoDB. Portanto, o frontend deverá reutilizar exatamente o mesmo nome durante a conversa.

---

## 14. Área de mensagens

A área central deverá exibir as mensagens em ordem cronológica.

### Mensagem do usuário

Características:

- alinhada à direita;
- formato de balão;
- texto da pergunta;
- visual diferente da mensagem do agente.

### Mensagem do agente

Características:

- alinhada à esquerda;
- formato de balão;
- utilizar `response.atendimento.mensagem` como texto principal;
- não exibir o JSON bruto para o usuário.

---

## 15. Campo de pergunta

Na parte inferior deverá existir:

- campo de texto para a pergunta;
- botão `Enviar`.

Placeholder sugerido:

```text
Digite sua pergunta...
```

Exemplos:

```text
Tem curso de Java?
```

```text
Qual é o valor do curso?
```

```text
Quero me matricular no curso de Java.
```

---

## 16. Envio da mensagem

Quando o usuário clicar em `Enviar` ou pressionar `Enter`, executar o seguinte fluxo:

1. validar o nome;
2. validar a pergunta;
3. adicionar imediatamente a mensagem do usuário ao histórico visual;
4. limpar o campo de pergunta;
5. ativar o estado de carregamento;
6. criar o objeto `RagRequest`;
7. executar `RagService.perguntar()`;
8. aguardar a resposta da API;
9. adicionar `response.atendimento.mensagem` como mensagem do agente;
10. salvar os metadados da resposta na mensagem, quando necessário;
11. desativar o carregamento;
12. posicionar a área de conversa na mensagem mais recente.

---

## 17. Estado de carregamento

Enquanto a API estiver processando a pergunta, mostrar uma mensagem como:

```text
Assistente está digitando...
```

ou uma animação simples com três pontos:

```text
● ● ●
```

Durante esse período:

- o botão de envio deverá permanecer desabilitado;
- evitar o envio duplicado da mesma pergunta.

---

## 18. Tratamento de erros

Se a API estiver indisponível ou ocorrer erro HTTP, o frontend deverá:

- remover o estado de carregamento;
- manter a pergunta enviada no histórico;
- adicionar uma mensagem amigável do sistema/agente.

Mensagem sugerida:

```text
Não foi possível entrar em contato com o atendimento neste momento. Tente novamente em alguns instantes.
```

O usuário não deverá visualizar stack traces ou mensagens técnicas do backend.

---

## 19. Informações adicionais da resposta

A primeira versão poderá exibir apenas:

```ts
response.atendimento.mensagem
```

Para fins didáticos, poderá existir uma pequena área expansível chamada:

```text
Detalhes da resposta
```

Essa área poderá exibir:

- assunto;
- curso identificado;
- informação encontrada;
- necessidade de encaminhamento para atendente;
- tokens de entrada;
- tokens de saída;
- total de tokens;
- custo estimado.

Exemplo:

```text
Assunto: CURSO
Tokens: 970
Custo estimado: US$ 0.00045
```

Essas informações são opcionais para o usuário final, mas são úteis durante aulas e demonstrações.

---

## 20. Encaminhamento para atendente

Quando:

```ts
response.atendimento.encaminharParaAtendente === true
```

o frontend poderá exibir uma indicação visual abaixo da mensagem:

```text
Esta solicitação poderá ser encaminhada para um atendente.
```

O frontend não deverá criar regras próprias para decidir quando encaminhar. A decisão deverá vir da API.

---

## 21. Informação não encontrada

Quando:

```ts
response.atendimento.informacaoEncontrada === false
```

o frontend deverá continuar exibindo normalmente a mensagem produzida pela API.

Não deverá inventar uma resposta adicional nem executar uma nova chamada automaticamente.

---

## 22. Interesse identificado

Quando:

```ts
response.atendimento.interesseIdentificado === true
```

o frontend poderá mostrar discretamente um indicador como:

```text
Interesse identificado
```

Essa funcionalidade deverá ser apenas visual. As ações relacionadas à matrícula permanecem sob responsabilidade da API e das ferramentas utilizadas pelo agente.

---

## 23. Memória conversacional

O Angular manterá o histórico visual das mensagens enquanto a página estiver aberta.

Entretanto, a memória conversacional oficial está no backend.

A API atualmente busca as últimas conversas do usuário e utiliza essas informações na composição do prompt.

Portanto:

- o frontend não deverá reenviar todo o histórico para cada pergunta;
- deverá enviar apenas `nomeUsuario` e `pergunta`;
- o backend continuará responsável pela memória persistida.

---

## 24. Segurança

### 24.1 Chave da OpenAI

A aplicação Angular **nunca deverá possuir uma chave da OpenAI**.

Não criar arquivos como:

```text
environment.ts
```

contendo uma chave da OpenAI para uso no navegador.

A arquitetura correta é:

```text
Angular
   |
   | HTTP
   v
api-rag
   |
   | acesso protegido no backend
   v
OpenAI
```

### 24.2 Dados retornados

Exibir somente informações necessárias para a interface.

Não exibir:

- prompts internos;
- documentos completos utilizados pelo RAG;
- credenciais;
- connection strings;
- chaves de API;
- stack traces do servidor.

---

## 25. Proxy do Angular

Como o Angular normalmente executará em uma porta diferente da API, criar:

```text
proxy.conf.json
```

Configuração esperada:

```json
{
  "/api": {
    "target": "http://localhost:8081",
    "secure": false,
    "changeOrigin": true
  }
}
```

Dessa forma o Angular poderá chamar:

```text
/api/rag
```

sem colocar `http://localhost:8081` diretamente no serviço.

A execução local deverá utilizar o proxy.

Exemplo:

```bash
ng serve --proxy-config proxy.conf.json
```

---

## 26. Estado da aplicação

O componente poderá controlar o estado usando Signals.

Estados sugeridos:

```ts
nomeUsuario
pergunta
mensagens
carregando
```

Exemplo conceitual:

```ts
nomeUsuario = signal('');
pergunta = signal('');
mensagens = signal<MensagemChat[]>([]);
carregando = signal(false);
```

---

## 27. Responsabilidades do ChatComponent

O `ChatComponent` deverá:

- capturar nome do usuário;
- capturar pergunta;
- validar campos;
- controlar lista de mensagens;
- controlar carregamento;
- chamar `RagService`;
- converter a resposta da API em mensagem visual;
- tratar erros;
- limpar o campo após o envio.

Ele não deverá:

- acessar a OpenAI diretamente;
- acessar MongoDB ou PostgreSQL;
- gerar embeddings;
- implementar RAG;
- implementar memória persistente;
- calcular regras de matrícula;
- decidir sozinho quando encaminhar para atendente.

Essas responsabilidades pertencem à `api-rag`.

---

## 28. Responsabilidades do RagService

O `RagService` deverá possuir somente a responsabilidade de comunicação HTTP com a API.

Exemplo esperado:

```ts
@Injectable({
  providedIn: 'root'
})
export class RagService {

  private readonly endpoint = '/api/rag';

  constructor(private http: HttpClient) {}

  perguntar(request: RagRequest): Observable<RagResponse> {
    return this.http.post<RagResponse>(this.endpoint, request);
  }
}
```

---

## 29. Aparência da interface

O layout deverá ser:

- limpo;
- profissional;
- responsivo;
- centralizado;
- semelhante a aplicações modernas de chat;
- fácil de compreender durante uma aula.

Sugestões:

- fundo geral em cinza muito claro;
- painel central branco;
- cabeçalho destacado;
- mensagens do usuário e agente em balões diferentes;
- largura máxima aproximada de 900px;
- área de mensagens com rolagem vertical;
- campo de envio fixado visualmente na parte inferior do painel.

---

## 30. Responsividade

A aplicação deverá funcionar em:

- desktop;
- tablet;
- celular.

Em telas pequenas:

- ocupar praticamente toda a largura;
- reduzir margens;
- manter o botão de envio facilmente acessível;
- permitir quebra de linha nas mensagens.

---

## 31. Comportamento inicial

Ao abrir a aplicação, exibir uma mensagem local de boas-vindas, sem chamar a API.

Exemplo:

```text
Olá! Sou o assistente virtual da COTI Informática. Informe seu nome e faça uma pergunta sobre nossos cursos.
```

Essa mensagem pertence apenas ao frontend.

---

## 32. Validações

### Nome

Obrigatório.

Mensagem:

```text
Informe seu nome para iniciar o atendimento.
```

### Pergunta

Obrigatória.

Não enviar strings vazias ou compostas somente por espaços.

Mensagem:

```text
Digite uma pergunta.
```

---

## 33. Fluxo principal

```text
Usuário
   |
   | informa nome
   v
app-webchat Angular
   |
   | digita pergunta
   v
ChatComponent
   |
   | RagRequest
   v
RagService
   |
   | POST /api/rag
   v
api-rag
   |
   | RAG + Memória + OpenAI + Tools
   v
RagResponse
   |
   v
RagService
   |
   v
ChatComponent
   |
   v
Exibe atendimento.mensagem
```

---

## 34. Exemplo completo de chamada

### Entrada

Usuário informa:

```text
Nome: Sergio
Pergunta: Tem curso de Java?
```

O Angular envia:

```json
{
  "nomeUsuario": "Sergio",
  "pergunta": "Tem curso de Java?"
}
```

O frontend deverá consumir a resposta e apresentar principalmente:

```ts
response.atendimento.mensagem
```

---

## 35. Critérios de aceite

A implementação será considerada concluída quando:

- [ ] o projeto Angular iniciar sem erros;
- [ ] a tela de chat for exibida;
- [ ] existir campo para nome do usuário;
- [ ] existir campo para pergunta;
- [ ] o botão Enviar funcionar;
- [ ] pressionar Enter puder enviar a pergunta;
- [ ] perguntas vazias não forem enviadas;
- [ ] o frontend realizar `POST /api/rag`;
- [ ] o JSON enviado possuir `nomeUsuario` e `pergunta`;
- [ ] a resposta do usuário aparecer à direita;
- [ ] a resposta do agente aparecer à esquerda;
- [ ] a interface mostrar um indicador durante o carregamento;
- [ ] o botão ficar bloqueado durante uma requisição;
- [ ] falhas de comunicação forem tratadas de maneira amigável;
- [ ] o histórico visual permanecer disponível durante a sessão da página;
- [ ] nenhuma chave da OpenAI estiver presente no frontend;
- [ ] o frontend não implementar lógica de RAG, embeddings ou acesso ao banco;
- [ ] o projeto funcionar localmente consumindo a `api-rag` na porta `8081`.

---

## 36. Fora do escopo da primeira versão

Não implementar inicialmente:

- autenticação com usuário e senha;
- cadastro de usuários;
- JWT;
- WebSocket;
- streaming de tokens;
- upload de arquivos;
- envio de áudio;
- reconhecimento de voz;
- histórico completo carregado do backend;
- painel administrativo;
- acesso direto à OpenAI pelo Angular.

Esses recursos poderão ser adicionados em versões futuras.

---

## 37. Resultado esperado

Ao final, o projeto deverá proporcionar uma experiência simples de chat:

```text
Usuário escreve uma pergunta
        ↓
Angular envia para /api/rag
        ↓
api-rag processa o atendimento
        ↓
Angular recebe RagResponse
        ↓
Tela exibe atendimento.mensagem
```

O frontend deverá permanecer desacoplado da implementação interna da inteligência artificial, utilizando a `api-rag` como única camada de integração com o backend.
