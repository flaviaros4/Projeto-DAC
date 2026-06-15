package br.net.bantads.conta.controller;

import br.net.bantads.conta.dto.*;
import br.net.bantads.conta.repository.write.ContaWriteRepository;
import br.net.bantads.conta.service.ContaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping
public class ContaController {

    //@Autowired
    //private ContaWriteRepository contaWriteRepository;

    @Autowired
    private ContaService contaService;



    @PostMapping("contas/{numero}/depositar")
    public ResponseEntity<DepositarSacarResponse> depositar(@PathVariable String numero, @RequestBody DepositarInfo request, Authentication authentication){
        try{
            DepositarSacarResponse depositarResponse = contaService.cadastrarDeposito(request.getValor(), numero, authentication.getName());
            return ResponseEntity.ok(depositarResponse);
        } catch (Exception e){
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("contas/{numero}/sacar")
    public ResponseEntity<DepositarSacarResponse> sacar(@PathVariable String numero, @RequestBody DepositarInfo request, Authentication authentication){
        try{
            DepositarSacarResponse response = contaService.cadastrarSaque(request.getValor(), numero, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("contas/{numero}/transferir")
    public ResponseEntity<TransferirResponse> transferir(@PathVariable String numero, @RequestBody TransferirInfo request, Authentication authentication){
        try{
            TransferirResponse response = contaService.cadastrarTransferencia(request.getValor(), numero, request.getNumeroContaDestino(), authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("contas/{numero}/saldo")
    public ResponseEntity<SaldoResponse> saldo(@PathVariable String numero){
        try{
            SaldoResponse response = contaService.saldo(numero);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("contas/{numero}/extrato")
    public ResponseEntity<ExtratoResponse> extrato(@PathVariable String numero){
        try{
            ExtratoResponse response = contaService.extrato(numero);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(404).build();
        }
    }
}
