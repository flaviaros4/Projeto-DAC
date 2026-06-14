package br.net.bantads.cliente.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

public class ClienteInsercaoDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    @NotNull(message = "O salário é obrigatório")
    private BigDecimal salario;

    @NotBlank(message = "O CEP é obrigatório")
    private String cep;

    @NotBlank(message = "O logradouro é obrigatório")
    private String logradouro;

    private String numero;
    private String complemento;
    
    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "O estado é obrigatório")
    private String estado;


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

}