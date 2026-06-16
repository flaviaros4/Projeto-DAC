package br.net.bantads.conta.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String FILA_TRANSACOES = "transacoes";
    public static final String FILA_CONTAS_CUD = "contas.cud.queue";

    @Bean
    public Queue filaTransacoes() {
        return new Queue(FILA_TRANSACOES, true);
    }

    @Bean
    public Queue filaContasCud() {
        return new Queue(FILA_CONTAS_CUD, true);
    }

    @Bean
    public Jackson2JsonMessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}