package service;

import model.Activite;
import model.Adherent;
import repository.ActiviteRepository;
import repository.AdherentRepository;
import java.util.*;

/**
 * Service for managing activities.
 */
public class ActiviteService {
    private ActiviteRepository activiteRepo;
    private AdherentRepository adherentRepo;

    public ActiviteService(ActiviteRepository activiteRepo, AdherentRepository adherentRepo) {
        this.activiteRepo = activiteRepo;
        this.adherentRepo = adherentRepo;
    }

    public void ajouterActivite(Activite activite) throws Exception {
        if (activite.getNom() == null || activite.getNom().isEmpty()) {
            throw new Exception("Le nom de l'activité est obligatoire");
        }
        if (activite.getCapacite() <= 0) {
            throw new Exception("La capacité doit être positive");
        }
        activiteRepo.save(activite);
    }

    public void modifierActivite(Activite activite) throws Exception {
        if (activiteRepo.getById(activite.getId()) == null) {
            throw new Exception("Activité non trouvée");
        }
        activiteRepo.update(activite);
    }

    public void supprimerActivite(String activiteId) throws Exception {
        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }

        // Remove from all adherents
        for (String adherentId : activite.getAdherentIds()) {
            Adherent adherent = adherentRepo.getById(adherentId);
            if (adherent != null) {
                adherent.desinscrireActivite(activiteId);
                adherentRepo.update(adherent);
            }
        }

        activiteRepo.delete(activiteId);
    }

    public Activite obtenirActivite(String activiteId) {
        return activiteRepo.getById(activiteId);
    }

    public List<Activite> obtenirToutesActivites() {
        return activiteRepo.getAll();
    }

    public List<Activite> obtenirActivitesAvecPlaces() {
        return activiteRepo.filtrerParCapaciteDisponible();
    }

    public List<Adherent> obtenirAdherentsInscrits(String activiteId) {
        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) return new ArrayList<>();

        List<Adherent> result = new ArrayList<>();
        for (String adherentId : activite.getAdherentIds()) {
            Adherent adherent = adherentRepo.getById(adherentId);
            if (adherent != null) {
                result.add(adherent);
            }
        }
        return result;
    }

    public void affecterEntraineur(String activiteId, String entraineurId) throws Exception {
        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }
        activite.setEntraineurId(entraineurId);
        activiteRepo.update(activite);
    }

    public int compterActivites() {
        return activiteRepo.getAll().size();
    }

    public double calculerTauxRemplissage(String activiteId) {
        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) return 0;
        return (double) activite.getNbInscrits() / activite.getCapacite() * 100;
    }
}
