package br.net.bantads.conta.messaging.consumer;

import br.net.bantads.conta.entity.read.ContaRead;
import br.net.bantads.conta.event.ContaCudEvento;
import br.net.bantads.conta.repository.read.ContaReadRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ContaConsumer {

    private final ContaReadRepository contaReadRepository;

    public ContaConsumer(ContaReadRepository contaReadRepository) {
        this.contaReadRepository = contaReadRepository;
    }

    @RabbitListener(queues = "contas.cud.queue")
    public void consumir(ContaCudEvento evento) {
        switch (evento.getAcao()) {
            case CRIAR -> {
                ContaRead novaConta = new ContaRead();
                novaConta.setCliente(evento.getCliente());
                novaConta.setNumero(evento.getNumero());
                novaConta.setSaldo(evento.getSaldo());
                novaConta.setLimite(evento.getLimite());
                novaConta.setGerente(evento.getGerente());
                novaConta.setCriacao(LocalDateTime.now());
                contaReadRepository.save(novaConta);
            }
            case ATUALIZAR -> {
                contaReadRepository.findByNumero(evento.getNumero()).ifPresent(conta -> {
                    conta.setCliente(evento.getCliente());
                    conta.setLimite(evento.getLimite());
                    conta.setGerente(evento.getGerente());
                    contaReadRepository.save(conta);
                });
            }
            case DELETAR -> {
                contaReadRepository.findByNumero(evento.getNumero()).ifPresent(conta -> {
                    contaReadRepository.delete(conta);
                });
            }
        }
    }
}