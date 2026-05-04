package br.net.bantads.conta.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DepositarSacarResponse {
    private Long conta;
    private LocalDateTime data;
    private BigDecimal saldo;

    public DepositarSacarResponse(){

    }

    public DepositarSacarResponse(Long conta, LocalDateTime data, BigDecimal saldo) {
        this.conta = conta;
        this.data = data;
        this.saldo = saldo;
    }

    public Long getConta() {
        return conta;
    }

    public void setConta(Long conta) {
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
