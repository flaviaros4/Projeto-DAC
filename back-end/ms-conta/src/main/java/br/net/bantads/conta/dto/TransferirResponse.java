package br.net.bantads.conta.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransferirResponse {
    private String conta;
    private LocalDate data;
    private String destino;
    private BigDecimal saldo;
    private BigDecimal valor;

    public TransferirResponse(String conta, LocalDate data, String destino, BigDecimal saldo, BigDecimal valor) {
        this.conta = conta;
        this.data = data;
        this.destino = destino;
        this.saldo = saldo;
        this.valor = valor;
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

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
