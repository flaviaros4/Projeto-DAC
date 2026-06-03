package br.net.bantads.conta.dto;

import br.net.bantads.conta.entity.Tipo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import br.net.bantads.conta.entity.Tipo;

public class SacarResponse {
    public LocalDateTime data;
    public Tipo tipo;
    public String origem;
    public String destino;
    public BigDecimal valor;

    public SacarResponse(){

    }

    public SacarResponse(LocalDateTime data, Tipo tipo, String origem, String destino, BigDecimal valor) {
        this.data = data;
        this.tipo = tipo;
        this.origem = origem;
        this.destino = destino;
        this.valor = valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
