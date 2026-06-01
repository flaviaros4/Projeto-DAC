package br.net.bantads.gerente.messaging.producer;

import br.net.bantads.gerente.config.RabbitConfig;
import br.net.bantads.gerente.event.GerenteEvento;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class GerenteProducer {

    private final RabbitTemplate rabbitTemplate;

    public GerenteProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviarEvento(GerenteEvento evento) {

        rabbitTemplate.convertAndSend(
                RabbitConfig.FILA_GERENTE_CRIADO,
                evento
        );
    }
}