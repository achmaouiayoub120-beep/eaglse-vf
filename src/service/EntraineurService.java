package service;

import model.Entraineur;
import model.Activite;
import repository.EntraineurRepository;
import repository.ActiviteRepository;
import java.util.*;

/**
 * Service for managing trainers/coaches.
 */
public class EntraineurService {
    private EntraineurRepository entraineurRepo;
    private ActiviteRepository activiteRepo;

    public EntraineurService(EntraineurRepository entraineurRepo, ActiviteRepository activiteRepo) {
        this.entraineurRepo = entraineurRepo;
        this.activiteRepo = activiteRepo;
    }

    public void ajouterEntraineur(Entraineur entraineur) throws Exception {
        if (entraineur.getNom() == null || entraineur.getNom().isEmpty()) {
            throw new Exception("Le nom de l'entraîneur est obligatoire");
        }
        if (entraineur.getSpecialite() == null || entraineur.getSpecialite().isEmpty()) {
            throw new Exception("La spécialité est obligatoire");
        }
        entraineurRepo.save(entraineur);
    }

    public void modifierEntraineur(Entraineur entraineur) throws Exception {
        if (entraineurRepo.getById(entraineur.getId()) == null) {
            throw new Exception("Entraîneur non trouvé");
        }
        entraineurRepo.update(entraineur);
    }

    public void supprimerEntraineur(String entraineurId) throws Exception {
        Entraineur entraineur = entraineurRepo.getById(entraineurId);
        if (entraineur == null) {
            throw new Exception("Entraîneur non trouvé");
        }

        // Remove from all activities
        for (String activiteId : entraineur.getActiviteIds()) {
            Activite activite = activiteRepo.getById(activiteId);
            if (activite != null) {
                activite.setEntraineurId(null);
                activiteRepo.update(activite);
            }
        }

        entraineurRepo.delete(entraineurId);
    }

    public Entraineur obtenirEntraineur(String entraineurId) {
        return entraineurRepo.getById(entraineurId);
    }

    public List<Entraineur> obtenirTousEntraineurs() {
        return entraineurRepo.getAll();
    }

    public void affecterActivite(String entraineurId, String activiteId) throws Exception {
        Entraineur entraineur = entraineurRepo.getById(entraineurId);
        if (entraineur == null) {
            throw new Exception("Entraîneur non trouvé");
        }

        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }

        entraineur.affecterActivite(activiteId);
        activite.setEntraineurId(entraineurId);

        entraineurRepo.update(entraineur);
        activiteRepo.update(activite);
    }

    public void retirerActivite(String entraineurId, String activiteId) throws Exception {
        Entraineur entraineur = entraineurRepo.getById(entraineurId);
        if (entraineur == null) {
            throw new Exception("Entraîneur non trouvé");
        }

        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }

        entraineur.retirerActivite(activiteId);
        activite.setEntraineurId(null);

        entraineurRepo.update(entraineur);
        activiteRepo.update(activite);
    }

    public List<Activite> obtenirActivitesEntraineur(String entraineurId) {
        Entraineur entraineur = entraineurRepo.getById(entraineurId);
        if (entraineur == null) return new ArrayList<>();

        List<Activite> result = new ArrayList<>();
        for (String activiteId : entraineur.getActiviteIds()) {
            Activite activite = activiteRepo.getById(activiteId);
            if (activite != null) {
                result.add(activite);
            }
        }
        return result;
    }

    public int compterEntraineurs() {
        return entraineurRepo.getAll().size();
    }
}
