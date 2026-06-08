package br.net.bantads.gerente.service;

import br.net.bantads.gerente.messaging.producer.DistribuicaoProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import br.net.bantads.gerente.dto.request.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.request.DadoGerenteInsercao;
import br.net.bantads.gerente.dto.response.DadoGerente;
import br.net.bantads.gerente.dto.response.DashboardResponse;
import br.net.bantads.gerente.dto.response.GerentesResponse;
import br.net.bantads.gerente.dto.response.ItemDashboardResponse;
import br.net.bantads.gerente.entity.Gerente;
import br.net.bantads.gerente.event.GerenteEvento;
import br.net.bantads.gerente.exception.RecursoDuplicadoException;
import br.net.bantads.gerente.exception.RecursoNaoEncontradoException;
import br.net.bantads.gerente.messaging.producer.GerenteProducer;

import br.net.bantads.gerente.repository.ContaAssociadaRepository;
import br.net.bantads.gerente.repository.GerenteRepository;

@Service
public class GerenteService {

    private final DistribuicaoProducer distribuicaoProducer;
    @Autowired
    private GerenteRepository gerenteRepository;
    @Autowired
    private GerenteProducer gerenteProducer;
    @Autowired
    private ContaAssociadaRepository contaRepository;

    GerenteService(DistribuicaoProducer distribuicaoProducer) {
        this.distribuicaoProducer = distribuicaoProducer;
    }

    private DadoGerente toDto(Gerente gerente) {

        DadoGerente dto = new DadoGerente();

        dto.setCpf(gerente.getCpf());
        dto.setNome(gerente.getNome());
        dto.setEmail(gerente.getEmail());
        dto.setTelefone(gerente.getTelefone());
        dto.setTipo(gerente.getTipo());

        return dto;
    }

    public DashboardResponse dashboard() {

        DashboardResponse response = new DashboardResponse();

        ItemDashboardResponse item = new ItemDashboardResponse();

        List<Gerente> gerentes = gerenteRepository.findAll();

        if (gerentes.isEmpty()) {
            return response;
        }

        Gerente gerente = gerentes.get(0);

        item.setGerente(toDto(gerente));

        response.setItems(item);

        return response;
    }

    public GerentesResponse listarTodos() {

        List<DadoGerente> lista = gerenteRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();

        GerentesResponse response = new GerentesResponse();
        response.setGerentes(lista);

        return response;
    }

    public DadoGerente cadastrarGerente(DadoGerenteInsercao dado) {

        if (gerenteRepository.existsByEmail(dado.getEmail())) {
            throw new RecursoDuplicadoException("Email já cadastrado");
        }

        if (gerenteRepository.existsByCpf(dado.getCpf())) {
            throw new RecursoDuplicadoException("CPF já cadastrado");
        }

        Gerente gerente = new Gerente();
        gerente.setCpf(dado.getCpf());
        gerente.setNome(dado.getNome());
        gerente.setEmail(dado.getEmail());
        gerente.setTipo(dado.getTipo());
        gerente.setTelefone(dado.getTelefone());
        gerente.setDataCriacao(java.time.LocalDateTime.now());

        Gerente novoGerente = gerenteRepository.save(gerente);

        GerenteEvento evento = new GerenteEvento();
        evento.setCpf(novoGerente.getCpf());
        evento.setNome(novoGerente.getNome());
        evento.setEmail(novoGerente.getEmail());
        evento.setTelefone(novoGerente.getTelefone());
        evento.setTipo(novoGerente.getTipo().name());
        // Não enviar senha explícita para ms_auth — deixar nulo para geração
        // automática, ou enviar se informado
        evento.setSenha(dado.getSenha());

        gerenteProducer.enviarEvento(evento);
        distribuicaoProducer.enviar(novoGerente.getCpf());

        return toDto(novoGerente);
    }

    public DadoGerente buscarPorCpf(String cpf) {

        Gerente gerente = gerenteRepository.findByCpf(cpf);

        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }

        return toDto(gerente);
    }

    public DadoGerente atualizarGerente(String cpf,
            DadoGerenteAtualizacao dado) {

        Gerente gerente = gerenteRepository.findByCpf(cpf);

        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }

        gerente.setNome(dado.getNome());
        gerente.setEmail(dado.getEmail());
        gerente.setTelefone(dado.getTelefone());
        gerente.setDataAtualizacao(java.time.LocalDateTime.now());

        gerente = gerenteRepository.save(gerente);

        return toDto(gerente);
    }

    public void deletarGerente(String cpf) {

        Gerente gerente = gerenteRepository.findByCpf(cpf);

        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }

        gerenteRepository.delete(gerente);
    }
}
