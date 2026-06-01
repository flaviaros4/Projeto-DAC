package br.net.bantads.gerente.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import br.net.bantads.gerente.dto.request.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.request.DadoGerenteInsercao;
import br.net.bantads.gerente.entity.Gerente;
import br.net.bantads.gerente.event.GerenteEvento;
import br.net.bantads.gerente.exception.RecursoDuplicadoException;
import br.net.bantads.gerente.exception.RecursoNaoEncontradoException;
import br.net.bantads.gerente.messaging.producer.GerenteProducer;
import br.net.bantads.gerente.repository.GerenteRepository;

@Service
public class GerenteService {

    @Autowired
    private GerenteRepository gerenteRepository;
    @Autowired
    private GerenteProducer gerenteProducer;
    
    public List<Gerente> listarTodos() {
    return gerenteRepository.findAll();
}

    public Gerente cadastrarGerente(DadoGerenteInsercao dado) {
        
        if(gerenteRepository.existsByEmail(dado.getEmail())) {
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
        // Não enviar senha explícita para ms_auth — deixar nulo para geração automática, ou enviar se informado
        evento.setSenha(dado.getSenha());

        gerenteProducer.enviarEvento(evento);

        return novoGerente;
    }

    public Gerente buscarPorCpf(String cpf) {
        if (gerenteRepository.existsByCpf(cpf)) {
            return gerenteRepository.findByCpf(cpf);
        }
        throw new RecursoNaoEncontradoException("Gerente não encontrado");
    }

    public Gerente atualizarGerente(String cpf, DadoGerenteAtualizacao dado) {

        if (gerenteRepository.existsByCpf(cpf)) {
            Gerente gerente = gerenteRepository.findByCpf(cpf);
            gerente.setNome(dado.getNome());
            gerente.setEmail(dado.getEmail());
            gerente.setTelefone(dado.getTelefone());
            gerente.setDataAtualizacao(java.time.LocalDateTime.now());

            return gerenteRepository.save(gerente);
        }
        throw new RecursoNaoEncontradoException("Gerente não encontrado");
    }

    public void deletarGerente(String cpf){
        if(gerenteRepository.existsByCpf(cpf)){
            Gerente gerente = gerenteRepository.findByCpf(cpf);
            gerenteRepository.delete(gerente);
        } else {
            throw new RecursoNaoEncontradoException("Gerente não encontrado");
        }
    }
}
