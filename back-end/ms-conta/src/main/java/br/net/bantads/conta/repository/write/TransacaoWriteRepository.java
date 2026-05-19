package br.net.bantads.conta.repository.write;

import br.net.bantads.conta.entity.Conta;
import br.net.bantads.conta.entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface TransacaoWriteRepository extends JpaRepository <Transacao, Long> {
    ArrayList<Transacao> findByContaOrigem(Conta contaOrigem);
}
