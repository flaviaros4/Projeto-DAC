package br.net.bantads.gerente.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import br.net.bantads.gerente.dto.DadoGerenteAtualizacao;
import br.net.bantads.gerente.dto.DadoGerenteInsercao;
import br.net.bantads.gerente.entity.Gerente;
import br.net.bantads.gerente.repository.GerenteRepository;

@Service
public class GerenteService {

    @Autowired
    private GerenteRepository gerenteRepository;
    
    public List<Gerente> listarTodos() {
    return gerenteRepository.findAll();
}

    public Gerente cadastrarGerente(DadoGerenteInsercao dado) {

        if (gerenteRepository.existsByCpf(dado.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        Gerente gerente = new Gerente();
        gerente.setCpf(dado.getCpf());
        gerente.setNome(dado.getNome());
        gerente.setEmail(dado.getEmail());
        gerente.setTipo(dado.getTipo());

        return gerenteRepository.save(gerente);
    }

    public Gerente buscarPorCpf(String cpf) {
        if (gerenteRepository.existsByCpf(cpf)) {
            return gerenteRepository.findByCpf(cpf);
        }
        throw new RuntimeException("Gerente não encontrado");
    }

    public Gerente atualizarGerente(String cpf, DadoGerenteAtualizacao dado) {

        if (gerenteRepository.existsByCpf(cpf)) {
            Gerente gerente = gerenteRepository.findByCpf(cpf);
            gerente.setNome(dado.getNome());
            gerente.setEmail(dado.getEmail());
            gerente.setTipo(dado.getTipo());

            return gerenteRepository.save(gerente);
        }
        throw new RuntimeException("Gerente não encontrado");
    }

    public void deletarGerente(String cpf){
        if(gerenteRepository.existsByCpf(cpf)){
            Gerente gerente = gerenteRepository.findByCpf(cpf);
            gerenteRepository.delete(gerente);
        } else {
            throw new RuntimeException("Gerente não encontrado");
        }
    }
}
