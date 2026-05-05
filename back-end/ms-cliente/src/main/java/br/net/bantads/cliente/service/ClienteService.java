package br.net.bantads.cliente.service;

import br.net.bantads.cliente.dto.ClienteDTO;
import br.net.bantads.cliente.dto.ClienteInsercaoDTO;
import br.net.bantads.cliente.entity.Cliente;
import br.net.bantads.cliente.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

  

}