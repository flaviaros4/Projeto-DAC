package br.net.bantads.conta.repository;

import br.net.bantads.conta.entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacaoWriteRepository extends JpaRepository <Transacao, Long> {
}
