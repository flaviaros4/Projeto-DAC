package br.net.bantads.gerente.dto.response;

public class ItemDashboardResponse {
private DadoGerente gerente;
    private DadoConta clientesConta;
    private Double saldo_positivo;
    private Double saldo_negativo;
    
    public DadoGerente getGerente() {
        return gerente;
    }
    public void setGerente(DadoGerente gerente) {
        this.gerente = gerente;
    }
    public DadoConta getClientesConta() {
        return clientesConta;
    }
    public void setClientesConta(DadoConta clientesConta) {
        this.clientesConta = clientesConta;
    }
    public Double getSaldo_positivo() {
        return saldo_positivo;
    }
    public void setSaldo_positivo(Double saldo_positivo) {
        this.saldo_positivo = saldo_positivo;
    }
    public Double getSaldo_negativo() {
        return saldo_negativo;
    }
    public void setSaldo_negativo(Double saldo_negativo) {
        this.saldo_negativo = saldo_negativo;
    }

}
