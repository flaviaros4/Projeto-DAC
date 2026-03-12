import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-cadastro-sucesso-dialog',
  template: `
    <div>
      <h2 mat-dialog-title> ✔ Solicitação enviada!</h2>
      <mat-dialog-content>
      <p>Sua conta está aguardando aprovação de um gerente.</p>
        <p>Você receberá um e-mail quando sua conta for aprovada.</p>
        
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-raised-button  (click)="fechar()"> <b>Voltar ao início </b> </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`

    div {
      text-align: center;
      padding: 1rem;    
    }
    button {
      background-color: #D4AF37; !important;
     
      border-radius: 8px;
      font-size: 1rem;
      padding: 0.5rem 1.5rem;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #C9A227 !important;
    }
  `],
  imports: [MatDialogActions, MatDialogContent]
})
export class CadastroSucessoDialog {

    constructor(

    private dialogRef: MatDialogRef<CadastroSucessoDialog>
  ) {}
 
  fechar(): void {
this.dialogRef.close();  }

}