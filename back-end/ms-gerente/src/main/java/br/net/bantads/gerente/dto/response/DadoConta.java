package br.net.bantads.gerente.dto.response;

public class DadoConta {

    private String cpfCliente;
    private String numeroConta;
    private Double saldo;
    private Double limite;
    private String cpfGerente;
    private String dataCriacao;

    
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
    public String getDataCriacao() {
        return dataCriacao;
    }
    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }


}
