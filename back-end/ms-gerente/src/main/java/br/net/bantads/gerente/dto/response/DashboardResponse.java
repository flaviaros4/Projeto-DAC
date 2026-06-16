package br.net.bantads.gerente.dto.response;

import java.util.List;
import java.util.ArrayList;

public class DashboardResponse {

    private List<ItemDashboardResponse> items = new ArrayList<>();

    public List<ItemDashboardResponse> getItems() {
        return items;
    }

    public void setItems(List<ItemDashboardResponse> items) {
        this.items = items;
    }

    public void setItems(ItemDashboardResponse item) {
        this.items.clear();
        this.items.add(item);
    }
}