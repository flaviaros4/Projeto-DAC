package br.net.bantads.gerente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.bantads.gerente.entity.ContaAssociada;



public interface ContaAssociadaRepository extends JpaRepository<ContaAssociada, Long> {

    List<ContaAssociada> findByCpfGerente(String cpfGerente);

}
