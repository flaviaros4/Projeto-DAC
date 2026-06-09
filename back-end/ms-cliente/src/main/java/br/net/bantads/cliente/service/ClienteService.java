package br.net.bantads.cliente.service;

import br.net.bantads.cliente.dto.ClienteDTO;
import br.net.bantads.cliente.dto.ClienteInsercaoDTO;
import br.net.bantads.cliente.entity.Cliente;
import br.net.bantads.cliente.event.ClienteEvent;
import br.net.bantads.cliente.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private ClienteProducer producer;

    public ClienteDTO cadastrar(ClienteInsercaoDTO dto) {
        if (repository.findByCpf(dto.getCpf()) != null) {
            throw new IllegalArgumentException("CPF já cadastrado ou aguardando aprovação");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setCpf(dto.getCpf());
        cliente.setTelefone(dto.getTelefone());
        cliente.setSalario(dto.getSalario());
        cliente.setCep(dto.getCep());
        cliente.setLogradouro(dto.getLogradouro());
        cliente.setNumero(dto.getNumero());
        cliente.setComplemento(dto.getComplemento());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());
        cliente.setSituacao("PENDENTE");

        cliente = repository.save(cliente);

        ClienteEvent evento = new ClienteEvent("AUTOCADASTRO", cliente.getCpf(), cliente.getNome(), cliente.getEmail(), cliente.getSalario(), null);
        producer.enviarEvento(evento);

        return converterParaDTO(cliente);
    }

    public List<ClienteDTO> listarTodos(String filtro) {
        return repository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO buscarPorCpf(String cpf) {
        Cliente cliente = repository.findByCpf(cpf);
        if ("para_aprovar".equalsIgnoreCase(filtro)) {
            return repository.findBySituacao("PENDENTE").stream().map(this::converterParaDTO).collect(Collectors.toList());
        }
        return repository.findAll().stream().map(this::converterParaDTO).collect(Collectors.toList());
    }

    public ClienteDTO atualizarPerfil(String cpf, ClienteDTO dto) {
        Cliente cliente = repository.findByCpf(cpf);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }

        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setSalario(dto.getSalario());
        cliente.setCep(dto.getCep());
        cliente.setLogradouro(dto.getLogradouro());
        cliente.setNumero(dto.getNumero());
        cliente.setComplemento(dto.getComplemento());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());

        cliente = repository.save(cliente);

        ClienteEvent evento = new ClienteEvent("ALTERACAO_PERFIL", cliente.getCpf(), cliente.getNome(), cliente.getEmail(), cliente.getSalario(), null);
        producer.enviarEvento(evento);

        return converterParaDTO(cliente);
    }

    public void aprovar(String cpf) {
        Cliente cliente = repository.findByCpf(cpf);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }

        cliente.setSituacao("APROVADO");
        repository.save(cliente);

        ClienteEvent evento = new ClienteEvent("APROVADO", cliente.getCpf(), cliente.getNome(), cliente.getEmail(), cliente.getSalario(), null);
        producer.enviarEvento(evento);
    }

    public void rejeitar(String cpf, String motivo) {
        Cliente cliente = repository.findByCpf(cpf);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }

        cliente.setSituacao("REJEITADO");
        repository.save(cliente);

        ClienteEvent evento = new ClienteEvent("REJEITADO", cliente.getCpf(), cliente.getNome(), cliente.getEmail(), cliente.getSalario(), motivo);
        producer.enviarEvento(evento);

        repository.delete(cliente);
    }

    private ClienteDTO converterParaDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        dto.setCpf(cliente.getCpf());
        dto.setTelefone(cliente.getTelefone());
        dto.setSalario(cliente.getSalario());
        dto.setCidade(cliente.getCidade());
        dto.setEstado(cliente.getEstado());
        dto.setCep(cliente.getCep());
        dto.setLogradouro(cliente.getLogradouro());
        dto.setNumero(cliente.getNumero());
        dto.setComplemento(cliente.getComplemento());
        dto.setSituacao(cliente.getSituacao());
        return dto;
    }
}