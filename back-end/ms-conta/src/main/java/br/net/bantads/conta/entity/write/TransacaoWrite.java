package br.net.bantads.conta.entity.write;

import br.net.bantads.conta.entity.Tipo;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes", schema = "conta_write")
public class TransacaoWrite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "conta_origem_id")
    private ContaWrite contaOrigem;

    @ManyToOne
    @JoinColumn(name = "conta_destino_id")
    private ContaWrite contaDestino;

    public TransacaoWrite(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public ContaWrite getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(ContaWrite contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public ContaWrite getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(ContaWrite contaDestino) {
        this.contaDestino = contaDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
