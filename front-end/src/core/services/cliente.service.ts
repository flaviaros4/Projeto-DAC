import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cliente } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  private api = 'http://localhost:3000/clientes';

  cadastrar(cliente: any): Observable<any> {
    const cpfNormalizado = cliente.cpf.replace(/\D/g, '');
    const cepNormalizado = (cliente.endereco?.cep || '').replace(/\D/g, '');
    if (cliente.salario <= 0) {
      throw new Error('Salário deve ser positivo');
    }

    const payload = {
      nome:         cliente.nome,
      email:        cliente.email,
      cpf:          cpfNormalizado,
      telefone:     cliente.telefone,
      salario:      cliente.salario,
      cep:          cepNormalizado,
      logradouro:   cliente.endereco?.rua        || '',
      numero:       cliente.endereco?.numero     || '',
      complemento:  cliente.endereco?.complemento || '',
      cidade:       cliente.endereco?.cidade     || '',
      estado:       cliente.endereco?.estado     || '',
      senha:        cliente.senha                || '',
    };
    return this.http.post<any>(this.api, payload);
  }

  verificarCpf(cpf: string): Observable<any> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.http.get<any>(`${this.api}/${cpfLimpo}`);
  }

  listarSolicitacoes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.api}?filtro=para_aprovar`);
  }

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  listarRelatorio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}?filtro=adm_relatorio_clientes`);
  }


  listarMelhoresClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}?filtro=melhores_clientes`);
  }

  buscarPorCpf(cpf: string): Observable<any> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.http.get<any>(`${this.api}/${cpfLimpo}`);
  }


  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  atualizar(cpfOuId: string | number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${cpfOuId}`, cliente);
  }

  aprovar(cpf: string): Observable<any> {
    return this.http.post<any>(`${this.api}/${cpf}/aprovar`, {});
  }

  rejeitar(cpf: string, motivo: string): Observable<any> {
    return this.http.post<any>(`${this.api}/${cpf}/rejeitar`, { motivo });
  }


  atualizarStatus(id: number, estado: 'APROVADO' | 'REJEITADO', motivoRejeicao?: string, dataRejeicao?: Date): Observable<any> {
    if (estado === 'APROVADO') {
      return this.http.post<any>(`${this.api}/${id}/aprovar`, {});
    } else {
      return this.http.post<any>(`${this.api}/${id}/rejeitar`, { motivo: motivoRejeicao });
    }
  }
}