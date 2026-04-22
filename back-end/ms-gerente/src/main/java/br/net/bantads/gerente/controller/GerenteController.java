package br.net.bantads.gerente.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.net.bantads.gerente.repository.GerenteRepository;

@RestController
@RequestMapping
public class GerenteController {

    @Autowired
    private GerenteRepository gerenteRepository;

   
    
}
