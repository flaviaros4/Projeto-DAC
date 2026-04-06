import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContaService } from '../../../../../core/services/conta.service';
import { TransacaoService } from '../../../../../core/services/transacao.service';

@Component({
  selector: 'app-modal-saque',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Efetuar saque</h2>
    <mat-dialog-content>
      <p *ngIf="conta">Saldo: <strong>{{ conta.saldo | currency:'BRL' }}</strong></p>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Valor R$</mat-label>
        <input matInput type="number" [(ngModel)]="valor"/>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="confirmar()">Confirmar</button>
    </mat-dialog-actions>
  `
})
export class ModalSaque implements OnInit {
  valor: number = 0;
  conta: any;

  constructor(
    public dialogRef: MatDialogRef<ModalSaque>,
    private contaService: ContaService,
    private transacaoService: TransacaoService
  ) {}

  ngOnInit(): void {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      const user = JSON.parse(auth);
      this.contaService.getContaPorCliente(Number(user.usuarioId)).subscribe(res => this.conta = res);
    }
  }

  confirmar(): void {
  if (this.valor <= 0 || this.valor > (this.conta.saldo + this.conta.limite)) return;

  const novoSaldo = Number(this.conta.saldo) - Number(this.valor);
  
  const horaAtual = new Date();
  const dataLocal = new Date(horaAtual.getTime() - (horaAtual.getTimezoneOffset() * 60000))
                    .toISOString()
                    .slice(0, -1);

  this.dialogRef.close();

  this.contaService.atualizarSaldo(this.conta.id, novoSaldo).subscribe(() => {
    this.transacaoService.registrar({
      tipo: 'SAQUE',
      clienteORigem: this.conta.clienteId,
      valor: Number(this.valor),
      dataHora: dataLocal
    }).subscribe();
  });
}
}