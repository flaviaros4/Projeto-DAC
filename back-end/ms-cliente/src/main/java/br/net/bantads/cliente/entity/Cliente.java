package br.net.bantads.cliente.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_cliente")
public class Cliente implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String situacao;
    private String telefone;
    private BigDecimal salario;
    private String cep;
    private String estado;
    private String cidade;
    private String numero;
    private String complemento;
    private String logradouro;


    public Cliente() {}

    public Long getId() { 
        return id; 
    }
    public void setId(Long id) {
        this.id = id; 
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

    public String getCep() { 
        return cep; 
    }

    public void setCep(String cep) { 
        this.cep = cep; 
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
    
    public String getSituacao() {
    return situacao;
    }

    public void setSituacao(String situacao) {
    this.situacao = situacao;
    }
}