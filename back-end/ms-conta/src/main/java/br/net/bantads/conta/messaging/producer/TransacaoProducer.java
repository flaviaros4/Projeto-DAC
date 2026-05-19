package br.net.bantads.conta.messaging.producer;

import br.net.bantads.conta.config.RabbitConfig;
import br.net.bantads.conta.event.TransacaoEvento;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TransacaoProducer {

    private final RabbitTemplate rabbitTemplate;

    public TransacaoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviarEvento(TransacaoEvento evento) {

        rabbitTemplate.convertAndSend(
                RabbitConfig.FILA_TRANSACOES,
                evento
        );
    }
}