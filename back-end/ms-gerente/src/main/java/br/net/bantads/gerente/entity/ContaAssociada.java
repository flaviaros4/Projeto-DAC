package br.net.bantads.gerente.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


 @Entity
 @Table(name = "conta")
public class ContaAssociada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cpf_cliente", nullable = false)
    private String cpfCliente;

    @Column(name = "numero_conta", nullable = false)
    private String numeroConta;

    @Column(name = "saldo", nullable = false)
    private Double saldo;

    @Column(name = "limite", nullable = false)
    private Double limite;

    @Column(name = "cpf_gerente", nullable = false)
    private String cpfGerente;

    @Column(name = "criacao_conta", nullable = false)

    private String criacaoConta;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }

    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    public Double getLimite() {
        return limite;
    }

    public void setLimite(Double limite) {
        this.limite = limite;
    }

    public String getCpfGerente() {
        return cpfGerente;
    }

    public void setCpfGerente(String cpfGerente) {
        this.cpfGerente = cpfGerente;
    }

    public String getCriacaoConta() {
        return criacaoConta;
    }

    public void setCriacaoConta(String criacaoConta) {
        this.criacaoConta = criacaoConta;
    }
}
