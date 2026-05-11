package br.net.bantads.conta.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DepositarSacarResponse {
    private String conta;
    private LocalDateTime data;
    private BigDecimal saldo;

    public DepositarSacarResponse(){

    }

    public DepositarSacarResponse(String conta, LocalDateTime data, BigDecimal saldo) {
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

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
}
