package br.net.bantads.conta.entity.read;

import br.net.bantads.conta.entity.read.TransacaoRead;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contas", schema = "conta_read")
public class ContaRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;

    private String numero;

    private BigDecimal saldo;

    private BigDecimal limite;

    private String gerente;

    private LocalDateTime criacao;

    @OneToMany(mappedBy = "contaOrigem")
    private List<TransacaoRead> transacoesOrigem;

    @OneToMany(mappedBy = "contaDestino")
    private List<TransacaoRead> transacoesDestino;

    public ContaRead(){

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

    public String getGerente() {
        return gerente;
    }

    public void setGerente(String gerente) {
        this.gerente = gerente;
    }

    public LocalDateTime getCriacao() {
        return criacao;
    }

    public void setCriacao(LocalDateTime criacao) {
        this.criacao = criacao;
    }

    public List<TransacaoRead> getTransacoesOrigem() {
        return transacoesOrigem;
    }

    public void setTransacoesOrigem(List<TransacaoRead> transacoesOrigem) {
        this.transacoesOrigem = transacoesOrigem;
    }

    public List<TransacaoRead> getTransacoesDestino() {
        return transacoesDestino;
    }

    public void setTransacoesDestino(List<TransacaoRead> transacoesDestino) {
        this.transacoesDestino = transacoesDestino;
    }
}


