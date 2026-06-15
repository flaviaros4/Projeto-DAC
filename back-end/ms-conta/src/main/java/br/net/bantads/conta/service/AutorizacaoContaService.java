package br.net.bantads.conta.service;


import br.net.bantads.conta.client.ClienteClient;
import br.net.bantads.conta.dto.ClienteDTO;
import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.repository.write.ContaWriteRepository;

import org.springframework.stereotype.Service;



@Service
public class AutorizacaoContaService {
    private final ContaWriteRepository contaRepository;
    private final ClienteClient clienteClient;


    public AutorizacaoContaService(
            ContaWriteRepository contaRepository,
            ClienteClient clienteClient
    ){
        this.contaRepository = contaRepository;
        this.clienteClient = clienteClient;

    }


    public void validarDonoConta(
            String numeroConta,
            String emailToken
    ){
        Conta conta = contaRepository
                        .findByNumero(numeroConta)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Conta não encontrada"
                                )
                        );

        ClienteDTO cliente = clienteClient.buscarPorCpf(conta.getCliente());

        if(cliente == null){

            throw new RuntimeException(
                    "Cliente não encontrado"
            );
        }

        if(!cliente.getEmail().equals(emailToken)){
            throw new RuntimeException(
                    "Usuário não é dono da conta"
            );
        }

    }


}