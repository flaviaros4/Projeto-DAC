package br.net.bantads.gerente.dto.response;

import java.util.List;

public class GerentesResponse {

    private List<DadoGerente> gerentes;

    public GerentesResponse () {

    }

    public List<DadoGerente> getGerentes() {
        return gerentes;
    }

    public void setGerentes(List<DadoGerente> gerentes) {
        this.gerentes = gerentes;
    }

    

}
