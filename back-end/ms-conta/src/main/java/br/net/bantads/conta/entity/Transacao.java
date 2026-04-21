package br.net.bantads.conta.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Document (collection = "transacoes")
public class Transacao {
    @Id
    private String id;

    private LocalDate dataHora;
    private Tipo tipo; //enum
    private long clienteOrigem;
    private long clienteDestino;
    private BigDecimal valor;
    private long idUsuario;

    public Transacao(){

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDate dataHora) {
        this.dataHora = dataHora;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public long getClienteOrigem() {
        return clienteOrigem;
    }

    public void setClienteOrigem(long clienteOrigem) {
        this.clienteOrigem = clienteOrigem;
    }

    public long getClienteDestino() {
        return clienteDestino;
    }

    public void setClienteDestino(long clienteDestino) {
        this.clienteDestino = clienteDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long idUsuario) {
        this.idUsuario = idUsuario;
    }
}
