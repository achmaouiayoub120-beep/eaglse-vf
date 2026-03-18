package repository;

import model.*;
import java.time.LocalDate;
import java.util.*;

/**
 * Initializes test data for the application.
 */
public class DataInitializer {
    private static AdherentRepository adherentRepo;
    private static ActiviteRepository activiteRepo;
    private static EntraineurRepository entraineurRepo;
    private static CotisationRepository cotisationRepo;

    public static void initializeData() {
        adherentRepo = new AdherentRepository();
        activiteRepo = new ActiviteRepository();
        entraineurRepo = new EntraineurRepository();
        cotisationRepo = new CotisationRepository();

        if (adherentRepo.getAll().isEmpty()) {
            initializeEntraineurs();
            initializeActivites();
            initializeAdherents();
            initializeCotisations();
        }
    }

    private static void initializeEntraineurs() {
        Entraineur e1 = new Entraineur("Jean Dupont", "Football");
        Entraineur e2 = new Entraineur("Marie Martin", "Natation");
        Entraineur e3 = new Entraineur("Pierre Bernard", "Tennis");

        entraineurRepo.save(e1);
        entraineurRepo.save(e2);
        entraineurRepo.save(e3);
    }

    private static void initializeActivites() {
        List<Entraineur> entraineurs = entraineurRepo.getAll();
        Activite a1 = new Activite("Football Senior", 20, "Football pour adultes");
        a1.setEntraineurId(entraineurs.get(0).getId());
        Activite a2 = new Activite("Natation Loisir", 15, "Cours de natation débutant");
        a2.setEntraineurId(entraineurs.get(1).getId());
        Activite a3 = new Activite("Tennis Compétition", 10, "Tennis pour compétiteurs");
        a3.setEntraineurId(entraineurs.get(2).getId());
        Activite a4 = new Activite("Yoga", 12, "Yoga et bien-être");

        activiteRepo.save(a1);
        activiteRepo.save(a2);
        activiteRepo.save(a3);
        activiteRepo.save(a4);
    }

    private static void initializeAdherents() {
        List<Activite> activites = activiteRepo.getAll();

        Adherent ad1 = new Adherent("Lefebvre", "Michel", "michel.lefebvre@mail.com");
        ad1.inscrireActivite(activites.get(0).getId());
        ad1.inscrireActivite(activites.get(3).getId());
        Adherent ad2 = new Adherent("Rousseau", "Sophie", "sophie.rousseau@mail.com");
        ad2.inscrireActivite(activites.get(1).getId());
        Adherent ad3 = new Adherent("Moreau", "Luc", "luc.moreau@mail.com");
        ad3.inscrireActivite(activites.get(2).getId());
        Adherent ad4 = new Adherent("Fontaine", "Claire", "claire.fontaine@mail.com");
        ad4.inscrireActivite(activites.get(1).getId());
        Adherent ad5 = new Adherent("Laurent", "Thomas", "thomas.laurent@mail.com");
        ad5.inscrireActivite(activites.get(0).getId());

        adherentRepo.save(ad1);
        adherentRepo.save(ad2);
        adherentRepo.save(ad3);
        adherentRepo.save(ad4);
        adherentRepo.save(ad5);

        // Update activities with adherents
        for (Activite a : activites) {
            activiteRepo.update(a);
        }
    }

    private static void initializeCotisations() {
        List<Adherent> adherents = adherentRepo.getAll();

        Cotisation c1 = new Cotisation(150.0, adherents.get(0).getId());
        c1.payer(LocalDate.now().minusMonths(1));
        Cotisation c2 = new Cotisation(150.0, adherents.get(1).getId());
        c2.payer(LocalDate.now());
        Cotisation c3 = new Cotisation(150.0, adherents.get(2).getId());
        Cotisation c4 = new Cotisation(150.0, adherents.get(3).getId());
        c4.payer(LocalDate.now().minusMonths(2));
        Cotisation c5 = new Cotisation(150.0, adherents.get(4).getId());

        cotisationRepo.save(c1);
        cotisationRepo.save(c2);
        cotisationRepo.save(c3);
        cotisationRepo.save(c4);
        cotisationRepo.save(c5);
    }

    public static AdherentRepository getAdherentRepository() {
        return adherentRepo;
    }

    public static ActiviteRepository getActiviteRepository() {
        return activiteRepo;
    }

    public static EntraineurRepository getEntraineurRepository() {
        return entraineurRepo;
    }

    public static CotisationRepository getCotisationRepository() {
        return cotisationRepo;
    }
}
