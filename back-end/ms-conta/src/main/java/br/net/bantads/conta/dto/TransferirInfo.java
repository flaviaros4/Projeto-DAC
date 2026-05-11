package br.net.bantads.conta.dto;

import java.math.BigDecimal;

public class TransferirInfo {
    private BigDecimal valor;
    private String numeroContaDestino;

    public TransferirInfo(){

    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getNumeroContaDestino() {
        return numeroContaDestino;
    }

    public void setNumeroContaDestino(String numeroContaDestino) {
        this.numeroContaDestino = numeroContaDestino;
    }
}
