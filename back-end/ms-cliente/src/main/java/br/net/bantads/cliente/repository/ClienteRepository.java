package br.net.bantads.cliente.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.net.bantads.cliente.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByCpf(String cpf);
    Cliente findByEmail(String email);
}