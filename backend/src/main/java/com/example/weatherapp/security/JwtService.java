package com.example.weatherapp.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;
import java.util.function.Function;
@Service public class JwtService {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration}") private long expiration;
    public String extractUsername(String token) { return extractClaim(token, Claims::getSubject); }
    public <T> T extractClaim(String token, Function<Claims, T> resolver) { return resolver.apply(Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody()); }
    public String generateToken(UserDetails user) { return Jwts.builder().setSubject(user.getUsername()).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+expiration)).signWith(getKey(), SignatureAlgorithm.HS256).compact(); }
    public boolean isTokenValid(String token, UserDetails user) { return extractUsername(token).equals(user.getUsername()); }
    private Key getKey() { return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); }
}
