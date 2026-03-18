package model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Represents a membership fee/contribution payment.
 */
public class Cotisation implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum StatutCotisation {
        PAYEE, NON_PAYEE
    }

    private String id;
    private double montant;
    private LocalDate datePaiement;
    private StatutCotisation statut;
    private String adherentId;

    public Cotisation() {
        this.id = UUID.randomUUID().toString();
        this.statut = StatutCotisation.NON_PAYEE;
    }

    public Cotisation(double montant, String adherentId) {
        this();
        this.montant = montant;
        this.adherentId = adherentId;
    }

    public Cotisation(String id, double montant, LocalDate datePaiement, StatutCotisation statut, String adherentId) {
        this.id = id;
        this.montant = montant;
        this.datePaiement = datePaiement;
        this.statut = statut;
        this.adherentId = adherentId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public LocalDate getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDate datePaiement) {
        this.datePaiement = datePaiement;
    }

    public StatutCotisation getStatut() {
        return statut;
    }

    public void setStatut(StatutCotisation statut) {
        this.statut = statut;
    }

    public String getAdherentId() {
        return adherentId;
    }

    public void setAdherentId(String adherentId) {
        this.adherentId = adherentId;
    }

    public void payer(LocalDate datePaiement) {
        this.statut = StatutCotisation.PAYEE;
        this.datePaiement = datePaiement;
    }

    public boolean estPayee() {
        return statut == StatutCotisation.PAYEE;
    }

    @Override
    public String toString() {
        return "Cotisation{" +
                "id='" + id + '\'' +
                ", montant=" + montant +
                ", statut=" + statut +
                ", datePaiement=" + datePaiement +
                '}';
    }
}
