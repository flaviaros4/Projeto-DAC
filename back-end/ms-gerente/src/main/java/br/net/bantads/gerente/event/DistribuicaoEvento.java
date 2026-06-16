package br.net.bantads.gerente.event;

public class DistribuicaoEvento {

    private String cpfNovoGerente;
    private String cpfGerenteOrigem;
    private String numeroConta;

    public String getCpfNovoGerente() {
        return cpfNovoGerente;
    }

    public void setCpfNovoGerente(String cpfNovoGerente) {
        this.cpfNovoGerente = cpfNovoGerente;
    }

    public String getCpfGerenteOrigem() {
        return cpfGerenteOrigem;
    }

    public void setCpfGerenteOrigem(String cpfGerenteOrigem) {
        this.cpfGerenteOrigem = cpfGerenteOrigem;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }
}