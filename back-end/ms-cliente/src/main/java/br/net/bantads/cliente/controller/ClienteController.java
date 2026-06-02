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
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService service;

    @PostMapping
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

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listarClientes(
            @RequestParam(required = false) String filtro) {
        List<ClienteDTO> clientes = service.listarTodos(filtro);
        return ResponseEntity.ok(clientes);
    }


    @GetMapping("/{cpf}")
    public ResponseEntity<?> buscarPorCpf(@PathVariable String cpf) {
        try {
            ClienteDTO cliente = service.buscarPorCpf(cpf);
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

    }


    @PutMapping("/{cpf}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable String cpf, @RequestBody ClienteDTO dto) {
        try {
            ClienteDTO atualizado = service.atualizarPerfil(cpf, dto);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

    }

    @PostMapping("/{cpf}/aprovar")
    public ResponseEntity<?> aprovarCliente(@PathVariable String cpf) {
        try {
            service.aprovar(cpf);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @PostMapping("/{cpf}/rejeitar")
    public ResponseEntity<?> rejeitarCliente(@PathVariable String cpf, @RequestBody Map<String, String> body) {
        try {
            String motivo = body.get("motivo");
            service.rejeitar(cpf, motivo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

}