package br.net.bantads.conta.dto;

import java.math.BigDecimal;

public class SaldoResponse {
    private String cliente;
    private String conta;
    private BigDecimal saldo;

    public SaldoResponse (String cliente, String conta, BigDecimal saldo){
        this.cliente = cliente;
        this.conta = conta;
        this.saldo = saldo;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getConta() {
        return conta;
    }

    public void setConta(String conta) {
        this.conta = conta;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
}
