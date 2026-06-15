package br.net.bantads.conta.repository.read;

import br.net.bantads.conta.entity.read.ContaRead;
import br.net.bantads.conta.entity.read.TransacaoRead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface TransacaoReadRepository extends JpaRepository <TransacaoRead, Long> {
    ArrayList<TransacaoRead> findByContaOrigem(ContaRead contaOrigem);
    ArrayList<TransacaoRead> findByContaDestino(ContaRead contaDestino);
}
