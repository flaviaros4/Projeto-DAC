package br.net.bantads.gerente.dto.request;

import br.net.bantads.gerente.entity.TipoGerente;

public class DadoGerenteInsercao {

    private String cpf;
    private String nome;
    private String email;
    private TipoGerente tipo;
    private String senha;

    public DadoGerenteInsercao() {
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

}
