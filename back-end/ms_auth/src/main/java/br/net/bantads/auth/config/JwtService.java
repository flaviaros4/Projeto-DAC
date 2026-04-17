package br.net.bantads.auth.config;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String SECRET = "minha-chave-secreta-segura-para-assinar-tokens-jwt-bantads";
    private final long expirationMs = 86400000; // 1 dia

    public String generateToken(String email, String perfil, String nome) {
        return Jwts.builder()
                .setSubject(email)
                .claim("perfil", perfil)
                .claim("nome", nome)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes())).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Método para extrair as permissões (Roles) do token
    public List<SimpleGrantedAuthority> getAuthorities(String token) {
        String perfil = getPerfilFromToken(token);
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + perfil));
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String getPerfilFromToken(String token) {

        return getClaims(token).get("perfil", String.class);
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes())).build().parseClaimsJws(token)
                .getBody();
    }

}
