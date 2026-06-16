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
        String motivo = (String) evento.get("motivo");

        if (cpf == null || email == null) return;

        if ("APROVADO".equals(acao)) {
            if (usuarioRepository.findByCpf(cpf) != null) return;
            if (usuarioRepository.findByEmail(email) != null) return;

            try {
                String senhaGerada = authService.cadastrarUsuario(nome, email, cpf, Perfil.CLIENTE, null);
                authService.enviarEmailAprovacao(email, nome, senhaGerada);
            } catch (Exception e) {
                System.err.println("Falha ao criar usuário CLIENTE: " + e.getMessage());
                authService.enviarEmailFalhaAutocadastro(email, nome);
            }
        }

        if ("REJEITADO".equals(acao)) {
            try {
                authService.enviarEmailRejeicao(email, nome, motivo != null ? motivo : "Não informado");
            } catch (Exception e) {
                System.err.println("Falha ao enviar e-mail de rejeição: " + e.getMessage());
            }
        }

        if ("FALHA_AUTOCADASTRO".equals(acao)) {
            authService.enviarEmailFalhaAutocadastro(email, nome);
        }
    }
}