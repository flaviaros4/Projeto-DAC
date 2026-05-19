package br.net.bantads.conta.repository.read;

import br.net.bantads.conta.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaReadRepository extends JpaRepository<Conta, Long> {
    Optional<Conta> findByNumero(String numero);

}
