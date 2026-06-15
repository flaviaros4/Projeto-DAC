package br.net.bantads.conta;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableRabbit
@EnableFeignClients
public class MsContaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsContaApplication.class, args);
	}

}
