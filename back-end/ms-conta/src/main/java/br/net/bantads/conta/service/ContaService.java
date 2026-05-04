package br.net.bantads.conta.service;

import br.net.bantads.conta.dto.DepositarSacarResponse;
import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.entity.Tipo;
import br.net.bantads.conta.entity.Transacao;
import br.net.bantads.conta.repository.ContaWriteRepository;
import br.net.bantads.conta.repository.TransacaoWriteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ContaService {

    private final TransacaoWriteRepository transacaoWriteRepository;

    private final ContaWriteRepository contaWriteRepository;

    public ContaService(
            TransacaoWriteRepository transacaoWriteRepository,
            ContaWriteRepository contaWriteRepository
    ) {
        this.transacaoWriteRepository = transacaoWriteRepository;
        this.contaWriteRepository = contaWriteRepository;
    }

    @Transactional
    public DepositarSacarResponse cadastrarDeposito(BigDecimal valor, Long idUsuario, Conta contaDestino) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor inválido");
        }

        LocalDateTime dataHora = LocalDateTime.now();

        contaDestino.setSaldo(contaDestino.getSaldo().add(valor));

        contaWriteRepository.save(contaDestino);

        Transacao transacao = new Transacao();

        transacao.setDataHora(dataHora);
        transacao.setTipo(Tipo.DEPOSITO);
        transacao.setValor(valor);
        transacao.setIdUsuario(idUsuario);

        transacao.setContaOrigem(null);

        transacao.setContaDestino(contaDestino);

        transacaoWriteRepository.save(transacao);

        return new DepositarSacarResponse(
                contaDestino.getId(),
                dataHora,
                contaDestino.getSaldo()
        );
    }
}