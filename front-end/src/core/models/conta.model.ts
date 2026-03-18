export interface Conta {
    id?: number;
    clienteId: number;
    numeroConta: number;
    dataAbertura: Date;
    saldo: number;
    limite: number;
    gerenteId: number;
}

export interface Transacao {
    id?: number;
    dataHora: Date;
    tipo: 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA';
    clienteOrigemId?: number;
    clienteDestinoId?: number;
    valor: number;
}