package br.net.bantads.conta.repository.write;

import br.net.bantads.conta.entity.write.ContaWrite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaWriteRepository
        extends JpaRepository<ContaWrite, Long> {

    Optional<ContaWrite> findByNumero(String numero);
}

