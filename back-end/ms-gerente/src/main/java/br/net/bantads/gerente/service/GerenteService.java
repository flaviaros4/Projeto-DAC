package br.net.bantads.gerente.service;

import br.net.bantads.gerente.messaging.producer.DistribuicaoProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;

import br.net.bantads.gerente.dto.request.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.request.DadoGerenteInsercao;
import br.net.bantads.gerente.dto.response.DadoConta;
import br.net.bantads.gerente.dto.response.DadoGerente;
import br.net.bantads.gerente.dto.response.DashboardResponse;
import br.net.bantads.gerente.dto.response.GerentesResponse;
import br.net.bantads.gerente.dto.response.ItemDashboardResponse;
import br.net.bantads.gerente.entity.ContaAssociada;
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

    private final String MS_CONTA_URL = System.getenv("CONTA_SERVICE") != null
            ? System.getenv("CONTA_SERVICE")
            : "http://msconta:8080";

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
        List<Gerente> gerentes = gerenteRepository.findAll();

        List<ItemDashboardResponse> items = new ArrayList<>();

        for (Gerente gerente : gerentes) {
            ItemDashboardResponse item = new ItemDashboardResponse();
            item.setGerente(toDto(gerente));

            List<ContaAssociada> contas = contaRepository.findByCpfGerente(gerente.getCpf());

            double saldoPositivo = contas.stream()
                    .mapToDouble(c -> c.getSaldo() != null && c.getSaldo() >= 0 ? c.getSaldo() : 0.0)
                    .sum();
            double saldoNegativo = contas.stream()
                    .mapToDouble(c -> c.getSaldo() != null && c.getSaldo() < 0 ? c.getSaldo() : 0.0)
                    .sum();

            item.setSaldo_positivo(saldoPositivo);
            item.setSaldo_negativo(saldoNegativo);

            List<DadoConta> dadosContas = contas.stream().map(c -> {
                DadoConta dc = new DadoConta();
                dc.setCpfCliente(c.getCpfCliente());
                dc.setNumeroConta(c.getNumeroConta());
                dc.setSaldo(c.getSaldo());
                dc.setLimite(c.getLimite());
                dc.setCpfGerente(c.getCpfGerente());
                dc.setDataCriacao(c.getCriacaoConta());
                return dc;
            }).collect(Collectors.toList());

            item.setClientesContas(dadosContas);
            items.add(item);
        }

        items.sort((a, b) -> Double.compare(b.getSaldo_positivo(), a.getSaldo_positivo()));
        response.setItems(items);
        return response;
    }

    public GerentesResponse listarTodos() {
        List<DadoGerente> lista = gerenteRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Gerente::getNome))
                .map(this::toDto)
                .collect(Collectors.toList());

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
        evento.setSenha(dado.getSenha());
        gerenteProducer.enviarEvento(evento);

        List<Gerente> gerentesExistentes = gerenteRepository.findAll().stream()
                .filter(g -> !g.getCpf().equals(novoGerente.getCpf()))
                .collect(Collectors.toList());

        if (!gerentesExistentes.isEmpty()) {
            Map<String, List<ContaAssociada>> contasPorGerente = new HashMap<>();
            for (Gerente g : gerentesExistentes) {
                contasPorGerente.put(g.getCpf(), contaRepository.findByCpfGerente(g.getCpf()));
            }

            Optional<Map.Entry<String, List<ContaAssociada>>> gerenteMaisContas = contasPorGerente.entrySet()
                    .stream()
                    .filter(e -> !e.getValue().isEmpty())
                    .max(Comparator.comparingInt((Map.Entry<String, List<ContaAssociada>> e) -> e.getValue().size())
                            .thenComparingDouble(e -> -e.getValue().stream()
                                    .mapToDouble(c -> c.getSaldo() != null && c.getSaldo() > 0 ? c.getSaldo() : 0.0)
                                    .sum()));

            if (gerenteMaisContas.isPresent()) {
                List<ContaAssociada> contasDoGerente = gerenteMaisContas.get().getValue();
                ContaAssociada contaParaTransferir = contasDoGerente.get(0);
                contaParaTransferir.setCpfGerente(novoGerente.getCpf());
                contaRepository.save(contaParaTransferir);

                distribuicaoProducer.enviar(novoGerente.getCpf(), contaParaTransferir.getNumeroConta());
            }
        }

        return toDto(novoGerente);
    }

    public DadoGerente buscarPorCpf(String cpf) {
        Gerente gerente = gerenteRepository.findByCpf(cpf);
        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }
        return toDto(gerente);
    }

    public DadoGerente atualizarGerente(String cpf, DadoGerenteAtualizacao dado) {
        Gerente gerente = gerenteRepository.findByCpf(cpf);
        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }

        gerente.setNome(dado.getNome());
        gerente.setEmail(dado.getEmail());
        gerente.setTelefone(dado.getTelefone());
        gerente.setDataAtualizacao(java.time.LocalDateTime.now());
        gerente = gerenteRepository.save(gerente);

        if (dado.getSenha() != null && !dado.getSenha().isBlank()) {
            GerenteEvento eventoAtualizacao = new GerenteEvento();
            eventoAtualizacao.setCpf(gerente.getCpf());
            eventoAtualizacao.setNome(gerente.getNome());
            eventoAtualizacao.setEmail(gerente.getEmail());
            eventoAtualizacao.setTelefone(gerente.getTelefone());
            eventoAtualizacao.setTipo("ATUALIZACAO");
            eventoAtualizacao.setSenha(dado.getSenha());
            gerenteProducer.enviarEvento(eventoAtualizacao);
        }

        return toDto(gerente);
    }

    public void deletarGerente(String cpf) {
        Gerente gerente = gerenteRepository.findByCpf(cpf);
        if (gerente == null) {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }

        long totalGerentes = gerenteRepository.findAll().stream()
                .filter(g -> g.getTipo() != null && g.getTipo().name().equals("GERENTE"))
                .count();
        if (totalGerentes <= 1) {
            throw new IllegalStateException("Não é possível remover o único gerente do banco");
        }

        List<ContaAssociada> contasDoGerente = contaRepository.findByCpfGerente(cpf);

        if (!contasDoGerente.isEmpty()) {
            List<Gerente> outrosGerentes = gerenteRepository.findAll().stream()
                    .filter(g -> !g.getCpf().equals(cpf))
                    .collect(Collectors.toList());

            for (ContaAssociada conta : contasDoGerente) {
                Map<String, Long> contagemPorGerente = new HashMap<>();
                for (Gerente g : outrosGerentes) {
                    contagemPorGerente.put(g.getCpf(), contaRepository.findByCpfGerente(g.getCpf()).stream().count());
                }

                String cpfGerenteDestino = contagemPorGerente.entrySet().stream()
                        .min(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElseThrow(() -> new RuntimeException("Nenhum gerente disponível para redistribuição"));

                conta.setCpfGerente(cpfGerenteDestino);
                contaRepository.save(conta);

                distribuicaoProducer.enviar(cpfGerenteDestino, conta.getNumeroConta());
            }
        }

        gerenteRepository.delete(gerente);
    }
}