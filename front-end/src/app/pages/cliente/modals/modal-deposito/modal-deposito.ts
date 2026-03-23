import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-deposito',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Efetuar Depósito</h2>
    <mat-dialog-content>
      <p>Deposito</p>
      </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button mat-raised-button color="primary" disabled>Confirmar</button>
    </mat-dialog-actions>
  `
})
export class ModalDeposito {
  constructor(public dialogRef: MatDialogRef<ModalDeposito>) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
