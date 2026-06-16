package br.net.bantads.conta.event;

import java.math.BigDecimal;

public class ContaCudEvento {

    public enum Acao { CRIAR, ATUALIZAR, DELETAR }

    private Acao acao;
    private String cliente;
    private String numero;
    private BigDecimal saldo;
    private BigDecimal limite;
    private String gerente;

    public ContaCudEvento() {}

    public ContaCudEvento(Acao acao, String cliente, String numero, BigDecimal saldo, BigDecimal limite, String gerente) {
        this.acao = acao;
        this.cliente = cliente;
        this.numero = numero;
        this.saldo = saldo;
        this.limite = limite;
        this.gerente = gerente;
    }

    public Acao getAcao() { return acao; }
    public void setAcao(Acao acao) { this.acao = acao; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }
    public BigDecimal getLimite() { return limite; }
    public void setLimite(BigDecimal limite) { this.limite = limite; }
    public String getGerente() { return gerente; }
    public void setGerente(String gerente) { this.gerente = gerente; }
}