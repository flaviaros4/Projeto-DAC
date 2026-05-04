package br.net.bantads.conta.repository;

import br.net.bantads.conta.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaReadRepository extends JpaRepository<Conta, Long> {
}
