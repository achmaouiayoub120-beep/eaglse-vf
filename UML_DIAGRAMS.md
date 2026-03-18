# Diagrammes UML - Club Manager

## 1. Diagramme de Classes

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                          Adherent                                │
├─────────────────────────────────────────────────────────────────┤
│ - id: String (UUID)                                             │
│ - nom: String                                                   │
│ - prenom: String                                                │
│ - email: String                                                 │
│ - activiteIds: List<String>                                     │
│ - cotisation: Cotisation                                        │
├─────────────────────────────────────────────────────────────────┤
│ + getNomComplet(): String                                       │
│ + inscrireActivite(activiteId: String): void                    │
│ + desinscrireActivite(activiteId: String): void                 │
│ + estInscritA(activiteId: String): boolean                      │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 1..*
        │ inscription
        │
        └──────────────────┐
                           │
┌─────────────────────────────────────────────────────────────────┐
│                          Activite                                │
├─────────────────────────────────────────────────────────────────┤
│ - id: String (UUID)                                             │
│ - nom: String                                                   │
│ - capacite: int                                                 │
│ - entraineurId: String (FK)                                     │
│ - adherentIds: List<String>                                     │
│ - description: String                                           │
├─────────────────────────────────────────────────────────────────┤
│ + getPlaceDisponible(): int                                     │
│ + aDesplacesDisponibles(): boolean                              │
│ + inscrireAdherent(adherentId: String): void                    │
│ + desinscrireAdherent(adherentId: String): void                 │
│ + contientAdherent(adherentId: String): boolean                 │
│ + getNbInscrits(): int                                          │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 0..1
        │ encadrement
        │
        └──────────────────┐
                           │
┌─────────────────────────────────────────────────────────────────┐
│                       Entraineur                                 │
├─────────────────────────────────────────────────────────────────┤
│ - id: String (UUID)                                             │
│ - nom: String                                                   │
│ - specialite: String                                            │
│ - activiteIds: List<String>                                     │
├─────────────────────────────────────────────────────────────────┤
│ + affecterActivite(activiteId: String): void                    │
│ + retirerActivite(activiteId: String): void                     │
│ + getNbActivites(): int                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Cotisation                                  │
├─────────────────────────────────────────────────────────────────┤
│ - id: String (UUID)                                             │
│ - montant: double                                               │
│ - datePaiement: LocalDate                                       │
│ - statut: StatutCotisation (PAYEE, NON_PAYEE)                   │
│ - adherentId: String (FK)                                       │
├─────────────────────────────────────────────────────────────────┤
│ + payer(datePaiement: LocalDate): void                          │
│ + estPayee(): boolean                                           │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 1
        │ association
        │
        └──────────────────────── Adherent
