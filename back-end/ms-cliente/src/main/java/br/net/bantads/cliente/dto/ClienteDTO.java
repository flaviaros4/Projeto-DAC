package br.net.bantads.cliente.dto;

import java.math.BigDecimal;

public class ClienteDTO {
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private BigDecimal salario;
    private String cidade;
    private String estado;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String situacao;
    
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

    public String getCpf() { 
        return cpf; 
    }

    public void setCpf(String cpf) { 
        this.cpf = cpf; 
    }

    public String getTelefone() { 
        return telefone; 
    }

    public void setTelefone(String telefone) { 
        this.telefone = telefone; 
    }
    
    public BigDecimal getSalario() { 
        return salario; 
    }

    public void setSalario(BigDecimal salario) { 
        this.salario = salario; 
    }

    public String getCidade() { 
        return cidade; 
    }

    public void setCidade(String cidade) { 
        this.cidade = cidade; 
    }

    public String getEstado() { 
        return estado; 
    }

    public void setEstado(String estado) { 
        this.estado = estado; 
    }

    public String getCep() { 
        return cep; 
    }

    public void setCep(String cep) { 
        this.cep = cep; 
    }

    public String getLogradouro() { 
        return logradouro; 
    }

    public void setLogradouro(String logradouro) { 
        this.logradouro = logradouro; 
    }

    public String getNumero() { 
        return numero; 
    }

    public void setNumero(String numero) { 
        this.numero = numero; 
    }

    public String getComplemento() { 
        return complemento; 
    }

    public void setComplemento(String complemento) { 
        this.complemento = complemento; 
    }

    public String getSituacao() {
    return situacao;
    }

    public void setSituacao(String situacao) {
    this.situacao = situacao;
    }

}