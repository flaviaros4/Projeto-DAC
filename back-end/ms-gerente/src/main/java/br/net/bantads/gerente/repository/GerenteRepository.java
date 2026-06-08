package br.net.bantads.gerente.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.bantads.gerente.entity.Gerente;





public interface GerenteRepository  extends JpaRepository<Gerente, Long> {
    boolean existsByEmail(String email);
    Gerente  findByCpf(String cpf);
    boolean existsByCpf(String cpf);
    Gerente findByEmail(String email);
    
       
}
