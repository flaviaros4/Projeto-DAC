package br.net.bantads.conta.event;

import br.net.bantads.conta.entity.Tipo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransacaoEvento {

    private Tipo tipo;

    private String contaOrigem;

    private String contaDestino;

    private BigDecimal valor;

    private LocalDateTime dataHora;

    public TransacaoEvento() {
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public String getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(String contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public String getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(String contaDestino) {
        this.contaDestino = contaDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}