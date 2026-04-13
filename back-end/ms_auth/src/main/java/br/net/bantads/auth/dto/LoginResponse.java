package br.net.bantads.auth.dto;

public class LoginResponse {
    private String token;
    private String tipo = "Bearer";
    private String perfil;
    private String usuario;

    public LoginResponse(String token, String perfil, String usuario) {
        this.token = token;
        this.perfil = perfil;
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

}
