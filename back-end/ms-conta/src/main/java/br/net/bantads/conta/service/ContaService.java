package br.net.bantads.conta.service;

import br.net.bantads.conta.dto.*;
import br.net.bantads.conta.entity.read.ContaRead;
import br.net.bantads.conta.entity.write.ContaWrite;
import br.net.bantads.conta.entity.Tipo;
import br.net.bantads.conta.entity.read.TransacaoRead;
import br.net.bantads.conta.entity.write.TransacaoWrite;
import br.net.bantads.conta.event.TransacaoEvento;
import br.net.bantads.conta.event.ContaCudEvento;
import br.net.bantads.conta.messaging.producer.ContaProducer;
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
    private final ContaProducer contaProducer;

    public ContaService(
            TransacaoWriteRepository transacaoWriteRepository,
            ContaWriteRepository contaWriteRepository,
            ContaReadRepository contaReadRepository,
            TransacaoReadRepository transacaoReadRepository,
            TransacaoProducer transacaoProducer,
            AutorizacaoContaService autorizacaoContaService,
            ContaProducer contaProducer
    ) {
        this.transacaoWriteRepository = transacaoWriteRepository;
        this.contaWriteRepository = contaWriteRepository;
        this.contaReadRepository = contaReadRepository;
        this.transacaoReadRepository = transacaoReadRepository;
        this.transacaoProducer = transacaoProducer;
        this.autorizacaoContaService = autorizacaoContaService;
        this.contaProducer = contaProducer;
    }

    @Transactional
    public void reboot() {
        transacaoWriteRepository.deleteAll();
        transacaoReadRepository.deleteAll();
        contaWriteRepository.deleteAll();
        contaReadRepository.deleteAll();

        ContaWrite w1 = salvarWrite("12912861012", "1291", new BigDecimal("800.00"),  new BigDecimal("5000.00"),  "98574307084", LocalDateTime.of(2000,1,1,0,0));
        ContaWrite w2 = salvarWrite("09506382000", "0950", new BigDecimal("-10000.00"), new BigDecimal("10000.00"), "64065268052", LocalDateTime.of(1990,10,10,0,0));
        ContaWrite w3 = salvarWrite("85733854057", "8573", new BigDecimal("-1000.00"), new BigDecimal("1500.00"),  "23862179060", LocalDateTime.of(2012,12,12,0,0));
        ContaWrite w4 = salvarWrite("58872160006", "5887", new BigDecimal("150000.00"), new BigDecimal("0.00"),   "98574307084", LocalDateTime.of(2022,2,22,0,0));
        ContaWrite w5 = salvarWrite("76179646090", "7617", new BigDecimal("1500.00"),  new BigDecimal("0.00"),    "64065268052", LocalDateTime.of(2025,1,1,0,0));

        ContaRead r1 = salvarRead("12912861012", "1291", new BigDecimal("800.00"),  new BigDecimal("5000.00"),  "98574307084", LocalDateTime.of(2000,1,1,0,0));
        ContaRead r2 = salvarRead("09506382000", "0950", new BigDecimal("-10000.00"), new BigDecimal("10000.00"), "64065268052", LocalDateTime.of(1990,10,10,0,0));
        ContaRead r3 = salvarRead("85733854057", "8573", new BigDecimal("-1000.00"), new BigDecimal("1500.00"),  "23862179060", LocalDateTime.of(2012,12,12,0,0));
        ContaRead r4 = salvarRead("58872160006", "5887", new BigDecimal("150000.00"), new BigDecimal("0.00"),   "98574307084", LocalDateTime.of(2022,2,22,0,0));
        ContaRead r5 = salvarRead("76179646090", "7617", new BigDecimal("1500.00"),  new BigDecimal("0.00"),    "64065268052", LocalDateTime.of(2025,1,1,0,0));

        salvarTxWrite(LocalDateTime.of(2020,1,1,10,0),  Tipo.DEPOSITO,     new BigDecimal("1000"), w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,1,11,0),  Tipo.DEPOSITO,     new BigDecimal("900"),  w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,1,12,0),  Tipo.SAQUE,        new BigDecimal("550"),  w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,1,13,0),  Tipo.SAQUE,        new BigDecimal("350"),  w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,10,15,0), Tipo.DEPOSITO,     new BigDecimal("2000"), w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,15,8,0),  Tipo.SAQUE,        new BigDecimal("500"),  w1, null);
        salvarTxWrite(LocalDateTime.of(2020,1,20,12,0), Tipo.TRANSFERENCIA,new BigDecimal("1700"), w1, w2);

        salvarTxRead(LocalDateTime.of(2020,1,1,10,0),  Tipo.DEPOSITO,     new BigDecimal("1000"), r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,1,11,0),  Tipo.DEPOSITO,     new BigDecimal("900"),  r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,1,12,0),  Tipo.SAQUE,        new BigDecimal("550"),  r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,1,13,0),  Tipo.SAQUE,        new BigDecimal("350"),  r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,10,15,0), Tipo.DEPOSITO,     new BigDecimal("2000"), r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,15,8,0),  Tipo.SAQUE,        new BigDecimal("500"),  r1, null);
        salvarTxRead(LocalDateTime.of(2020,1,20,12,0), Tipo.TRANSFERENCIA,new BigDecimal("1700"), r1, r2);
        salvarTxRead(LocalDateTime.of(2025,1,1,12,0),  Tipo.DEPOSITO,     new BigDecimal("1000"), r2, null);
        salvarTxRead(LocalDateTime.of(2025,1,2,10,0),  Tipo.DEPOSITO,     new BigDecimal("5000"), r2, null);
        salvarTxRead(LocalDateTime.of(2025,1,10,10,0), Tipo.SAQUE,        new BigDecimal("200"),  r2, null);
        salvarTxRead(LocalDateTime.of(2025,2,5,10,0),  Tipo.DEPOSITO,     new BigDecimal("7000"), r2, null);
        salvarTxRead(LocalDateTime.of(2025,5,5,10,0),  Tipo.DEPOSITO,     new BigDecimal("1000"), r3, null);
        salvarTxRead(LocalDateTime.of(2025,6,6,10,0),  Tipo.SAQUE,        new BigDecimal("2000"), r3, null);
        salvarTxRead(LocalDateTime.of(2025,6,1,10,0),  Tipo.DEPOSITO,     new BigDecimal("150000"), r4, null);
        salvarTxRead(LocalDateTime.of(2025,7,1,10,0),  Tipo.DEPOSITO,     new BigDecimal("1500"), r5, null);
    }

    private ContaWrite salvarWrite(String cliente, String numero, BigDecimal saldo, BigDecimal limite, String gerente, LocalDateTime criacao) {
        ContaWrite c = new ContaWrite();
        c.setCliente(cliente); c.setNumero(numero);
        c.setSaldo(saldo); c.setLimite(limite);
        c.setGerente(gerente); c.setCriacao(criacao);
        return contaWriteRepository.save(c);
    }

    private ContaRead salvarRead(String cliente, String numero, BigDecimal saldo, BigDecimal limite, String gerente, LocalDateTime criacao) {
        ContaRead c = new ContaRead();
        c.setCliente(cliente); c.setNumero(numero);
        c.setSaldo(saldo); c.setLimite(limite);
        c.setGerente(gerente); c.setCriacao(criacao);
        return contaReadRepository.save(c);
    }

    private void salvarTxWrite(LocalDateTime dataHora, Tipo tipo, BigDecimal valor, ContaWrite origem, ContaWrite destino) {
        TransacaoWrite t = new TransacaoWrite();
        t.setDataHora(dataHora); t.setTipo(tipo);
        t.setValor(valor); t.setContaOrigem(origem); t.setContaDestino(destino);
        transacaoWriteRepository.save(t);
    }

    private void salvarTxRead(LocalDateTime dataHora, Tipo tipo, BigDecimal valor, ContaRead origem, ContaRead destino) {
        TransacaoRead t = new TransacaoRead();
        t.setDataHora(dataHora); t.setTipo(tipo);
        t.setValor(valor); t.setContaOrigem(origem); t.setContaDestino(destino);
        transacaoReadRepository.save(t);
    }

    @Transactional
    public DepositarSacarResponse cadastrarDeposito(BigDecimal valor, String numeroContaOrigem) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) throw new RuntimeException("Valor inválido");

        ContaWrite contaOrigem = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        LocalDateTime dataHora = LocalDateTime.now();
        contaOrigem.setSaldo(contaOrigem.getSaldo().add(valor));
        contaWriteRepository.save(contaOrigem);

        TransacaoWrite transacao = new TransacaoWrite();
        transacao.setDataHora(dataHora); transacao.setTipo(Tipo.DEPOSITO);
        transacao.setValor(valor); transacao.setContaOrigem(contaOrigem); transacao.setContaDestino(null);
        transacaoWriteRepository.save(transacao);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.DEPOSITO); evento.setContaOrigem(contaOrigem.getNumero());
        evento.setContaDestino(null); evento.setValor(valor); evento.setDataHora(dataHora);
        transacaoProducer.enviarEvento(evento);

        return new DepositarSacarResponse(contaOrigem.getNumero(), dataHora, contaOrigem.getSaldo());
    }

    @Transactional
    public DepositarSacarResponse cadastrarSaque(BigDecimal valor, String numeroContaOrigem) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) throw new RuntimeException("Valor inválido");

        ContaWrite conta = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (valor.compareTo(conta.getSaldo()) > 0) throw new RuntimeException("Saldo insuficiente");

        conta.setSaldo(conta.getSaldo().subtract(valor));
        contaWriteRepository.save(conta);

        LocalDateTime dataHora = LocalDateTime.now();
        TransacaoWrite saque = new TransacaoWrite();
        saque.setContaOrigem(conta); saque.setContaDestino(null);
        saque.setTipo(Tipo.SAQUE); saque.setValor(valor); saque.setDataHora(dataHora);
        transacaoWriteRepository.save(saque);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.SAQUE); evento.setContaOrigem(conta.getNumero());
        evento.setContaDestino(null); evento.setValor(valor); evento.setDataHora(dataHora);
        transacaoProducer.enviarEvento(evento);

        return new DepositarSacarResponse(numeroContaOrigem, dataHora, conta.getSaldo());
    }

    @Transactional
    public TransferirResponse cadastrarTransferencia(BigDecimal valor, String numeroContaOrigem, String numeroContaDestino) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) throw new RuntimeException("Valor inválido");

        ContaWrite origen = contaWriteRepository.findByNumero(numeroContaOrigem)
                .orElseThrow(() -> new RuntimeException("Conta origem não encontrada"));
        ContaWrite destino = contaWriteRepository.findByNumero(numeroContaDestino)
                .orElseThrow(() -> new RuntimeException("Conta destino não encontrada"));

        if (valor.compareTo(origen.getSaldo()) > 0) throw new RuntimeException("Saldo insuficiente");

        origen.setSaldo(origen.getSaldo().subtract(valor));
        destino.setSaldo(destino.getSaldo().add(valor));
        contaWriteRepository.save(origen);
        contaWriteRepository.save(destino);

        LocalDateTime dataHora = LocalDateTime.now();
        TransacaoWrite transferencia = new TransacaoWrite();
        transferencia.setDataHora(dataHora); transferencia.setValor(valor);
        transferencia.setContaOrigem(origen); transferencia.setContaDestino(destino);
        transferencia.setTipo(Tipo.TRANSFERENCIA);
        transacaoWriteRepository.save(transferencia);

        TransacaoEvento evento = new TransacaoEvento();
        evento.setTipo(Tipo.TRANSFERENCIA); evento.setContaOrigem(origen.getNumero());
        evento.setContaDestino(destino.getNumero()); evento.setValor(valor); evento.setDataHora(dataHora);
        transacaoProducer.enviarEvento(evento);

        return new TransferirResponse(origen.getNumero(), dataHora, destino.getNumero(), origen.getSaldo(), valor);
    }

    public SaldoResponse saldo(String numeroConta) {
        ContaRead conta = contaReadRepository.findByNumero(numeroConta)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        return new SaldoResponse(conta.getCliente(), numeroConta, conta.getSaldo());
    }

    public ExtratoResponse extrato(String numeroConta) {
        ContaRead conta = contaReadRepository.findByNumero(numeroConta)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        ArrayList<TransacaoRead> origem = new ArrayList<>(transacaoReadRepository.findByContaOrigem(conta));
        ArrayList<TransacaoRead> destino = new ArrayList<>(transacaoReadRepository.findByContaDestino(conta));
        ArrayList<Movimentacao> movimentacoes = new ArrayList<>();

        for (TransacaoRead t : origem) {
            movimentacoes.add(new Movimentacao(t.getDataHora(), t.getTipo(),
                    t.getContaOrigem() != null ? t.getContaOrigem().getNumero() : null,
                    t.getContaDestino() != null ? t.getContaDestino().getNumero() : null, t.getValor()));
        }
        for (TransacaoRead t : destino) {
            if (t.getTipo() == Tipo.TRANSFERENCIA) {
                movimentacoes.add(new Movimentacao(t.getDataHora(), t.getTipo(),
                        t.getContaOrigem() != null ? t.getContaOrigem().getNumero() : null,
                        t.getContaDestino() != null ? t.getContaDestino().getNumero() : null, t.getValor()));
            }
        }
        movimentacoes.sort((a, b) -> a.getData().compareTo(b.getData()));
        return new ExtratoResponse(numeroConta, conta.getSaldo(), movimentacoes);
    }

    @Transactional
    public void criarConta(ContaDTO dto) {
        if (contaWriteRepository.findByNumero(dto.getNumero()).isPresent())
            throw new RuntimeException("Número de conta já existente");

        ContaWrite conta = new ContaWrite();
        conta.setCliente(dto.getCliente()); conta.setNumero(dto.getNumero());
        conta.setSaldo(dto.getSaldo() != null ? dto.getSaldo() : BigDecimal.ZERO);
        conta.setLimite(dto.getLimite() != null ? dto.getLimite() : BigDecimal.ZERO);
        conta.setGerente(dto.getGerente()); conta.setCriacao(LocalDateTime.now());
        contaWriteRepository.save(conta);

        ContaCudEvento evento = new ContaCudEvento(ContaCudEvento.Acao.CRIAR, conta.getCliente(),
                conta.getNumero(), conta.getSaldo(), conta.getLimite(), conta.getGerente());
        contaProducer.enviarEvento(evento);
    }

    @Transactional
    public void atualizarConta(String numero, ContaDTO dto) {
        ContaWrite conta = contaWriteRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        conta.setCliente(dto.getCliente()); conta.setLimite(dto.getLimite()); conta.setGerente(dto.getGerente());
        contaWriteRepository.save(conta);

        ContaCudEvento evento = new ContaCudEvento(ContaCudEvento.Acao.ATUALIZAR, conta.getCliente(),
                conta.getNumero(), conta.getSaldo(), conta.getLimite(), conta.getGerente());
        contaProducer.enviarEvento(evento);
    }

    @Transactional
    public void deletarConta(String numero) {
        ContaWrite conta = contaWriteRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        contaWriteRepository.delete(conta);

        ContaCudEvento evento = new ContaCudEvento();
        evento.setAcao(ContaCudEvento.Acao.DELETAR); evento.setNumero(numero);
        contaProducer.enviarEvento(evento);
    }

    public java.util.List<ContaDTO> buscarTodas() {
        java.util.List<ContaRead> contasRead = contaReadRepository.findAll();
        java.util.List<ContaDTO> dtos = new java.util.ArrayList<>();
        for (ContaRead conta : contasRead) {
            dtos.add(new ContaDTO(conta.getCliente(), conta.getNumero(),
                    conta.getSaldo(), conta.getLimite(), conta.getGerente()));
        }
        return dtos;
    }

    public ContaDTO buscarPorNumero(String numero) {
        ContaRead conta = contaReadRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        return new ContaDTO(conta.getCliente(), conta.getNumero(),
                conta.getSaldo(), conta.getLimite(), conta.getGerente());
    }
}