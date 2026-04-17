package br.net.bantads.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.net.bantads.auth.dto.LoginInfo;
import br.net.bantads.auth.dto.LoginResponse;
import br.net.bantads.auth.dto.LogoutResponse;
import br.net.bantads.auth.entity.Usuario;
import br.net.bantads.auth.repository.UsuarioRepository;
import br.net.bantads.auth.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginInfo request) {
        try {
            LoginResponse response = authService.login(request.getLogin(), request.getSenha());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(Authentication auth) {
        String email = auth.getName();

        Usuario usuario = usuarioRepository.findByEmail(email);

        LogoutResponse response = new LogoutResponse(usuario.getCpf(), usuario.getNome(), usuario.getEmail(),
                usuario.getTipo().name());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reboot")
    public ResponseEntity<Void> reboot() {
        authService.reboot();
        return ResponseEntity.ok().build();
    }
    

}
