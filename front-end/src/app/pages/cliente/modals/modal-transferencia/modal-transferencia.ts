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
  selector: 'app-modal-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Transferência</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Número da conta</mat-label>
        <input matInput type="number" [(ngModel)]="contaDestinoNum"/>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Valor R$</mat-label>
        <input matInput type="number" [(ngModel)]="valor"/>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()">Transferir</button>
    </mat-dialog-actions>
  `
})
export class ModalTransferencia implements OnInit {
  valor: number = 0;
  contaDestinoNum: number | null = null;
  contaOrigem: any;

  constructor(public dialogRef: MatDialogRef<ModalTransferencia>, private contaService: ContaService, private transacaoService: TransacaoService) {}

  ngOnInit(): void {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      const user = JSON.parse(auth);
      this.contaService.getContaPorCliente(Number(user.usuarioId)).subscribe(res => this.contaOrigem = res);
    }
  }

 confirmar(): void {
  if (!this.contaDestinoNum || this.valor <= 0 || !this.contaOrigem) return;

  this.contaService.listarContas().subscribe(contas => {
    const destino = contas.find(c => c.numeroConta === this.contaDestinoNum);
    
    if (destino && destino.id !== undefined) {
      const horaAtual = new Date();
      const dataLocal = new Date(horaAtual.getTime() - (horaAtual.getTimezoneOffset() * 60000))
                        .toISOString()
                        .slice(0, -1);
                        
      this.dialogRef.close();

      this.contaService.atualizarSaldo(this.contaOrigem.id, this.contaOrigem.saldo - this.valor).subscribe();
      this.contaService.atualizarSaldo(destino.id.toString(), destino.saldo + this.valor).subscribe();
      
      this.transacaoService.registrar({
        tipo: 'TRANSFERENCIA',
        clienteORigem: this.contaOrigem.clienteId,
        clienteDestino: destino.clienteId,
        valor: Number(this.valor),
        dataHora: dataLocal
      }).subscribe();
    } else {
      alert('Conta de destino não encontrada.');
    }
  });
}
}