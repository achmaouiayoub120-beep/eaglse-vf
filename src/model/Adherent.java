package model;

import java.io.Serializable;
import java.util.*;

/**
 * Represents a club member (adherent).
 */
public class Adherent implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private List<String> activiteIds;
    private Cotisation cotisation;

    public Adherent() {
        this.id = UUID.randomUUID().toString();
        this.activiteIds = new ArrayList<>();
    }

    public Adherent(String nom, String prenom, String email) {
        this();
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.activiteIds = new ArrayList<>();
    }

    public Adherent(String id, String nom, String prenom, String email, List<String> activiteIds, Cotisation cotisation) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.activiteIds = activiteIds != null ? new ArrayList<>(activiteIds) : new ArrayList<>();
        this.cotisation = cotisation;
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

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getActiviteIds() {
        return new ArrayList<>(activiteIds);
    }

    public void setActiviteIds(List<String> activiteIds) {
        this.activiteIds = activiteIds != null ? new ArrayList<>(activiteIds) : new ArrayList<>();
    }

    public Cotisation getCotisation() {
        return cotisation;
    }

    public void setCotisation(Cotisation cotisation) {
        this.cotisation = cotisation;
    }

    public String getNomComplet() {
        return prenom + " " + nom;
    }

    public void inscrireActivite(String activiteId) {
        if (!activiteIds.contains(activiteId)) {
            activiteIds.add(activiteId);
        }
    }

    public void desinscrireActivite(String activiteId) {
        activiteIds.remove(activiteId);
    }

    public boolean estInscritA(String activiteId) {
        return activiteIds.contains(activiteId);
    }

    @Override
    public String toString() {
        return "Adherent{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", activiteIds=" + activiteIds +
                '}';
    }
}
