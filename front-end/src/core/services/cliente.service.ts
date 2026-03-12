import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

const LS_CHAVE = 'clientes';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  constructor() {}

  cadastrar(cliente: Cliente): boolean {
    const listarClientes = localStorage[LS_CHAVE];
    const clientes = listarClientes ? JSON.parse(listarClientes) : [];
    const cpfNormalizado = this.normalizarCpf(cliente.cpf);
    cliente.id = new Date().getTime();
    cliente.estado = 'pendente';
    const cpfExistente = clientes.some(
      (c: Cliente) => this.normalizarCpf(c.cpf) === cpfNormalizado,
    );
    const salarioValido = cliente.salario > 0;

     if (!salarioValido) {
      alert('Salário deve ser um valor positivo.');
      return false;
    }
    if (cpfExistente) {
      alert('CPF já cadastrado. Por favor, utilize outro CPF.');
      return false;
    }

    cliente.cpf = cpfNormalizado;
    clientes.push(cliente);
    localStorage[LS_CHAVE] = JSON.stringify(clientes);
    return true;
  }

  private normalizarCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  listarSolicitacoes(): Cliente[] {
    const listarClientes = localStorage[LS_CHAVE];
    const clientes = listarClientes ? JSON.parse(listarClientes) : [];
    return clientes.filter((cliente: Cliente) => cliente.estado === 'pendente');
  }

}
