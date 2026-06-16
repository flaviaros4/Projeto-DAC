package br.net.bantads.conta.messaging.producer;

import br.net.bantads.conta.event.ContaCudEvento;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class ContaProducer {

    private final RabbitTemplate rabbitTemplate;

    public static final String FILA_CONTAS_CUD = "contas.cud.queue";

    public ContaProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviarEvento(ContaCudEvento evento) {
        rabbitTemplate.convertAndSend(FILA_CONTAS_CUD, evento);
    }
}