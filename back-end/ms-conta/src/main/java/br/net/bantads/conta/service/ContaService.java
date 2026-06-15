package br.net.bantads.conta.service;

import br.net.bantads.conta.dto.*;
import br.net.bantads.conta.entity.read.ContaRead;
import br.net.bantads.conta.entity.write.ContaWrite;
import br.net.bantads.conta.entity.Tipo;
import br.net.bantads.conta.entity.read.TransacaoRead;
import br.net.bantads.conta.entity.write.TransacaoWrite;
import br.net.bantads.conta.event.TransacaoEvento;
import br.net.bantads.conta.messaging.producer.TransacaoProducer;
import br.net.bantads.conta.repository.read.ContaReadRepository;
import br.net.bantads.conta.repository.read.TransacaoReadRepository;
import br.net.bantads.conta.repository.write.ContaWriteRepository;
import br.net.bantads.conta.repository.write.TransacaoWriteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class ContaService {

    private final TransacaoWriteRepository transacaoWriteRepository;
    private final ContaWriteRepository contaWriteRepository;
    private final ContaReadRepository contaReadRepository;
    private final TransacaoReadRepository transacaoReadRepository;
    private final TransacaoProducer transacaoProducer;
    private final AutorizacaoContaService autorizacaoContaService;

    public ContaService(
            TransacaoWriteRepository transacaoWriteRepository,
            ContaWriteRepository contaWriteRepository,
            ContaReadRepository contaReadRepository,
            TransacaoReadRepository transacaoReadRepository,
            TransacaoProducer transacaoProducer,
            AutorizacaoContaService autorizacaoContaService
    ) {
        this.transacaoWriteRepository = transacaoWriteRepository;
        this.contaWriteRepository = contaWriteRepository;
        this.contaReadRepository = contaReadRepository;
        this.transacaoReadRepository = transacaoReadRepository;
        this.transacaoProducer = transacaoProducer;
        this.autorizacaoContaService = autorizacaoContaService;
    }

    @Transactional
    public DepositarSacarResponse cadastrarDeposito(
            BigDecimal valor,
            String numeroContaOrigem
    ) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor inválido");
        }

        ContaWrite contaOrigem = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        LocalDateTime dataHora = LocalDateTime.now();

        contaOrigem.setSaldo(contaOrigem.getSaldo().add(valor));
        contaWriteRepository.save(contaOrigem);

        TransacaoWrite transacao = new TransacaoWrite();
        transacao.setDataHora(dataHora);
        transacao.setTipo(Tipo.DEPOSITO);
        transacao.setValor(valor);
        transacao.setContaOrigem(contaOrigem);
        transacao.setContaDestino(null);

        transacaoWriteRepository.save(transacao);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.DEPOSITO);
        evento.setContaOrigem(contaOrigem.getNumero());
        evento.setContaDestino(null);
        evento.setValor(valor);
        evento.setDataHora(dataHora);

        transacaoProducer.enviarEvento(evento);

        return new DepositarSacarResponse(
                contaOrigem.getNumero(),
                dataHora,
                contaOrigem.getSaldo()
        );
    }

    @Transactional
    public DepositarSacarResponse cadastrarSaque(
            BigDecimal valor,
            String numeroContaOrigem
    ) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor inválido");
        }

        ContaWrite conta = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (valor.compareTo(conta.getSaldo()) > 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        conta.setSaldo(conta.getSaldo().subtract(valor));
        contaWriteRepository.save(conta);

        LocalDateTime dataHora = LocalDateTime.now();

        TransacaoWrite saque = new TransacaoWrite();
        saque.setContaOrigem(conta);
        saque.setContaDestino(null);
        saque.setTipo(Tipo.SAQUE);
        saque.setValor(valor);
        saque.setDataHora(dataHora);

        transacaoWriteRepository.save(saque);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.SAQUE);
        evento.setContaOrigem(conta.getNumero());
        evento.setContaDestino(null);
        evento.setValor(valor);
        evento.setDataHora(dataHora);

        transacaoProducer.enviarEvento(evento);

        return new DepositarSacarResponse(
                numeroContaOrigem,
                dataHora,
                conta.getSaldo()
        );
    }

    @Transactional
    public TransferirResponse cadastrarTransferencia(
            BigDecimal valor,
            String numeroContaOrigem,
            String numeroContaDestino
    ) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor inválido");
        }

        ContaWrite origen = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta origem não encontrada"));

        ContaWrite destino = contaWriteRepository.findByNumero(numeroContaDestino)
                .orElseThrow(() -> new RuntimeException("Conta destino não encontrada"));

        if (valor.compareTo(origen.getSaldo()) > 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        origen.setSaldo(origen.getSaldo().subtract(valor));
        destino.setSaldo(destino.getSaldo().add(valor));

        contaWriteRepository.save(origen);
        contaWriteRepository.save(destino);

        LocalDateTime dataHora = LocalDateTime.now();

        TransacaoWrite transferencia = new TransacaoWrite();
        transferencia.setDataHora(dataHora);
        transferencia.setValor(valor);
        transferencia.setContaOrigem(origen);
        transferencia.setContaDestino(destino);
        transferencia.setTipo(Tipo.TRANSFERENCIA);

        transacaoWriteRepository.save(transferencia);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.TRANSFERENCIA);
        evento.setContaOrigem(origen.getNumero());
        evento.setContaDestino(destino.getNumero());
        evento.setValor(valor);
        evento.setDataHora(dataHora);

        transacaoProducer.enviarEvento(evento);

        return new TransferirResponse(
                origen.getNumero(),
                dataHora,
                destino.getNumero(),
                origen.getSaldo(),
                valor
        );
    }

    public SaldoResponse saldo(String numeroConta) {
        ContaRead conta = contaReadRepository.findByNumero(numeroConta)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        return new SaldoResponse(
                conta.getCliente(),
                numeroConta,
                conta.getSaldo()
        );
    }

    public ExtratoResponse extrato(String numeroConta) {
        ContaRead conta = contaReadRepository.findByNumero(numeroConta)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        ArrayList<TransacaoRead> origem = new ArrayList<>(transacaoReadRepository.findByContaOrigem(conta));
        ArrayList<TransacaoRead> destino = new ArrayList<>(transacaoReadRepository.findByContaDestino(conta));
        ArrayList<Movimentacao> movimentacoes = new ArrayList<>();

        for (TransacaoRead t : origem) {
            movimentacoes.add(
                    new Movimentacao(
                            t.getDataHora(),
                            t.getTipo(),
                            t.getContaOrigem() != null ? t.getContaOrigem().getNumero() : null,
                            t.getContaDestino() != null ? t.getContaDestino().getNumero() : null,
                            t.getValor()
                    )
            );
        }

        for (TransacaoRead t : destino) {
            if (t.getTipo() == Tipo.TRANSFERENCIA) {
                movimentacoes.add(
                        new Movimentacao(
                                t.getDataHora(),
                                t.getTipo(),
                                t.getContaOrigem() != null ? t.getContaOrigem().getNumero() : null,
                                t.getContaDestino() != null ? t.getContaDestino().getNumero() : null,
                                t.getValor()
                        )
                );
            }
        }

        movimentacoes.sort((a, b) -> a.getData().compareTo(b.getData()));

        return new ExtratoResponse(
                numeroConta,
                conta.getSaldo(),
                movimentacoes
        );
    }
}