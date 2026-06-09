package br.net.bantads.gerente;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit
public class MsGerenteApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsGerenteApplication.class, args);
	}

}
