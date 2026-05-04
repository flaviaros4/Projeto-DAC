package br.net.bantads.conta.repository;

import br.net.bantads.conta.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
                                                           //Entidade, tipo do ID
//não implementa a classe, o Spring implementa sozinho em runtime
//já cria métodos automaticamente:
/*
* save()
findById()
findAll()
delete()
deleteById()
existsById()
count()
* */
public interface ContaWriteRepository extends JpaRepository<Conta, Long> {

}
