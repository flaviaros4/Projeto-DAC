package br.net.bantads.auth.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import br.net.bantads.auth.entity.Usuario;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
  
     Usuario findByEmail(String email);

}
