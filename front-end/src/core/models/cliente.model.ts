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
    id?: number;
    email: string;
    senha: string;
    perfil: Perfil;
    status?: boolean;
}

export interface Cliente extends Usuario {
    nome: string;
    cpf: string;
    telefone: string;
    endereco: Endereco;
    salario: number;
    estado: "pendente" | "aprovado" | "rejeitado";
};

export interface Gerente extends Usuario {
    nome: string;
    cpf: string;
    telefone: string;
};