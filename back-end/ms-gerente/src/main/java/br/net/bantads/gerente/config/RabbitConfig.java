package br.net.bantads.gerente.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String FILA_GERENTE_CRIADO = "gerente.criado";

    @Bean
    public Queue filaGerenteCriado() {
        return new Queue(FILA_GERENTE_CRIADO);
    }

    @Bean
    public Jackson2JsonMessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}