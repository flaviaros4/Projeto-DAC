package br.net.bantads.cliente.messaging.producer;

import br.net.bantads.cliente.config.RabbitConfig;
import br.net.bantads.cliente.event.ClienteEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void enviarEvento(ClienteEvent evento) {
        rabbitTemplate.convertAndSend(RabbitConfig.FILA_CLIENTE, evento);
    }
}