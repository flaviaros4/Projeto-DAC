package br.net.bantads.conta.service;

import br.net.bantads.conta.dto.*;
import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.entity.Tipo;
import br.net.bantads.conta.entity.Transacao;
import br.net.bantads.conta.repository.ContaWriteRepository;
import br.net.bantads.conta.repository.TransacaoWriteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    public DepositarSacarResponse cadastrarDeposito(BigDecimal valor, String numeroContaDestino) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor inválido");
        }

        Conta contaDestino = contaWriteRepository
                .findByNumero(numeroContaDestino)
                .orElseThrow(() ->
                        new RuntimeException("Conta não encontrada")
                );

        LocalDateTime dataHora = LocalDateTime.now();

        contaDestino.setSaldo(
                contaDestino.getSaldo().add(valor)
        );

        contaWriteRepository.save(contaDestino);

        Transacao transacao = new Transacao();

        transacao.setDataHora(dataHora);
        transacao.setTipo(Tipo.DEPOSITO);
        transacao.setValor(valor);

        transacao.setContaOrigem(contaDestino);

        transacao.setContaDestino(contaDestino);

        transacaoWriteRepository.save(transacao);

        return new DepositarSacarResponse(
                contaDestino.getNumero(),
                dataHora,
                contaDestino.getSaldo()
        );
    }


    @Transactional
    public DepositarSacarResponse cadastrarSaque(BigDecimal valor, String numeroContaOrigem){
        if (valor.compareTo(BigDecimal.ZERO) <= 0){
            throw new RuntimeException("Valor inválido");
        }

        Conta conta = contaWriteRepository.findByNumero(numeroContaOrigem).orElseThrow(() -> new RuntimeException("conta não encontrada"));

        if(valor.compareTo(conta.getSaldo()) > 0){
            throw new RuntimeException("saldo insuficiente");
        }

        conta.setSaldo(conta.getSaldo().subtract(valor));

        contaWriteRepository.save(conta);

        LocalDateTime dataHora = LocalDateTime.now();
        Transacao saque = new Transacao();
        saque.setContaDestino(conta);
        saque.setContaOrigem(conta);
        saque.setTipo(Tipo.SAQUE);
        saque.setValor(valor);
        saque.setDataHora(dataHora);

        transacaoWriteRepository.save(saque);

        return new DepositarSacarResponse(numeroContaOrigem, dataHora, conta.getSaldo());
    }

    @Transactional
    public TransferirResponse cadastrarTransferencia(BigDecimal valor, String numeroContaOrigem, String numeroContaDestino){
        if(valor.compareTo(BigDecimal.ZERO) <= 0){
            throw new RuntimeException("valor inválido");
        }

        Conta contaOrigem = contaWriteRepository.findByNumero(numeroContaOrigem).orElseThrow(() -> new RuntimeException("conta de origem não encontrada"));
        Conta contaDestino = contaWriteRepository.findByNumero(numeroContaDestino).orElseThrow(() -> new RuntimeException("conta de destino não encontrada"));

        if(valor.compareTo(contaOrigem.getSaldo()) > 0){
            throw new RuntimeException("saldo insuficiente");
        }

        contaOrigem.setSaldo(contaOrigem.getSaldo().subtract(valor));
        contaDestino.setSaldo(contaDestino.getSaldo().add(valor));

        contaWriteRepository.save(contaOrigem);
        contaWriteRepository.save(contaDestino);

        LocalDateTime dataHora = LocalDateTime.now();
        Transacao transferencia = new Transacao();
        transferencia.setDataHora(dataHora);
        transferencia.setValor(valor);
        transferencia.setContaOrigem(contaOrigem);
        transferencia.setContaDestino(contaDestino);
        transferencia.setTipo(Tipo.TRANSFERENCIA);

        transacaoWriteRepository.save(transferencia);

        return new TransferirResponse(contaOrigem.getNumero(), dataHora, contaDestino.getNumero(), contaOrigem.getSaldo(), valor);
    }

    public SaldoResponse saldo(String numeroContaOrigem){
        Conta contaOrigem = contaWriteRepository.findByNumero(numeroContaOrigem).orElseThrow(() -> new RuntimeException("conta não encontrada"));
        return new SaldoResponse(contaOrigem.getCliente(), numeroContaOrigem, contaOrigem.getSaldo());
    }

    public ExtratoResponse extrato(String numeroContaOrigem){
        Conta contaOrigem = contaWriteRepository.findByNumero(numeroContaOrigem).orElseThrow(() -> new RuntimeException("conta não encontrada"));
        ArrayList<Transacao> transacoes = transacaoWriteRepository.findByContaOrigem(contaOrigem);
        ArrayList<Movimentacao> movimentacoes = new ArrayList<>();

        for (Transacao t : transacoes){
            movimentacoes.add(new Movimentacao(t.getDataHora(), t.getTipo(), t.getContaOrigem().getNumero(), t.getContaDestino().getNumero(), t.getValor()));
        }

        return new ExtratoResponse(numeroContaOrigem, contaOrigem.getSaldo(), movimentacoes);
    }
}