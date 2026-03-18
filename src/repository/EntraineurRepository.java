package repository;

import model.Entraineur;
import util.JsonUtil;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.util.*;

/**
 * Repository for managing Entraineur persistence with JSON storage.
 */
public class EntraineurRepository implements Repository<Entraineur> {
    private static final String DATA_FILE = "data/entraineurs.json";
    private List<Entraineur> entraineurs;

    public EntraineurRepository() {
        this.entraineurs = new ArrayList<>();
        loadFromFile();
    }

    @Override
    public void save(Entraineur entity) {
        if (!entraineurs.stream().anyMatch(e -> e.getId().equals(entity.getId()))) {
            entraineurs.add(entity);
            saveToFile();
        }
    }

    @Override
    public Entraineur getById(String id) {
        return entraineurs.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Entraineur> getAll() {
        return new ArrayList<>(entraineurs);
    }

    @Override
    public void update(Entraineur entity) {
        Entraineur existing = getById(entity.getId());
        if (existing != null) {
            entraineurs.remove(existing);
            entraineurs.add(entity);
            saveToFile();
        }
    }

    @Override
    public void delete(String id) {
        entraineurs.removeIf(e -> e.getId().equals(id));
        saveToFile();
    }

    @Override
    public void saveAll(List<Entraineur> entities) {
        entraineurs.addAll(entities);
        saveToFile();
    }

    private void saveToFile() {
        try {
            String json = JsonUtil.toJson(entraineurs);
            JsonUtil.saveToFile(DATA_FILE, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadFromFile() {
        try {
            if (JsonUtil.fileExists(DATA_FILE)) {
                String json = JsonUtil.readFromFile(DATA_FILE);
                entraineurs = JsonUtil.fromJson(json, new TypeToken<List<Entraineur>>(){}.getType());
            }
        } catch (IOException e) {
            entraineurs = new ArrayList<>();
        }
    }
}
