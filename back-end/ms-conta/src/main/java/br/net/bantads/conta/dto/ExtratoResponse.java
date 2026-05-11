package br.net.bantads.conta.dto;

import br.net.bantads.conta.entity.Transacao;

import java.math.BigDecimal;
import java.util.ArrayList;

public class ExtratoResponse {
    private String conta;
    private BigDecimal saldo;
    private ArrayList<Movimentacao> movimentacoes;

    public ExtratoResponse(String conta, BigDecimal saldo, ArrayList<Movimentacao> movimentacoes) {
        this.conta = conta;
        this.saldo = saldo;
        this.movimentacoes = movimentacoes;
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

    public ArrayList<Movimentacao> getMovimentacoes() {
        return movimentacoes;
    }

    public void setMovimentacoes(ArrayList<Movimentacao> movimentacoes) {
        this.movimentacoes = movimentacoes;
    }
}
