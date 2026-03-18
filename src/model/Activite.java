package model;

import java.io.Serializable;
import java.util.*;

/**
 * Represents a sports activity in the club.
 */
public class Activite implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String nom;
    private int capacite;
    private String entraineurId;
    private List<String> adherentIds;
    private String description;

    public Activite() {
        this.id = UUID.randomUUID().toString();
        this.adherentIds = new ArrayList<>();
    }

    public Activite(String nom, int capacite, String description) {
        this();
        this.nom = nom;
        this.capacite = capacite;
        this.description = description;
        this.adherentIds = new ArrayList<>();
    }

    public Activite(String id, String nom, int capacite, String entraineurId, List<String> adherentIds, String description) {
        this.id = id;
        this.nom = nom;
        this.capacite = capacite;
        this.entraineurId = entraineurId;
        this.adherentIds = adherentIds != null ? new ArrayList<>(adherentIds) : new ArrayList<>();
        this.description = description;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public int getCapacite() {
        return capacite;
    }

    public void setCapacite(int capacite) {
        this.capacite = capacite;
    }

    public String getEntraineurId() {
        return entraineurId;
    }

    public void setEntraineurId(String entraineurId) {
        this.entraineurId = entraineurId;
    }

    public List<String> getAdherentIds() {
        return new ArrayList<>(adherentIds);
    }

    public void setAdherentIds(List<String> adherentIds) {
        this.adherentIds = adherentIds != null ? new ArrayList<>(adherentIds) : new ArrayList<>();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPlaceDisponible() {
        return capacite - adherentIds.size();
    }

    public boolean aDesplacesDisponibles() {
        return getPlaceDisponible() > 0;
    }

    public void inscrireAdherent(String adherentId) {
        if (!adherentIds.contains(adherentId) && aDesplacesDisponibles()) {
            adherentIds.add(adherentId);
        }
    }

    public void desinscrireAdherent(String adherentId) {
        adherentIds.remove(adherentId);
    }

    public boolean contientAdherent(String adherentId) {
        return adherentIds.contains(adherentId);
    }

    public int getNbInscrits() {
        return adherentIds.size();
    }

    @Override
    public String toString() {
        return "Activite{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                ", capacite=" + capacite +
                ", entraineurId='" + entraineurId + '\'' +
                ", nbInscrits=" + adherentIds.size() +
                '}';
    }
}
