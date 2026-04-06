import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-editar-gerente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-editar-gerente.html',
  styleUrl: './modal-editar-gerente.css',
})
export class ModalEditarGerente {

  @Input() gerente: any;

  @Output() fechar = new EventEmitter<void>();

  fecharModal() {
    this.fechar.emit();
  }
}