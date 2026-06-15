package br.net.bantads.conta.client;

import br.net.bantads.conta.dto.ClienteDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name="cliente-service",
        url="http://localhost:8082"
        //url="http://ms_cliente:8080"
)
public interface ClienteClient {


    @GetMapping("/clientes/{cpf}")
    ClienteDTO buscarPorCpf(
            @PathVariable String cpf
    );

}