package service;

import model.Cotisation;
import model.Adherent;
import repository.CotisationRepository;
import repository.AdherentRepository;
import java.time.LocalDate;
import java.util.*;

/**
 * Service for managing membership fees and payments.
 */
public class CotisationService {
    private CotisationRepository cotisationRepo;
    private AdherentRepository adherentRepo;

    public CotisationService(CotisationRepository cotisationRepo, AdherentRepository adherentRepo) {
        this.cotisationRepo = cotisationRepo;
        this.adherentRepo = adherentRepo;
    }

    public void ajouterCotisation(Cotisation cotisation) throws Exception {
        if (cotisation.getMontant() <= 0) {
            throw new Exception("Le montant doit être positif");
        }
        Adherent adherent = adherentRepo.getById(cotisation.getAdherentId());
        if (adherent == null) {
            throw new Exception("Adhérent non trouvé");
        }
        cotisationRepo.save(cotisation);
    }

    public void modifierCotisation(Cotisation cotisation) throws Exception {
        if (cotisationRepo.getById(cotisation.getId()) == null) {
            throw new Exception("Cotisation non trouvée");
        }
        cotisationRepo.update(cotisation);
    }

    public void supprimerCotisation(String cotisationId) throws Exception {
        Cotisation cotisation = cotisationRepo.getById(cotisationId);
        if (cotisation == null) {
            throw new Exception("Cotisation non trouvée");
        }
        cotisationRepo.delete(cotisationId);
    }

    public Cotisation obtenirCotisation(String cotisationId) {
        return cotisationRepo.getById(cotisationId);
    }

    public List<Cotisation> obtenirToutesCotisations() {
        return cotisationRepo.getAll();
    }

    public List<Cotisation> obtenirCotisationsAdherent(String adherentId) {
        return cotisationRepo.filtrerParAdherent(adherentId);
    }

    public List<Cotisation> obtenirCotisationsPayees() {
        return cotisationRepo.filtrerParStatut(Cotisation.StatutCotisation.PAYEE);
    }

    public List<Cotisation> obtenirCotisationsNonPayees() {
        return cotisationRepo.filtrerParStatut(Cotisation.StatutCotisation.NON_PAYEE);
    }

    public void payerCotisation(String cotisationId, LocalDate datePaiement) throws Exception {
        Cotisation cotisation = cotisationRepo.getById(cotisationId);
        if (cotisation == null) {
            throw new Exception("Cotisation non trouvée");
        }
        cotisation.payer(datePaiement);
        cotisationRepo.update(cotisation);
    }

    public double obtenirStatistiquesTotales() {
        return cotisationRepo.calculerTotalPaye();
    }

    public int compterCotisationsPayees() {
        return cotisationRepo.compterPayees();
    }

    public int compterCotisationsNonPayees() {
        return cotisationRepo.compterNonPayees();
    }

    public Map<String, Object> obtenirStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPayee", obtenirStatistiquesTotales());
        stats.put("payees", compterCotisationsPayees());
        stats.put("nonPayees", compterCotisationsNonPayees());
        stats.put("total", obtenirToutesCotisations().size());
        return stats;
    }
}
