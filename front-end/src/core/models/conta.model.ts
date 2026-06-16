export interface Conta {
    id?: number;
    cliente: string;       
    numero: string;        
    dataAbertura?: Date;
    criacao?: Date;
    saldo: number;
    limite: number;
    gerente?: string;     

    clienteId?: number;
    numeroConta?: string;
    gerenteId?: number;
}

export interface Transacao {
    id?: number;
    dataHora: Date;
    tipo: 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA';
    clienteOrigemId?: number;
    clienteDestinoId?: number;
    valor: number;
}