package br.net.bantads.conta.entity.read;

import br.net.bantads.conta.entity.Tipo;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes", schema = "conta_read")
public class TransacaoRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "conta_origem_id")
    private ContaRead contaOrigem;

    @ManyToOne
    @JoinColumn(name = "conta_destino_id")
    private ContaRead contaDestino;

    public TransacaoRead(){

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

    public ContaRead getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(ContaRead contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public ContaRead getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(ContaRead contaDestino) {
        this.contaDestino = contaDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
