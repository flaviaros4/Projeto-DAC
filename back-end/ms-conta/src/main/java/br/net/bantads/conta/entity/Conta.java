package br.net.bantads.conta.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contas")
public class Conta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;

    private String numero;

    private BigDecimal saldo;

    private BigDecimal limite;

    private int gerente;
    
    private LocalDateTime criacao;

    @OneToMany(mappedBy = "contaOrigem")
    private List<Transacao> transacoesOrigem;

    @OneToMany(mappedBy = "contaDestino")
    private List<Transacao> transacoesDestino;

    public Conta(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getLimite() {
        return limite;
    }

    public void setLimite(BigDecimal limite) {
        this.limite = limite;
    }

    public int getGerente() {
        return gerente;
    }

    public void setGerente(int gerente) {
        this.gerente = gerente;
    }

    public LocalDateTime getCriacao() {
        return criacao;
    }

    public void setCriacao(LocalDateTime criacao) {
        this.criacao = criacao;
    }

    public List<Transacao> getTransacoesOrigem() {
        return transacoesOrigem;
    }

    public void setTransacoesOrigem(List<Transacao> transacoesOrigem) {
        this.transacoesOrigem = transacoesOrigem;
    }

    public List<Transacao> getTransacoesDestino() {
        return transacoesDestino;
    }

    public void setTransacoesDestino(List<Transacao> transacoesDestino) {
        this.transacoesDestino = transacoesDestino;
    }
}


