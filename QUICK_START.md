# Démarrage Rapide

## Installation Rapide (5 minutes)

### 1. Java et Dépendances
\`\`\`bash
# Vérifier Java
java -version  # Doit afficher 11+

# Télécharger JavaFX SDK (si nécessaire)
# https://gluonhq.com/products/javafx/
\`\`\`

### 2. Compiler
\`\`\`bash
# Avec Maven (recommandé)
mvn clean compile

# Ou avec javac
javac -d bin src/**/*.java
\`\`\`

### 3. Exécuter
\`\`\`bash
# Avec Maven
mvn javafx:run

# Ou avec java
java --module-path /path/to/javafx/lib --add-modules javafx.controls,javafx.fxml -cp bin Main
\`\`\`

## Utilisation de Base

### Dashboard
- Vue complète des statistiques
- Graphiques de répartition
- Nombre d'adhérents et d'activités

### Adhérents
- Cliquer "Ajouter" → Remplir formulaire
- Rechercher par nom/email dans le champ de recherche
- Sélectionner et "Modifier" ou "Supprimer"

### Activités
- Créer activité avec nom, capacité, description
- Assigner un entraîneur depuis le dropdown
- Voir le nombre d'inscrits

### Entraîneurs
- Ajouter avec nom et spécialité
- Assignés automatiquement aux activités
- Gestion complète du staff

### Cotisations
- Créer cotisation pour un adhérent
- Marquer comme "Payée" avec date
- Voir les statistiques des paiements

## Données de Test

L'application crée automatiquement :
- 5 adhérents (Michel, Sophie, Luc, Claire, Thomas)
- 4 activités (Football, Natation, Tennis, Yoga)
- 3 entraîneurs
- 5 cotisations avec différents statuts

## Fichiers Importants

- `Main.java` : Point d'entrée
- `MainController.java` : Orchestrateur
- `data/*.json` : Persistence
- `src/view/*.fxml` : Interfaces

## Prochaines Étapes

1. Étudier `README.md` pour architecture complète
2. Lire `ARCHITECTURE.md` pour comprendre le design
3. Explorer les fichiers sources pour voir les patterns
4. Modifier pour ajouter vos propres fonctionnalités
