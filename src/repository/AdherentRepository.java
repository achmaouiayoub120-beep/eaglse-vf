package repository;

import model.Adherent;
import util.JsonUtil;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.util.*;

/**
 * Repository for managing Adherent persistence with JSON storage.
 */
public class AdherentRepository implements Repository<Adherent> {
    private static final String DATA_FILE = "data/adherents.json";
    private List<Adherent> adherents;

    public AdherentRepository() {
        this.adherents = new ArrayList<>();
        loadFromFile();
    }

    @Override
    public void save(Adherent entity) {
        if (!adherents.stream().anyMatch(a -> a.getId().equals(entity.getId()))) {
            adherents.add(entity);
            saveToFile();
        }
    }

    @Override
    public Adherent getById(String id) {
        return adherents.stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Adherent> getAll() {
        return new ArrayList<>(adherents);
    }

    @Override
    public void update(Adherent entity) {
        Adherent existing = getById(entity.getId());
        if (existing != null) {
            adherents.remove(existing);
            adherents.add(entity);
            saveToFile();
        }
    }

    @Override
    public void delete(String id) {
        adherents.removeIf(a -> a.getId().equals(id));
        saveToFile();
    }

    @Override
    public void saveAll(List<Adherent> entities) {
        adherents.addAll(entities);
        saveToFile();
    }

    public List<Adherent> rechercher(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return adherents.stream()
                .filter(a -> a.getNom().toLowerCase().contains(lowerKeyword) ||
                        a.getPrenom().toLowerCase().contains(lowerKeyword) ||
                        a.getEmail().toLowerCase().contains(lowerKeyword))
                .toList();
    }

    private void saveToFile() {
        try {
            String json = JsonUtil.toJson(adherents);
            JsonUtil.saveToFile(DATA_FILE, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadFromFile() {
        try {
            if (JsonUtil.fileExists(DATA_FILE)) {
                String json = JsonUtil.readFromFile(DATA_FILE);
                adherents = JsonUtil.fromJson(json, new TypeToken<List<Adherent>>(){}.getType());
            }
        } catch (IOException e) {
            adherents = new ArrayList<>();
        }
    }
}
