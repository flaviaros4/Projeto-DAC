package br.net.bantads.cliente.controller;

import br.net.bantads.cliente.dto.ClienteDTO;
import br.net.bantads.cliente.dto.ClienteInsercaoDTO;
import br.net.bantads.cliente.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService service;

    @GetMapping("/reboot")
    public ResponseEntity<Void> reboot() {
        service.reboot();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/clientes")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ClienteInsercaoDTO dto) {
        try {
            ClienteDTO novoCliente = service.cadastrar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao inserir cliente");
        }
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<ClienteDTO>> listarClientes(@RequestParam(required = false) String filtro) {
        return ResponseEntity.ok(service.listarTodos(filtro));
    }

    @GetMapping("/clientes/{cpf}")
    public ResponseEntity<?> buscarPorCpf(@PathVariable String cpf) {
        try {
            return ResponseEntity.ok(service.buscarPorCpf(cpf));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }

    @PutMapping("/clientes/{cpf}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable String cpf, @RequestBody ClienteDTO dto) {
        try {
            return ResponseEntity.ok(service.atualizarPerfil(cpf, dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }

    @PostMapping("/clientes/{cpf}/aprovar")
    public ResponseEntity<?> aprovarCliente(@PathVariable String cpf) {
        try {
            service.aprovar(cpf);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/clientes/{cpf}/rejeitar")
    public ResponseEntity<?> rejeitarCliente(@PathVariable String cpf, @RequestBody Map<String, String> body) {
        try {
            service.rejeitar(cpf, body.get("motivo"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
