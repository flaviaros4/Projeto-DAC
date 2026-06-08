package br.net.bantads.gerente.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.net.bantads.gerente.dto.request.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.request.DadoGerenteInsercao;
import br.net.bantads.gerente.dto.response.DadoGerente;

import br.net.bantads.gerente.service.GerenteService;

@RestController
@RequestMapping("/gerentes")
public class GerenteController {

    @Autowired
    private GerenteService gerenteService;

    // CADASTRAR
    @PostMapping
    public ResponseEntity<DadoGerente> cadastrar(
            @RequestBody DadoGerenteInsercao dado) {

        return ResponseEntity.ok(
                gerenteService.cadastrarGerente(dado));
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<?> listar(
            @RequestParam(required = false) String numero) {

        if ("dashboard".equals(numero)) {
            return ResponseEntity.ok(
                    gerenteService.dashboard());
        }

        return ResponseEntity.ok(
                gerenteService.listarTodos());
    }

    // BUSCAR POR CPF
    @GetMapping("/{cpf}")
    public ResponseEntity<DadoGerente> buscarPorCpf(
            @PathVariable String cpf) {

        return ResponseEntity.ok(
                gerenteService.buscarPorCpf(cpf));
    }

    // ATUALIZAR
    @PutMapping("/{cpf}")
    public ResponseEntity<DadoGerente> atualizar(
            @PathVariable String cpf,
            @RequestBody DadoGerenteAtualizacao dado) {

        return ResponseEntity.ok(
                gerenteService.atualizarGerente(cpf, dado));
    }

    // DELETAR
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletar(
            @PathVariable String cpf) {

        gerenteService.deletarGerente(cpf);

        return ResponseEntity.noContent().build();
    }

}