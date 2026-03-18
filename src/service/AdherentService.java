package service;

import model.Adherent;
import model.Activite;
import repository.AdherentRepository;
import repository.ActiviteRepository;
import java.util.*;

/**
 * Service for managing members (adherents).
 */
public class AdherentService {
    private AdherentRepository adherentRepo;
    private ActiviteRepository activiteRepo;

    public AdherentService(AdherentRepository adherentRepo, ActiviteRepository activiteRepo) {
        this.adherentRepo = adherentRepo;
        this.activiteRepo = activiteRepo;
    }

    public void ajouterAdherent(Adherent adherent) throws Exception {
        if (adherent.getNom() == null || adherent.getNom().isEmpty()) {
            throw new Exception("Le nom est obligatoire");
        }
        if (adherent.getEmail() == null || adherent.getEmail().isEmpty()) {
            throw new Exception("L'email est obligatoire");
        }
        adherentRepo.save(adherent);
    }

    public void modifierAdherent(Adherent adherent) throws Exception {
        if (adherentRepo.getById(adherent.getId()) == null) {
            throw new Exception("Adhérent non trouvé");
        }
        adherentRepo.update(adherent);
    }

    public void supprimerAdherent(String adherentId) throws Exception {
        Adherent adherent = adherentRepo.getById(adherentId);
        if (adherent == null) {
            throw new Exception("Adhérent non trouvé");
        }
        // Remove from all activities
        for (String activiteId : adherent.getActiviteIds()) {
            Activite activite = activiteRepo.getById(activiteId);
            if (activite != null) {
                activite.desinscrireAdherent(adherentId);
                activiteRepo.update(activite);
            }
        }
        adherentRepo.delete(adherentId);
    }

    public Adherent obtenirAdherent(String adherentId) {
        return adherentRepo.getById(adherentId);
    }

    public List<Adherent> obtenirTousAdherents() {
        return adherentRepo.getAll();
    }

    public void inscrireAActivite(String adherentId, String activiteId) throws Exception {
        Adherent adherent = adherentRepo.getById(adherentId);
        if (adherent == null) {
            throw new Exception("Adhérent non trouvé");
        }

        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }

        if (adherent.estInscritA(activiteId)) {
            throw new Exception("L'adhérent est déjà inscrit à cette activité");
        }

        if (!activite.aDesplacesDisponibles()) {
            throw new Exception("Activité complète");
        }

        adherent.inscrireActivite(activiteId);
        activite.inscrireAdherent(adherentId);

        adherentRepo.update(adherent);
        activiteRepo.update(activite);
    }

    public void desinscrireDeActivite(String adherentId, String activiteId) throws Exception {
        Adherent adherent = adherentRepo.getById(adherentId);
        if (adherent == null) {
            throw new Exception("Adhérent non trouvé");
        }

        Activite activite = activiteRepo.getById(activiteId);
        if (activite == null) {
            throw new Exception("Activité non trouvée");
        }

        adherent.desinscrireActivite(activiteId);
        activite.desinscrireAdherent(adherentId);

        adherentRepo.update(adherent);
        activiteRepo.update(activite);
    }

    public List<Adherent> rechercherAdherents(String keyword) {
        return adherentRepo.rechercher(keyword);
    }

    public int compterAdherents() {
        return adherentRepo.getAll().size();
    }
}
