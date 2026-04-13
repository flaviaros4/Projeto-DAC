package br.net.bantads.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.net.bantads.auth.config.JwtService;
import br.net.bantads.auth.dto.LoginResponse;
import br.net.bantads.auth.entity.Usuario;
import br.net.bantads.auth.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwt;

    public LoginResponse login(String email, String senha) {

        // Lógica de autenticação
        // Buscar usuário por email
        Usuario usuario = usuarioRepository.findByEmail(email);
        // Comparar senha (criptografada)
        if(usuario != null && usuario.getSenha().equals(senha)) {
          String token = jwt.generateToken(usuario.getEmail(), usuario.getPerfil().name(), usuario.getNome());
          return new LoginResponse(token, usuario.getPerfil().name(), usuario.getNome());
        } else {
           throw new RuntimeException("Credenciais inválidas");
            
        }

    }

}
