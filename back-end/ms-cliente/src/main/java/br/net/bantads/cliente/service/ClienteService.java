package br.net.bantads.cliente.service;

import br.net.bantads.cliente.dto.ClienteDTO;
import br.net.bantads.cliente.entity.Cliente;
import br.net.bantads.cliente.event.ClienteEvent;
import br.net.bantads.cliente.messaging.producer.ClienteProducer;
import br.net.bantads.cliente.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.net.bantads.cliente.dto.ClienteInsercaoDTO;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;


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

        if (repository.findByEmail(dto.getEmail()) != null) {
            throw new IllegalArgumentException("E-mail já cadastrado");
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

        ClienteEvent evento = new ClienteEvent(
                "AUTOCADASTRO",
                cliente.getCpf(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getSalario(),
                null
        );
        producer.enviarEvento(evento);

        return converterParaDTO(cliente);
    }

    public List<ClienteDTO> listarTodos(String filtro) {
        if ("para_aprovar".equalsIgnoreCase(filtro)) {
            return repository.findBySituacao("PENDENTE").stream()
                    .map(this::converterParaDTO)
                    .collect(Collectors.toList());
        }

        if ("melhores_clientes".equalsIgnoreCase(filtro)) {
            return repository.findBySituacao("APROVADO").stream()
                    .sorted(Comparator.comparing(Cliente::getSalario).reversed())
                    .limit(3)
                    .map(this::converterParaDTO)
                    .collect(Collectors.toList());
        }

        if ("adm_relatorio_clientes".equalsIgnoreCase(filtro)) {
            return repository.findBySituacao("APROVADO").stream()
                    .map(this::converterParaDTO)
                    .collect(Collectors.toList());
        }

        return repository.findBySituacao("APROVADO").stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO buscarPorCpf(String cpf) {
        Cliente cliente = repository.findByCpf(cpf);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }
        return converterParaDTO(cliente);
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

        ClienteEvent evento = new ClienteEvent(
                "ALTERACAO_PERFIL",
                cliente.getCpf(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getSalario(),
                null
        );
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

        ClienteEvent evento = new ClienteEvent(
                "APROVADO",
                cliente.getCpf(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getSalario(),
                null
        );
        producer.enviarEvento(evento);
    }

    public void rejeitar(String cpf, String motivo) {
        Cliente cliente = repository.findByCpf(cpf);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }

        cliente.setSituacao("REJEITADO");
        repository.save(cliente);

        ClienteEvent evento = new ClienteEvent(
                "REJEITADO",
                cliente.getCpf(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getSalario(),
                motivo
        );
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

    public void reboot() {
    repository.deleteAll();

    criarClienteAprovado("Catharyna",  "cli1@bantads.com.br", "12912861012", "41999990001", new BigDecimal("5000.00"), "80000000", "Rua A", "100", "", "Curitiba", "PR");
    criarClienteAprovado("Cleuddônio", "cli2@bantads.com.br", "09506382000", "41999990002", new BigDecimal("8000.00"), "80000001", "Rua B", "101", "", "Curitiba", "PR");
    criarClienteAprovado("Catianna",   "cli3@bantads.com.br", "85733854057", "41999990003", new BigDecimal("3000.00"), "80000002", "Rua C", "102", "", "Curitiba", "PR");
    criarClienteAprovado("Cutardo",    "cli4@bantads.com.br", "58872160006", "41999990004", new BigDecimal("500.00"),  "80000003", "Rua D", "103", "", "Curitiba", "PR");
    criarClienteAprovado("Coândrya",   "cli5@bantads.com.br", "76179646090", "41999990005", new BigDecimal("1500.00"), "80000004", "Rua E", "104", "", "Curitiba", "PR");
}

private void criarClienteAprovado(String nome, String email, String cpf, String telefone,
                                   BigDecimal salario, String cep, String logradouro,
                                   String numero, String complemento, String cidade, String estado) {
    if (repository.findByCpf(cpf) != null) return;
    Cliente c = new Cliente();
    c.setNome(nome); c.setEmail(email); c.setCpf(cpf);
    c.setTelefone(telefone); c.setSalario(salario);
    c.setCep(cep); c.setLogradouro(logradouro); c.setNumero(numero);
    c.setComplemento(complemento); c.setCidade(cidade); c.setEstado(estado);
    c.setSituacao("APROVADO");
    repository.save(c);
}
}