package br.net.bantads.conta.dto;

import java.math.BigDecimal;

public class DepositarInfo {

    private BigDecimal valor;

    public DepositarInfo(){

    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
