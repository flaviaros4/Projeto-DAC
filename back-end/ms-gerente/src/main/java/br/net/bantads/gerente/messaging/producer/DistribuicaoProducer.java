package br.net.bantads.gerente.messaging.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.net.bantads.gerente.config.RabbitConfig;
import br.net.bantads.gerente.event.DistribuicaoEvento;


@Service
public class DistribuicaoProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void enviar(String cpfGerente) {

       DistribuicaoEvento evento =
                new DistribuicaoEvento();

        evento.setCpfNovoGerente(cpfGerente);

        rabbitTemplate.convertAndSend(
                RabbitConfig.FILA_DISTRIBUICAO,
                evento);
    }
}