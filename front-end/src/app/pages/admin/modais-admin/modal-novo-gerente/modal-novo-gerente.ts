import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-novo-gerente',
  imports: [CommonModule],
  templateUrl: './modal-novo-gerente.html',
  styleUrl: './modal-novo-gerente.css',
})
export class ModalNovoGerente {
  @Output() fechar = new EventEmitter<void>();

  fecharModal() {
    this.fechar.emit();
  }
}
