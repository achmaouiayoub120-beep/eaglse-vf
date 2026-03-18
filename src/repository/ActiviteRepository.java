package repository;

import model.Activite;
import util.JsonUtil;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.util.*;

/**
 * Repository for managing Activite persistence with JSON storage.
 */
public class ActiviteRepository implements Repository<Activite> {
    private static final String DATA_FILE = "data/activites.json";
    private List<Activite> activites;

    public ActiviteRepository() {
        this.activites = new ArrayList<>();
        loadFromFile();
    }

    @Override
    public void save(Activite entity) {
        if (!activites.stream().anyMatch(a -> a.getId().equals(entity.getId()))) {
            activites.add(entity);
            saveToFile();
        }
    }

    @Override
    public Activite getById(String id) {
        return activites.stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Activite> getAll() {
        return new ArrayList<>(activites);
    }

    @Override
    public void update(Activite entity) {
        Activite existing = getById(entity.getId());
        if (existing != null) {
            activites.remove(existing);
            activites.add(entity);
            saveToFile();
        }
    }

    @Override
    public void delete(String id) {
        activites.removeIf(a -> a.getId().equals(id));
        saveToFile();
    }

    @Override
    public void saveAll(List<Activite> entities) {
        activites.addAll(entities);
        saveToFile();
    }

    public List<Activite> filtrerParCapaciteDisponible() {
        return activites.stream()
                .filter(Activite::aDesplacesDisponibles)
                .toList();
    }

    private void saveToFile() {
        try {
            String json = JsonUtil.toJson(activites);
            JsonUtil.saveToFile(DATA_FILE, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadFromFile() {
        try {
            if (JsonUtil.fileExists(DATA_FILE)) {
                String json = JsonUtil.readFromFile(DATA_FILE);
                activites = JsonUtil.fromJson(json, new TypeToken<List<Activite>>(){}.getType());
            }
        } catch (IOException e) {
            activites = new ArrayList<>();
        }
    }
}
