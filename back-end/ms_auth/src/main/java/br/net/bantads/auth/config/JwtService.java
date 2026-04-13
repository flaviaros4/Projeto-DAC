package br.net.bantads.auth.config;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtService {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expirationMs = 864000000; // 1 dia

    public String generateToken(String email, String perfil, String nome) {
        return Jwts.builder()
                .setSubject(email)
                .claim("perfil", perfil)
                .claim("nome", nome)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    public boolean isTokenValid(String token) {
       try {
        Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
        return true;
       } catch (Exception e) {
        return false;
       }
    }

    public String getEmailFromToken(String token) {
   
        return getClaims(token).getSubject();
    }

    public String getPerfilFromToken(String token) {
  
        return getClaims(token).get("perfil", String.class);
    }
    

    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }

}
