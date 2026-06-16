package br.net.bantads.auth.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.net.bantads.auth.config.JwtService;
import br.net.bantads.auth.dto.LoginResponse;
import br.net.bantads.auth.dto.UsuarioDTO;
import br.net.bantads.auth.entity.Perfil;
import br.net.bantads.auth.entity.Usuario;
import br.net.bantads.auth.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwt;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public LoginResponse login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario != null && usuario.getStatus() && passwordEncoder.matches(senha, usuario.getSenha())) {
            String token = jwt.generateToken(usuario.getEmail(), usuario.getTipo().name(), usuario.getNome());

            UsuarioDTO usuarioDTO = new UsuarioDTO();
            usuarioDTO.setNome(usuario.getNome());
            usuarioDTO.setCpf(usuario.getCpf());
            usuarioDTO.setEmail(usuario.getEmail());
            usuarioDTO.setPerfil(usuario.getTipo().name());
            usuarioDTO.setId(usuario.getId());

            return new LoginResponse(token, usuario.getTipo().name(), usuarioDTO);
        } else {
            throw new RuntimeException("Usuário/Senha incorretos");
        }
    }

    public String cadastrarUsuario(String nome, String email, String cpf, Perfil perfil, String senhaInformada) {
        if (usuarioRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email já cadastrado");
        }
        if (usuarioRepository.findByCpf(cpf) != null) {
            throw new RuntimeException("CPF já cadastrado");
        }

        String senha = (senhaInformada != null && !senhaInformada.isEmpty()) ? senhaInformada : gerarSenhaAleatoria();

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setCpf(cpf);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setTipo(perfil);
        usuario.setStatus(true);
        usuario.setDataCriacao(java.time.LocalDateTime.now());

        usuarioRepository.save(usuario);
        return senha;
    }

    public void enviarEmailAprovacao(String email, String nome, String senha) {
        if (mailSender == null) {
            System.out.println("[EMAIL-MOCK] Aprovação para " + email + " | senha: " + senha);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("BANTADS - Conta aprovada!");
            msg.setText("Olá, " + nome + "!\n\n"
                    + "Sua conta no BANTADS foi aprovada.\n"
                    + "Sua senha de acesso é: " + senha + "\n\n"
                    + "Acesse: http://bantads.com.br\n\n"
                    + "Equipe BANTADS");
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Falha ao enviar e-mail de aprovação: " + e.getMessage());
        }
    }

    public void enviarEmailRejeicao(String email, String nome, String motivo) {
        if (mailSender == null) {
            System.out.println("[EMAIL-MOCK] Rejeição para " + email + " | motivo: " + motivo);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("BANTADS - Solicitação não aprovada");
            msg.setText("Olá, " + nome + "!\n\n"
                    + "Infelizmente sua solicitação de cadastro no BANTADS não foi aprovada.\n"
                    + "Motivo: " + motivo + "\n\n"
                    + "Em caso de dúvidas, entre em contato com o banco.\n\n"
                    + "Equipe BANTADS");
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Falha ao enviar e-mail de rejeição: " + e.getMessage());
        }
    }

    public void enviarEmailFalhaAutocadastro(String email, String nome) {
        if (mailSender == null) {
            System.out.println("[EMAIL-MOCK] Falha autocadastro para " + email);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("BANTADS - Falha no autocadastro");
            msg.setText("Olá, " + nome + "!\n\n"
                    + "Ocorreu uma falha ao processar sua solicitação de cadastro no BANTADS.\n"
                    + "Por favor, tente novamente ou entre em contato com o suporte.\n\n"
                    + "Equipe BANTADS");
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Falha ao enviar e-mail de erro autocadastro: " + e.getMessage());
        }
    }

    public void atualizarSenha(String cpf, String novaSenha) {
        Usuario usuario = usuarioRepository.findByCpf(cpf);
        if (usuario == null) throw new RuntimeException("Usuário não encontrado");
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    public void reboot() {
        usuarioRepository.deleteAll();
        cadastrarUsuario("Adamântio",   "adm1@bantads.com.br",  "40501740066", Perfil.ADMIN,    "tads");
        cadastrarUsuario("Geniéve",     "ger1@bantads.com.br",  "98574307084", Perfil.GERENTE,  "tads");
        cadastrarUsuario("Godophredo",  "ger2@bantads.com.br",  "64065268052", Perfil.GERENTE,  "tads");
        cadastrarUsuario("Gyândula",    "ger3@bantads.com.br",  "23862179060", Perfil.GERENTE,  "tads");
        cadastrarUsuario("Catharyna",   "cli1@bantads.com.br",  "12912861012", Perfil.CLIENTE,  "tads");
        cadastrarUsuario("Cleuddônio",  "cli2@bantads.com.br",  "09506382000", Perfil.CLIENTE,  "tads");
        cadastrarUsuario("Catianna",    "cli3@bantads.com.br",  "85733854057", Perfil.CLIENTE,  "tads");
        cadastrarUsuario("Cutardo",     "cli4@bantads.com.br",  "58872160006", Perfil.CLIENTE,  "tads");
        cadastrarUsuario("Coândrya",    "cli5@bantads.com.br",  "76179646090", Perfil.CLIENTE,  "tads");
    }

    private String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }
}