package br.net.bantads.gerente.dto.request;

import br.net.bantads.gerente.entity.TipoGerente;

public class DadoGerenteAtualizacao {

    private String nome;
    private String email;
    private TipoGerente tipo;

    public DadoGerenteAtualizacao() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TipoGerente getTipo() {
        return tipo;
    }

    public void setTipo(TipoGerente tipo) {
        this.tipo = tipo;
    }

}
