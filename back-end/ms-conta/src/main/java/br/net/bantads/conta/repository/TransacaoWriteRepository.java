package br.net.bantads.conta.repository;

import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface TransacaoWriteRepository extends JpaRepository <Transacao, Long> {
    ArrayList<Transacao> findByContaOrigem(Conta contaOrigem);
}
