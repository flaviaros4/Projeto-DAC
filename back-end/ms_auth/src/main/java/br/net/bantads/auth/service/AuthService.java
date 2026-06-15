package br.net.bantads.auth.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
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

  public LoginResponse login(String email, String senha) {
    // Buscar usuário por email
    Usuario usuario = usuarioRepository.findByEmail(email);
    // Comparar senha (criptografada)
    if (usuario != null && usuario.getStatus() && passwordEncoder.matches(senha, usuario.getSenha())) {
      // Gerar token JWT
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

  public String cadastrarUsuario(String nome, String email,String cpf, Perfil perfil, String senhaInformada ) {
    // Verificar se email ou CPF existem
    if (usuarioRepository.findByEmail(email) != null) {
      throw new RuntimeException("Email já cadastrado");
    }

    if (usuarioRepository.findByCpf(cpf) != null) {
      throw new RuntimeException("CPF já cadastrado");
    }

    // Definição de senha: Se senhaInformada for nula ou vazia, gera uma senha
    // aleatória (cliente), caso contrário, utiliza a senha informada (gerente)
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

  public void reboot() {
    usuarioRepository.deleteAll();

    // Dados pré-cadastrados
    // Administrador
    cadastrarUsuario("Adamântio", "adm1@bantads.com.br", "40501740066", Perfil.ADMIN, "tads");
    // Gerentes
    cadastrarUsuario("Geniéve", "ger1@bantads.com.br", "98574307084", Perfil.GERENTE, "tads");
    cadastrarUsuario("Godophredo", "ger2@bantads.com.br", "64065268052", Perfil.GERENTE, "tads");
    cadastrarUsuario("Gyândula", "ger3@bantads.com.br", "23862179060", Perfil.GERENTE, "tads");
    // Clientes
    cadastrarUsuario("Catharyna", "cli1@bantads.com.br", "12912861012", Perfil.CLIENTE, "tads");
    cadastrarUsuario("Cleuddônio", "cli2@bantads.com.br", "09506382000", Perfil.CLIENTE, "tads");
    cadastrarUsuario("Catianna", "cli3@bantads.com.br", "85733854057", Perfil.CLIENTE, "tads");
    cadastrarUsuario("Cutardo", "cli4@bantads.com.br", "58872160006", Perfil.CLIENTE, "tads");
    cadastrarUsuario("Coândrya", "cli5@bantads.com.br", "76179646090", Perfil.CLIENTE, "tads");
  }

  private String gerarSenhaAleatoria() {
    SecureRandom random = new SecureRandom();
    String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    StringBuilder senha = new StringBuilder();
    for (int i = 0; i < 4; i++) {
      int index = random.nextInt(caracteres.length());
      senha.append(caracteres.charAt(index));

    }
    return senha.toString();

  }

}
