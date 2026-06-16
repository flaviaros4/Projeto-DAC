package br.net.bantads.conta.messaging.consumer;

import br.net.bantads.conta.entity.write.ContaWrite;
import br.net.bantads.conta.event.ContaCudEvento;
import br.net.bantads.conta.messaging.producer.ContaProducer;
import br.net.bantads.conta.repository.write.ContaWriteRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DistribuicaoContaConsumer {

    private final ContaWriteRepository contaWriteRepository;
    private final ContaProducer contaProducer;

    public DistribuicaoContaConsumer(ContaWriteRepository contaWriteRepository,
                                     ContaProducer contaProducer) {
        this.contaWriteRepository = contaWriteRepository;
        this.contaProducer = contaProducer;
    }

    @RabbitListener(queues = "gerente.distribuicao")
    public void consumir(Map<String, Object> evento) {
        String cpfNovoGerente = (String) evento.get("cpfNovoGerente");
        String numeroConta    = (String) evento.get("numeroConta");

        if (cpfNovoGerente == null || numeroConta == null) return;

        contaWriteRepository.findByNumero(numeroConta).ifPresent(conta -> {
            conta.setGerente(cpfNovoGerente);
            contaWriteRepository.save(conta);

            ContaCudEvento cud = new ContaCudEvento(
                    ContaCudEvento.Acao.ATUALIZAR,
                    conta.getCliente(),
                    conta.getNumero(),
                    conta.getSaldo(),
                    conta.getLimite(),
                    cpfNovoGerente
            );
            contaProducer.enviarEvento(cud);
        });
    }
}