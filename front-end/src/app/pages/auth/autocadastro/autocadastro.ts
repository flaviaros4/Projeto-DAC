import { Component, inject, ViewChild } from '@angular/core';
import { Cliente } from '../../../../core/models/cliente.model';
import { FormsModule, NgForm } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViaCepService } from '../../../../core/services/via-cep.service';

import { NgxMaskDirective} from 'ngx-mask';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroSucessoDialog } from './modals/cadastro-sucesso';
import { email } from '@angular/forms/signals';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-autocadastro',
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective, CurrencyMaskModule],
  templateUrl: './autocadastro.html',
  styleUrl: './autocadastro.css',
})
export class Autocadastro {
  @ViewChild('formCadastro') formCadastro!: NgForm;


  cliente: Cliente = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    salario: null as any,
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },

    senha: '',
    perfil: 'CLIENTE',
  } as Cliente;

  constructor(private clienteService: ClienteService,
    private viaCep: ViaCepService,
    private dialog: MatDialog
  ) { }
 
 

  cadastrar(): void {
    if (this.formCadastro.valid) {
      const cadastroRealizado = this.clienteService.cadastrar(this.cliente);

      if (cadastroRealizado) {
       this.dialog.open(CadastroSucessoDialog)
      }
   
    } 
  }

  buscarCep() {
    const cep = this.cliente.endereco.cep || '';
    if (!cep) {
      return;
    }
    this.viaCep.buscarCep(cep).subscribe((data) => {
      if (data && !data.erro) {
        this.cliente.endereco = {
          cep: data.cep,
          rua: data.logradouro,
          numero: this.cliente.endereco?.numero || '',
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        };
      } else {
        alert('CEP não encontrado');
      }
    });
  }

}
