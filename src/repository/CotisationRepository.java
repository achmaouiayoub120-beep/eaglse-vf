package repository;

import model.Cotisation;
import util.JsonUtil;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

/**
 * Repository for managing Cotisation persistence with JSON storage.
 */
public class CotisationRepository implements Repository<Cotisation> {
    private static final String DATA_FILE = "data/cotisations.json";
    private List<Cotisation> cotisations;

    public CotisationRepository() {
        this.cotisations = new ArrayList<>();
        loadFromFile();
    }

    @Override
    public void save(Cotisation entity) {
        if (!cotisations.stream().anyMatch(c -> c.getId().equals(entity.getId()))) {
            cotisations.add(entity);
            saveToFile();
        }
    }

    @Override
    public Cotisation getById(String id) {
        return cotisations.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Cotisation> getAll() {
        return new ArrayList<>(cotisations);
    }

    @Override
    public void update(Cotisation entity) {
        Cotisation existing = getById(entity.getId());
        if (existing != null) {
            cotisations.remove(existing);
            cotisations.add(entity);
            saveToFile();
        }
    }

    @Override
    public void delete(String id) {
        cotisations.removeIf(c -> c.getId().equals(id));
        saveToFile();
    }

    @Override
    public void saveAll(List<Cotisation> entities) {
        cotisations.addAll(entities);
        saveToFile();
    }

    public List<Cotisation> filtrerParAdherent(String adherentId) {
        return cotisations.stream()
                .filter(c -> c.getAdherentId().equals(adherentId))
                .toList();
    }

    public List<Cotisation> filtrerParStatut(Cotisation.StatutCotisation statut) {
        return cotisations.stream()
                .filter(c -> c.getStatut() == statut)
                .toList();
    }

    public double calculerTotalPaye() {
        return cotisations.stream()
                .filter(Cotisation::estPayee)
                .mapToDouble(Cotisation::getMontant)
                .sum();
    }

    public int compterPayees() {
        return (int) cotisations.stream()
                .filter(Cotisation::estPayee)
                .count();
    }

    public int compterNonPayees() {
        return (int) cotisations.stream()
                .filter(c -> !c.estPayee())
                .count();
    }

    private void saveToFile() {
        try {
            String json = JsonUtil.toJson(cotisations);
            JsonUtil.saveToFile(DATA_FILE, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadFromFile() {
        try {
            if (JsonUtil.fileExists(DATA_FILE)) {
                String json = JsonUtil.readFromFile(DATA_FILE);
                cotisations = JsonUtil.fromJson(json, new TypeToken<List<Cotisation>>(){}.getType());
            }
        } catch (IOException e) {
            cotisations = new ArrayList<>();
        }
    }
}
