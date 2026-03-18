package model;

import java.io.Serializable;
import java.util.*;

/**
 * Represents a trainer/coach in the club.
 */
public class Entraineur implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String nom;
    private String specialite;
    private List<String> activiteIds;

    public Entraineur() {
        this.id = UUID.randomUUID().toString();
        this.activiteIds = new ArrayList<>();
    }

    public Entraineur(String nom, String specialite) {
        this();
        this.nom = nom;
        this.specialite = specialite;
        this.activiteIds = new ArrayList<>();
    }

    public Entraineur(String id, String nom, String specialite, List<String> activiteIds) {
        this.id = id;
        this.nom = nom;
        this.specialite = specialite;
        this.activiteIds = activiteIds != null ? new ArrayList<>(activiteIds) : new ArrayList<>();
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

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public List<String> getActiviteIds() {
        return new ArrayList<>(activiteIds);
    }

    public void setActiviteIds(List<String> activiteIds) {
        this.activiteIds = activiteIds != null ? new ArrayList<>(activiteIds) : new ArrayList<>();
    }

    public void affecterActivite(String activiteId) {
        if (!activiteIds.contains(activiteId)) {
            activiteIds.add(activiteId);
        }
    }

    public void retirerActivite(String activiteId) {
        activiteIds.remove(activiteId);
    }

    public int getNbActivites() {
        return activiteIds.size();
    }

    @Override
    public String toString() {
        return "Entraineur{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                ", specialite='" + specialite + '\'' +
                ", nbActivites=" + activiteIds.size() +
                '}';
    }
}
