import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatComponent } from './chat.component';
import { RagResponse } from '../../models/rag-response';

const resposta: RagResponse = {
  atendimento: { assunto: 'CURSO', mensagem: 'Temos curso de Java.', curso: 'Java', interesseIdentificado: true, encaminharParaAtendente: true, informacaoEncontrada: false },
  tokensEntrada: 850, tokensSaida: 120, totalTokens: 970, custoEstimado: 0.0004525,
};

describe('ChatComponent', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ChatComponent], providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('mostra boas-vindas sem chamar a API e rejeita campos com espaços', async () => {
    const fixture = TestBed.createComponent(ChatComponent);
    await fixture.whenStable();
    const chat = fixture.componentInstance;
    chat.formulario.setValue({ nomeUsuario: '   ', pergunta: '   ' });
    chat.enviar();
    fixture.detectChanges();
    expect(chat.mensagens().length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Informe seu nome para iniciar o atendimento.');
    expect(fixture.nativeElement.textContent).toContain('Digite uma pergunta.');
    http.expectNone('/api/rag');
  });

  it('envia o contrato correto, bloqueia duplicidade e exibe a resposta e seus detalhes', async () => {
    const fixture = TestBed.createComponent(ChatComponent);
    const chat = fixture.componentInstance;
    chat.formulario.setValue({ nomeUsuario: ' Sergio ', pergunta: ' Tem curso de Java? ' });
    // Clique e Enter submetem o mesmo formulário.
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const request = http.expectOne('/api/rag');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ nomeUsuario: 'Sergio', pergunta: 'Tem curso de Java?' });
    expect(chat.formulario.controls.pergunta.value).toBe('');
    expect(chat.mensagens()[1].autor).toBe('usuario');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
    chat.formulario.controls.pergunta.setValue('Outra pergunta');
    chat.enviar();
    http.expectNone('/api/rag');
    request.flush(resposta);
    await fixture.whenStable();
    expect(chat.carregando()).toBe(false);
    expect(chat.mensagens()[2].texto).toBe(resposta.atendimento.mensagem);
    expect(fixture.nativeElement.textContent).toContain('Interesse identificado');
    expect(fixture.nativeElement.textContent).toContain('US$ 0.0004525');
    expect(fixture.nativeElement.querySelector('#nome').readOnly).toBe(true);
    // A identidade permanece igual e o histórico não é enviado.
    chat.enviar();
    const segunda = http.expectOne('/api/rag');
    expect(segunda.request.body).toEqual({ nomeUsuario: 'Sergio', pergunta: 'Outra pergunta' });
    segunda.flush(resposta);
  });

  it('preserva a pergunta em falhas, oculta detalhes técnicos e permite um novo envio', () => {
    const fixture = TestBed.createComponent(ChatComponent);
    const chat = fixture.componentInstance;
    chat.formulario.setValue({ nomeUsuario: 'Sergio', pergunta: 'Qual o valor?' });
    chat.enviar();
    http.expectOne('/api/rag').flush('Stack trace privado', { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(chat.carregando()).toBe(false);
    expect(chat.mensagens()[1].texto).toBe('Qual o valor?');
    expect(fixture.nativeElement.textContent).toContain('Não foi possível entrar em contato');
    expect(fixture.nativeElement.textContent).not.toContain('Stack trace privado');
    chat.formulario.controls.pergunta.setValue('Tentar novamente');
    chat.enviar();
    http.expectOne('/api/rag').flush(resposta);
    expect(chat.mensagens().length).toBe(5);
  });
});
