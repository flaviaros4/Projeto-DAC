package br.net.bantads.cliente.event;

import java.math.BigDecimal;

public class ClienteEvent {
    private String acao;
    private String cpf;
    private String nome;
    private String email;
    private String motivo;
    private BigDecimal salario;


    public ClienteEvent() {}

    public ClienteEvent(String acao, String cpf, String nome, String email, BigDecimal salario) {
        this.acao = acao;
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.salario = salario;
        this.motivo = motivo;
    }

    public String getAcao() { 
        return acao; 
    }

    public void setAcao(String acao) { 
        this.acao = acao; 
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

    public BigDecimal getSalario() { 
        return salario; 
    }

    public void setSalario(BigDecimal salario) { 
        this.salario = salario; 
    }

    public String getMotivo(String motivo) {
        return motivo;
    }

    public void setMotivo(String motivo) { 
        this.motivo = motivo;
    }
}