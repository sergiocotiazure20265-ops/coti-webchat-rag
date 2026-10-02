import { DatePipe, DecimalPipe } from '@angular/common';
import { afterEveryRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { finalize } from 'rxjs';
import { MensagemChat } from '../../models/mensagem-chat';
import { RagService } from '../../services/rag.service';

function textoObrigatorio(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private readonly ragService = inject(RagService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly conversa = viewChild<ElementRef<HTMLElement>>('conversa');
  private ultimaQuantidade = 0;
  private ultimoCarregamento = false;
  readonly formulario = new FormGroup({
    nomeUsuario: new FormControl('', { nonNullable: true, validators: textoObrigatorio }),
    pergunta: new FormControl('', { nonNullable: true, validators: textoObrigatorio }),
  });
  readonly carregando = signal(false);
  readonly nomeConfirmado = signal('');
  readonly mensagens = signal<MensagemChat[]>([{
    autor: 'agente',
    texto: 'Olá! Sou o assistente virtual da COTI Informática. Informe seu nome e faça uma pergunta sobre nossos cursos.',
    dataHora: new Date(),
  }]);

  constructor() {
    afterEveryRender(() => {
      const quantidade = this.mensagens().length;
      const carregando = this.carregando();
      if (quantidade !== this.ultimaQuantidade || carregando !== this.ultimoCarregamento) {
        const elemento = this.conversa()?.nativeElement;
        if (elemento) elemento.scrollTop = elemento.scrollHeight;
        this.ultimaQuantidade = quantidade;
        this.ultimoCarregamento = carregando;
      }
    });
  }

  enviar(): void {
    if (this.carregando()) return;
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;
    const nomeUsuario = this.nomeConfirmado() || this.formulario.controls.nomeUsuario.value.trim();
    const pergunta = this.formulario.controls.pergunta.value.trim();
    if (!this.nomeConfirmado()) {
      this.nomeConfirmado.set(nomeUsuario);
      this.formulario.controls.nomeUsuario.setValue(nomeUsuario);
    }
    this.adicionarMensagem({ autor: 'usuario', texto: pergunta, dataHora: new Date() });
    this.formulario.controls.pergunta.reset();
    this.carregando.set(true);
    this.ragService.perguntar({ nomeUsuario, pergunta }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.carregando.set(false)),
    ).subscribe({
      next: (response) => {
        if (!response?.atendimento?.mensagem?.trim()) { this.adicionarErro(); return; }
        this.adicionarMensagem({ autor: 'agente', texto: response.atendimento.mensagem, dataHora: new Date(), detalhes: response });
      },
      error: () => this.adicionarErro(),
    });
  }
  private adicionarMensagem(mensagem: MensagemChat): void {
    this.mensagens.update((mensagens) => [...mensagens, mensagem]);
  }
  private adicionarErro(): void {
    this.adicionarMensagem({ autor: 'agente', texto: 'Não foi possível entrar em contato com o atendimento neste momento. Tente novamente em alguns instantes.', dataHora: new Date() });
  }
}
