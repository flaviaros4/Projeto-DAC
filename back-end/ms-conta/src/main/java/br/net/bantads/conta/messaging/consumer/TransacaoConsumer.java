package br.net.bantads.conta.messaging.consumer;

import br.net.bantads.conta.config.RabbitConfig;
import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.entity.Tipo;
import br.net.bantads.conta.entity.Transacao;
import br.net.bantads.conta.event.TransacaoEvento;
import br.net.bantads.conta.repository.read.ContaReadRepository;
import br.net.bantads.conta.repository.read.TransacaoReadRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class TransacaoConsumer {

    private final ContaReadRepository contaReadRepository;
    private final TransacaoReadRepository transacaoReadRepository;

    public TransacaoConsumer(
            ContaReadRepository contaReadRepository,
            TransacaoReadRepository transacaoReadRepository
    ) {
        this.contaReadRepository = contaReadRepository;
        this.transacaoReadRepository = transacaoReadRepository;
    }

    @RabbitListener(queues = RabbitConfig.FILA_TRANSACOES)
    public void consumir(TransacaoEvento evento) {

        Conta contaOrigem = contaReadRepository
                .findByNumero(evento.getContaOrigem())
                .orElse(null);

        Conta contaDestino = contaReadRepository
                .findByNumero(evento.getContaDestino())
                .orElse(null);

        if (contaOrigem == null) {
            return;
        }

        switch (evento.getTipo()) {

            case DEPOSITO -> {
                contaOrigem.setSaldo(
                        contaOrigem.getSaldo().add(evento.getValor())
                );

                contaReadRepository.save(contaOrigem);
            }

            case SAQUE -> {
                contaOrigem.setSaldo(
                        contaOrigem.getSaldo().subtract(evento.getValor())
                );

                contaReadRepository.save(contaOrigem);
            }

            case TRANSFERENCIA -> {

                if (contaDestino == null) {
                    return;
                }

                contaOrigem.setSaldo(
                        contaOrigem.getSaldo().subtract(evento.getValor())
                );

                contaDestino.setSaldo(
                        contaDestino.getSaldo().add(evento.getValor())
                );

                contaReadRepository.save(contaOrigem);
                contaReadRepository.save(contaDestino);
            }
        }

        Transacao transacao = new Transacao();

        transacao.setTipo(evento.getTipo());
        transacao.setValor(evento.getValor());
        transacao.setDataHora(evento.getDataHora());
        transacao.setContaOrigem(contaOrigem);
        transacao.setContaDestino(contaDestino);

        transacaoReadRepository.save(transacao);
    }
}