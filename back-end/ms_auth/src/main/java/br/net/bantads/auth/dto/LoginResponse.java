package br.net.bantads.auth.dto;



public class LoginResponse {
    private String access_token;
    private String token_type = "bearer";
    private String tipo;
    private UsuarioDTO usuario;

    public LoginResponse(String access_token, String tipo, UsuarioDTO usuario) {
        this.access_token = access_token;
        this.tipo = tipo;
        this.usuario = usuario;
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }

}
