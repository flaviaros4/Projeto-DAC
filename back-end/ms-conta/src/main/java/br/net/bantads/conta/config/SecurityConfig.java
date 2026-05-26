package br.net.bantads.conta.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Apenas GERENTE pode depositar
                        .requestMatchers(
                                HttpMethod.POST,
                                "/contas/*/depositar"
                        ).hasRole("GERENTE")

                        // Apenas GERENTE pode sacar
                        .requestMatchers(
                                HttpMethod.POST,
                                "/contas/*/sacar"
                        ).hasRole("GERENTE")

                        // Apenas GERENTE pode transferir
                        .requestMatchers(
                                HttpMethod.POST,
                                "/contas/*/transferir"
                        ).hasRole("GERENTE")

                        // Qualquer autenticado pode ver saldo
                        .requestMatchers(
                                HttpMethod.GET,
                                "/contas/*/saldo"
                        ).authenticated()

                        // Qualquer autenticado pode ver extrato
                        .requestMatchers(
                                HttpMethod.GET,
                                "/contas/*/extrato"
                        ).authenticated()

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}