\`\`\`

## 2. Diagramme de Cas d'Utilisation

\`\`\`
                              ┌─────────────────┐
                              │   Utilisateur   │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
            ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
            │   Gérer      │  │   Gérer      │  │    Gérer        │
            │  Adhérents   │  │  Activités   │  │   Entraîneurs   │
            └──────────────┘  └──────────────┘  └─────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────┐     ┌────┐     ┌────┐
    │CRUD│     │SRCH│     │ENRL│
    └────┘     └────┘     └────┘

                    ▼
            ┌──────────────┐
            │  Gérer       │
            │Cotisations   │
            └──────────────┘
                    │
            ┌───────┼───────┐
            │       │       │
            ▼       ▼       ▼
         ┌────┐ ┌────┐ ┌──────┐
         │CRUD│ │PAY │ │STATS │
         └────┘ └────┘ └──────┘
\`\`\`

## 3. Diagramme d'Activité - Inscription à Activité

\`\`\`
                        ┌─────┐
                        │Start│
                        └──┬──┘
                           │
                    ┌──────▼──────┐
                    │ Adhérent    │
                    │ sélectionne │
                    │ l'activité  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐      Non
                    │ Activité    ├─────────────┐
                    │ disponible? │             │
                    └──────┬──────┘             │
                         Oui                   │
                           │                   │
                    ┌──────▼──────┐            │
                    │Adhérent     │            │
                    │déjà inscrit?│      ┌─────▼──────┐
                    └──────┬──────┘      │Afficher    │
                         Non             │Erreur:     │
                           │              │Complet     │
                    ┌──────▼──────┐      └────────────┘
                    │ Ajouter     │
                    │ adhérent à  │
                    │ l'activité  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Mettre à    │
                    │ jour la BD  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │Afficher     │
                    │Succès       │
                    └──────┬──────┘
                           │
                        ┌──▼──┐
                        │ End │
                        └─────┘
\`\`\`

## 4. Diagramme d'Activité - Paiement Cotisation

\`\`\`
                        ┌─────┐
                        │Start│
                        └──┬──┘
                           │
                    ┌──────▼──────┐
                    │ Sélectionner│
                    │ cotisation  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Vérifier    │
                    │ statut      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐      Oui
                    │ Déjà payée? ├────────────┐
                    └──────┬──────┘            │
                         Non                  │
                           │            ┌─────▼──────┐
                           │            │Afficher    │
                           │            │Erreur      │
                           │            └────────────┘
                    ┌──────▼──────┐
                    │Choisir date │
                    │de paiement  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Mettre à    │
                    │ jour statut │
                    │ à PAYEE     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Sauvegarder │
                    │ dans JSON   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │Confirmer à  │
                    │ l'utilisateur
                    └──────┬──────┘
                           │
                        ┌──▼──┐
                        │ End │
                        └─────┘
\`\`\`

## 5. Diagramme Entités-Associations

\`\`\`
Adhérent (1) ────── (0..*) Activité
   │                         │
   │ 1                       │ 0..1
   │                         │
   └─── (1) Cotisation ───── Entraîneur (0..*)
       (1)                      (0..*)
\`\`\`

## 6. Diagramme de Séquence - Inscription Adhérent

\`\`\`
Utilisateur      Interface      Service         Repository       Fichier JSON
    │                │              │                │                 │
    ├──Clique Add────▶│              │                │                 │
    │                │              │                │                 │
    │                ├──Add────────▶ │                │                 │
    │                │              │                │                 │
    │                │              ├──Valide─────▶  │                 │
    │                │              │                │                 │
    │                │              │    OK           │                 │
    │                │              │◀───────────────│                 │
    │                │              │                │                 │
    │                │              ├──Save────────▶ │                 │
    │                │              │                │                 │
    │                │              │                ├──Write──────────▶│
    │                │              │                │                 │
    │                │              │                │◀────OK───────────│
    │                │              │◀───OK──────────│                 │
    │                │◀──Succès─────│                │                 │
    │◀──Affichage────│                │                │                 │
    │                │                │                │                 │
\`\`\`

## 7. Diagramme de Dépendance

\`\`\`
┌──────────────────────────────────────────────────────┐
│                    MainController                    │
│         (Initialisation et Navigation)                │
└──────┬───────────────────────────────────────────────┘
       │
       ├──────────────────┬────────────────────┬──────────────────┐
       │                  │                    │                  │
       ▼                  ▼                    ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Dashboard     │  │Adherents     │  │Activites     │  │Cotisations   │
│Controller    │  │Controller    │  │Controller    │  │Controller    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │                  │
       └──────────────────┼──────────────────┼──────────────────┘
                          │                  │
                    ┌─────▼──────────────────▼─────┐
                    │      Services Layer           │
                    │                               │
                    │ AdherentService               │
                    │ ActiviteService               │
                    │ EntraineurService             │
                    │ CotisationService             │
                    └─────┬──────────────────┬─────┘
                          │                  │
                    ┌─────▼──────────────────▼─────┐
                    │   Repository Layer            │
                    │                               │
                    │ AdherentRepository            │
                    │ ActiviteRepository            │
                    │ EntraineurRepository          │
                    │ CotisationRepository          │
                    └─────┬──────────────────┬─────┘
                          │                  │
                    ┌─────▼──────────────────▼─────┐
                    │   Data Layer (JSON Files)     │
                    │                               │
                    │ adherents.json                │
                    │ activites.json                │
                    │ entraineurs.json              │
                    │ cotisations.json              │
                    └───────────────────────────────┘
\`\`\`

## 8. Matrice RACI

\`\`\`
┌─────────────┬─────────┬────────┬──────────┬──────────┐
│   Tâche     │ Modèle  │Service │Repository│Controller│
├─────────────┼─────────┼────────┼──────────┼──────────┤
│ Validation  │    A    │   R    │    -     │    C     │
│ Persistance │    -    │   C    │    A,R   │    -     │
│ Navigation  │    -    │   -    │    -     │    A,R   │
│ Logique     │    -    │   A,R  │    C     │    -     │
│ Affichage   │    -    │   C    │    -     │    A,R   │
└─────────────┴─────────┴────────┴──────────┴──────────┘

A = Responsable (Accountable)
R = Réalisateur (Responsible)
C = Consulté (Consulted)
