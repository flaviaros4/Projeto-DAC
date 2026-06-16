package br.net.bantads.conta.repository.read;

import br.net.bantads.conta.entity.read.ContaRead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaReadRepository extends JpaRepository<ContaRead, Long> {
    Optional<ContaRead> findByNumero(String numero);
    Optional<ContaRead> findByCliente(String cliente);
}
