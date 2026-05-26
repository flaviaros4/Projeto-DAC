package br.net.bantads.conta.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class JwtService {

    private final String SECRET =
            "minha-chave-secreta-segura-para-assinar-tokens-jwt-bantads";

    public boolean isTokenValid(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(
                            Keys.hmacShaKeyFor(SECRET.getBytes())
                    )
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String getPerfilFromToken(String token) {
        return getClaims(token).get("perfil", String.class);
    }

    public List<SimpleGrantedAuthority> getAuthorities(String token) {

        String perfil = getPerfilFromToken(token);

        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + perfil)
        );
    }

    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(
                        Keys.hmacShaKeyFor(SECRET.getBytes())
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}