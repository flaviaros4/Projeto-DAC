package br.net.bantads.gerente.dto.response;

import java.util.List;
import java.util.ArrayList;

public class ItemDashboardResponse {

    private DadoGerente gerente;
    private List<DadoConta> clientesContas = new ArrayList<>();
    private Double saldo_positivo;
    private Double saldo_negativo;

    public DadoGerente getGerente() {
        return gerente;
    }

    public void setGerente(DadoGerente gerente) {
        this.gerente = gerente;
    }

    public List<DadoConta> getClientesContas() {
        return clientesContas;
    }

    public void setClientesContas(List<DadoConta> clientesContas) {
        this.clientesContas = clientesContas;
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