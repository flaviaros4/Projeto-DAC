package br.net.bantads.gerente.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.net.bantads.gerente.dto.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.DadoGerenteInsercao;
import br.net.bantads.gerente.entity.Gerente;
import br.net.bantads.gerente.service.GerenteService;

@RestController
@RequestMapping("/gerentes")
public class GerenteController {

    @Autowired
    private GerenteService gerenteService;

    // CADASTRAR
    @PostMapping
    public ResponseEntity<Gerente> cadastrar(
            @RequestBody DadoGerenteInsercao dado) {

        Gerente gerente = gerenteService.cadastrarGerente(dado);

        return ResponseEntity.ok(gerente);
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<List<Gerente>> listarTodos() {

        List<Gerente> gerentes = gerenteService.listarTodos();

        return ResponseEntity.ok(gerentes);
    }

    // BUSCAR POR CPF
    @GetMapping("/{cpf}")
    public ResponseEntity<Gerente> buscarPorCpf(
            @PathVariable String cpf) {

        Gerente gerente = gerenteService.buscarPorCpf(cpf);

        return ResponseEntity.ok(gerente);
    }

    // ATUALIZAR
    @PutMapping("/{cpf}")
    public ResponseEntity<Gerente> atualizar(
            @PathVariable String cpf,
            @RequestBody DadoGerenteAtualizacao dado) {

        Gerente gerente = gerenteService.atualizarGerente(cpf, dado);

        return ResponseEntity.ok(gerente);
    }

    // DELETAR
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletar(
            @PathVariable String cpf) {

        gerenteService.deletarGerente(cpf);

        return ResponseEntity.noContent().build();
    }

}