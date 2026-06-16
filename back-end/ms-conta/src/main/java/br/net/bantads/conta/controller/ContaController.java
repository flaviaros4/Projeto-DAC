package br.net.bantads.conta.controller;

import br.net.bantads.conta.dto.*;
import br.net.bantads.conta.service.ContaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class ContaController {

    @Autowired
    private ContaService contaService;

    @GetMapping("reboot")
    public ResponseEntity<Void> reboot() {
        contaService.reboot();
        return ResponseEntity.ok().build();
    }

    @PostMapping("contas/{numero}/depositar")
    public ResponseEntity<DepositarSacarResponse> depositar(@PathVariable String numero, @RequestBody DepositarInfo request) {
        try {
            return ResponseEntity.ok(contaService.cadastrarDeposito(request.getValor(), numero));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("contas/{numero}/sacar")
    public ResponseEntity<DepositarSacarResponse> sacar(@PathVariable String numero, @RequestBody DepositarInfo request) {
        try {
            return ResponseEntity.ok(contaService.cadastrarSaque(request.getValor(), numero));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("contas/{numero}/transferir")
    public ResponseEntity<TransferirResponse> transferir(@PathVariable String numero, @RequestBody TransferirInfo request) {
        try {
            return ResponseEntity.ok(contaService.cadastrarTransferencia(request.getValor(), numero, request.getNumeroContaDestino()));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("contas/{numero}/saldo")
    public ResponseEntity<SaldoResponse> saldo(@PathVariable String numero) {
        try {
            return ResponseEntity.ok(contaService.saldo(numero));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new SaldoResponse("ERROR", numero, null));
        }
    }

    @GetMapping("contas/{numero}/extrato")
    public ResponseEntity<ExtratoResponse> extrato(@PathVariable String numero) {
        try {
            return ResponseEntity.ok(contaService.extrato(numero));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("contas")
    public ResponseEntity<Void> criar(@RequestBody ContaDTO request) {
        try {
            contaService.criarConta(request);
            return ResponseEntity.status(201).build();
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping("contas/{numero}")
    public ResponseEntity<Void> atualizar(@PathVariable String numero, @RequestBody ContaDTO request) {
        try {
            contaService.atualizarConta(numero, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("contas/{numero}")
    public ResponseEntity<Void> deletar(@PathVariable String numero) {
        try {
            contaService.deletarConta(numero);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("contas")
    public ResponseEntity<java.util.List<ContaDTO>> buscarTodas() {
        try {
            return ResponseEntity.ok(contaService.buscarTodas());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("contas/{numero}")
    public ResponseEntity<ContaDTO> buscarPorNumero(@PathVariable String numero) {
        try {
            return ResponseEntity.ok(contaService.buscarPorNumero(numero));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}