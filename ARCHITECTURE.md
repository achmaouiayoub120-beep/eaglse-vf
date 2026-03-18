# Architecture Détaillée - Club Manager

## Vue d'Ensemble

Club Manager suit une architecture **3-couches** avec séparation claire des responsabilités :

\`\`\`
┌─────────────────────────────────────────┐
│         Couche Présentation             │
│  (JavaFX Controllers & FXML Views)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Couche Métier (Services)         │
│  (Logique Applicative & Validation)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Couche Persistance (Repositories)  │
│    (Accès aux Données & JSON)           │
└─────────────────────────────────────────┘
\`\`\`

## Couche 1 : Présentation (Controller & View)

### Responsabilités
- Gestion des événements utilisateur (clics, saisies)
- Affichage des données dans l'interface
- Communication avec la couche métier via les services
- Navigation entre les écrans

### Composants
- **MainController** : Orchestrateur principal, gestion du cycle de vie
- **DashboardController** : Statistiques et graphiques
- **AdherentsController, ActivitesController, etc.** : Gestion CRUD spécifique

### Exemple de Flux
\`\`\`
Utilisateur clique → JavaFX Event → Controller → Service.method() → Repository → JSON
Réponse ← Mise à jour TableView ← Refresh UI ← Controller
\`\`\`

## Couche 2 : Métier (Services)

### Responsabilités
- **Validation** des données (type, longueur, obligatoire)
- **Logique Applicative** complexe (inscriptions, calculs)
- **Transactions** (modifications cohérentes)
- **Gestion des Erreurs** et exceptions
- **Indépendance** vis-à-vis de la persistance

### Services Disponibles
- **AdherentService** : Inscriptions, recherches
- **ActiviteService** : Gestion capacité, occupancy
- **EntraineurService** : Affectations d'activités
- **CotisationService** : Paiements, statistiques

### Pattern Utilisé
\`\`\`java
public class AdherentService {
    public void inscrireAActivite(String adherentId, String activiteId) throws Exception {
        // 1. Validation
        Adherent adherent = adherentRepo.getById(adherentId);
        if (adherent == null) throw new Exception("Adhérent non trouvé");
        
        // 2. Logique métier
        Activite activite = activiteRepo.getById(activiteId);
        if (!activite.aDesplacesDisponibles()) throw new Exception("Complet");
        
        // 3. Transaction
        adherent.inscrireActivite(activiteId);
        activite.inscrireAdherent(adherentId);
        
        // 4. Persistance
        adherentRepo.update(adherent);
        activiteRepo.update(activite);
    }
}
\`\`\`

## Couche 3 : Persistance (Repositories)

### Responsabilités
- Opérations CRUD génériques
- Sérialisation/Désérialisation JSON
- Gestion des fichiers
- Requêtes et filtres spécialisés

### Interface Générique
\`\`\`java
public interface Repository<T> {
    void save(T entity);
    T getById(String id);
    List<T> getAll();
    void update(T entity);
    void delete(String id);
    void saveAll(List<T> entities);
}
\`\`\`

### Implémentations Spécifiques
Chaque repository ajoute des méthodes spécialisées :
- **AdherentRepository** : `rechercher(keyword)`
- **ActiviteRepository** : `filtrerParCapaciteDisponible()`
- **CotisationRepository** : `calculerTotalPaye()`, `compterPayees()`

### Structure JSON
\`\`\`
data/
├── adherents.json      [id, nom, prenom, email, activiteIds, cotisation]
├── activites.json      [id, nom, capacite, entraineurId, adherentIds, description]
├── entraineurs.json    [id, nom, specialite, activiteIds]
└── cotisations.json    [id, montant, datePaiement, statut, adherentId]
\`\`\`

## Patterns et Principes

### 1. Inversion de Contrôle (IoC)
\`\`\`
Controllers → Services → Repositories → Fichiers
     ▲           ▲            ▲
     └───────────┴────────────┴── Injection via constructeurs
\`\`\`

### 2. Séparation des Préoccupations
- **Métier** ≠ **Persistance** ≠ **Présentation**
- Services ignorent les détails JSON
- Controllers ignorent la logique métier

### 3. Repository Pattern
- Abstraction du stockage (JSON aujourd'hui, DB demain)
- Interface commune pour toutes les entités
- Encapsulation des opérations CRUD

### 4. SOLID en Action

**S (Single Responsibility)**
\`\`\`
AdherentService → Gère la logique adhérents
AdherentRepository → Gère la persistance adhérents
AdherentsController → Gère l'affichage adhérents
\`\`\`

**O (Open/Closed)**
\`\`\`
Repository<T> interface → Facile d'ajouter nouvelles entités
Services utilisent repos → Pas besoin de modification
\`\`\`

**L (Liskov Substitution)**
\`\`\`
Repository<Adherent> repo = new AdherentRepository();
// Peut être remplacée par une autre implémentation sans changement
\`\`\`

**I (Interface Segregation)**
\`\`\`
Repository<T> = Interface générique pour tous les types
Chaque repo ajoute des méthodes spécifiques
\`\`\`

**D (Dependency Inversion)**
\`\`\`
Services dépendent d'abstractions (Repository interface)
Pas de dépendances circulaires
\`\`\`

## Fluxe de Données - Cas d'Utilisation : Ajouter un Adhérent

### 1. Événement Utilisateur
\`\`\`java
// AdherentsController.java
addButton.setOnAction(e -> handleAddAdherent());
\`\`\`

### 2. Validation UI
\`\`\`java
if (nomField.getText().isEmpty()) {
    showAlert("Erreur", "Nom obligatoire");
    return;
}
\`\`\`

### 3. Création d'Objet
\`\`\`java
Adherent adherent = new Adherent(nom, prenom, email);
\`\`\`

### 4. Appel au Service
\`\`\`java
adherentService.ajouterAdherent(adherent);  // Validation métier
\`\`\`

### 5. Persistance
\`\`\`java
adherentRepo.save(adherent);  // Sauvegarde JSON
\`\`\`

### 6. Rafraîchissement UI
\`\`\`java
loadAdherents();  // Recharge depuis JSON
adherentsTable.setItems(adherentsList);  // Affiche dans tableau
\`\`\`

## Gestion des Erreurs

### Niveaux d'Erreur
\`\`\`
┌─ Controller (Gestion UI)
│  └─ Service (Logique métier)
│     └─ Repository (Persistance)
│        └─ Fichier (IO)
└─ Affichage Alert à l'utilisateur
\`\`\`

### Exemple
\`\`\`java
try {
    // 1. Service valide et exécute
    adherentService.ajouterAdherent(adherent);
    // 2. Repository persiste
    // 3. Succès
    showAlert("Succès", "Adhérent ajouté");
} catch (Exception ex) {
    // 4. Capture erreur à n'importe quel niveau
    showAlert("Erreur", ex.getMessage());
}
\`\`\`

## Extensions Possibles

### 1. Migration vers Base de Données
\`\`\`
Créer: SQLAdherentRepository implements Repository<Adherent>
Remplacer: new AdherentRepository() → new SQLAdherentRepository()
Services: Aucun changement nécessaire !
\`\`\`

### 2. Ajout d'Authentification
\`\`\`
Créer: AuthService
Modifier: MainController pour demander login
Ajouter: Permissions dans Services
\`\`\`

### 3. Export/Import
\`\`\`
Créer: ExportService (PDF, Excel)
Ajouter: Bouton dans UI
Utiliser: Données depuis Services
\`\`\`

### 4. Cache et Performance
\`\`\`
Ajouter: CachedRepository<T> décorateur
Implémenter: Invalidation intelligente
Modifier: Initialisation des repos
\`\`\`

## Conclusion

Cette architecture offre :
- **Maintenabilité** : Chaque couche bien définie
- **Testabilité** : Services testables indépendamment
- **Extensibilité** : Facile d'ajouter des fonctionnalités
- **Réutilisabilité** : Services agnostiques de la persistance
