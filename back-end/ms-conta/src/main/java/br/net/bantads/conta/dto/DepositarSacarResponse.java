package br.net.bantads.conta.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DepositarSacarResponse {
    private String conta;
    private LocalDate data;
    private BigDecimal saldo;

    public DepositarSacarResponse(String conta, LocalDate data, BigDecimal saldo) {
        this.conta = conta;
        this.data = data;
        this.saldo = saldo;
    }

    public String getConta() {
        return conta;
    }

    public void setConta(String conta) {
        this.conta = conta;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
}
