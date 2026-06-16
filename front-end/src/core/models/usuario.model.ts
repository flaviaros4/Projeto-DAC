export type Perfil = 'CLIENTE' | 'ADMIN' | 'GERENTE';

export interface Endereco {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha?: string;
    perfil: Perfil;
    status?: boolean;
    usuarioId: number;
}

export interface Cliente extends Usuario {
    nome: string;
    cpf: string;
    telefone: string;
    endereco: Endereco;        
    salario: number;
    situacao?: "PENDENTE" | "APROVADO" | "REJEITADO";
    estado?: "PENDENTE" | "APROVADO" | "REJEITADO" | string;
    dataRejeicao?: Date;
    motivoRejeicao?: string;

    logradouro?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    cep?: string;
    bairro?: string;
};

export interface Gerente extends Usuario {
    nome: string;
    cpf: string;
    telefone: string;
};