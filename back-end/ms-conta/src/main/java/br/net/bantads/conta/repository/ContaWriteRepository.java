package br.net.bantads.conta.repository;

import br.net.bantads.conta.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaWriteRepository
        extends JpaRepository<Conta, Long> {

    Optional<Conta> findByNumero(String numero);
}