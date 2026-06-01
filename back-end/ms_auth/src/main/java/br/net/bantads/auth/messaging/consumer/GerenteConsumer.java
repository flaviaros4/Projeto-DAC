package br.net.bantads.auth.messaging.consumer;

import br.net.bantads.auth.config.RabbitConfig;
import br.net.bantads.auth.messaging.event.GerenteCreatedEvent;
import br.net.bantads.auth.repository.UsuarioRepository;
import br.net.bantads.auth.service.AuthService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class GerenteConsumer {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    public GerenteConsumer(AuthService authService, UsuarioRepository usuarioRepository) {
        this.authService = authService;
        this.usuarioRepository = usuarioRepository;
    }

    @RabbitListener(queues = RabbitConfig.FILA_GERENTE_CRIADO)
    public void consumir(GerenteCreatedEvent evento) {
        if (evento.getCpf() == null || evento.getEmail() == null) {
            return;
        }

        if (usuarioRepository.findByCpf(evento.getCpf()) != null) {
            return;
        }

        if (usuarioRepository.findByEmail(evento.getEmail()) != null) {
            return;
        }

        try {
            authService.cadastrarUsuario(evento.getNome(), evento.getEmail(), evento.getCpf(),
                    br.net.bantads.auth.entity.Perfil.GERENTE, evento.getSenha());
        } catch (Exception e) {
            System.err.println("Falha ao cadastrar usuário a partir do evento gerente.criado: " + e.getMessage());
        }
    }

}