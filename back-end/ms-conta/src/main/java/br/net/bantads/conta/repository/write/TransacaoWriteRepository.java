package br.net.bantads.conta.repository.write;

import br.net.bantads.conta.entity.read.ContaRead;
import br.net.bantads.conta.entity.write.TransacaoWrite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface TransacaoWriteRepository extends JpaRepository <TransacaoWrite, Long> {
    ArrayList<TransacaoWrite> findByContaOrigem(ContaRead contaOrigem);
}
