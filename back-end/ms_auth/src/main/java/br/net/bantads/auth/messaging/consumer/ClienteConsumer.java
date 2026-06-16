package br.net.bantads.auth.messaging.consumer;

import br.net.bantads.auth.entity.Perfil;
import br.net.bantads.auth.repository.UsuarioRepository;
import br.net.bantads.auth.service.AuthService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ClienteConsumer {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    public ClienteConsumer(AuthService authService, UsuarioRepository usuarioRepository) {
        this.authService = authService;
        this.usuarioRepository = usuarioRepository;
    }

    @RabbitListener(queues = "cliente")
    public void consumir(Map<String, Object> evento) {
        String acao  = (String) evento.get("acao");
        String cpf   = (String) evento.get("cpf");
        String nome  = (String) evento.get("nome");
        String email = (String) evento.get("email");

        if (!"APROVADO".equals(acao) || cpf == null || email == null) return;
        if (usuarioRepository.findByCpf(cpf) != null) return;
        if (usuarioRepository.findByEmail(email) != null) return;

        try {
            authService.cadastrarUsuario(nome, email, cpf, Perfil.CLIENTE, null);
        } catch (Exception e) {
            System.err.println("Falha ao criar usuário CLIENTE: " + e.getMessage());
        }
    }
}
