# Guide d'Installation Complet

## Prérequis Système

- **OS** : Windows, macOS, Linux
- **Java** : JDK 11 ou supérieur
- **IDE** : IntelliJ IDEA, Eclipse, NetBeans, ou VS Code (optionnel)
- **Espace disque** : ~500 MB

## Étape 1 : Installation de Java

### Windows
1. Télécharger JDK depuis [oracle.com](https://www.oracle.com/java/technologies/downloads/)
2. Exécuter l'installateur
3. Accepter les conditions et installer
4. Vérifier : `java -version` dans cmd

### macOS
\`\`\`bash
brew install openjdk@11
# Ou télécharger depuis oracle.com
\`\`\`

### Linux
\`\`\`bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
\`\`\`

## Étape 2 : Installation de JavaFX

### Télécharger JavaFX SDK
1. Aller sur [gluonhq.com/products/javafx](https://gluonhq.com/products/javafx/)
2. Télécharger JavaFX SDK 21 (compatible avec Java 11+)
3. Extraire dans un dossier (ex: `C:\javafx-sdk-21` ou `~/javafx-sdk-21`)

### Configuration dans IDE

#### IntelliJ IDEA
1. File → Project Structure → Libraries
2. Cliquer "+"
3. Sélectionner le dossier JavaFX SDK
4. Appliquer les changements

#### Eclipse
1. Window → Preferences → Java → Build Path → User Libraries
2. New → Nommer "JavaFX"
3. Add JARs → Pointer vers `lib` de JavaFX SDK

#### VS Code
\`\`\`json
{
    "java.project.referencedLibraries": [
        "javafx-sdk-21/lib/**/*.jar"
    ]
}
\`\`\`

## Étape 3 : Installation de Gson

### Maven
1. Créer `pom.xml` :
\`\`\`xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.clubmanager</groupId>
    <artifactId>club-manager</artifactId>
    <version>1.0</version>

    <dependencies>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>21.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>21.0.0</version>
        </dependency>
    </dependencies>
</project>
\`\`\`

2. Exécuter : `mvn clean install`

### Gradle
\`\`\`gradle
dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'
    implementation 'org.openjfx:javafx-controls:21.0.0'
    implementation 'org.openjfx:javafx-fxml:21.0.0'
}
\`\`\`

### Manuel (JAR)
1. Télécharger `gson-2.10.1.jar` depuis [GitHub](https://github.com/google/gson/releases)
2. Placer dans `lib/` du projet
3. Configurer le classpath dans l'IDE

## Étape 4 : Configuration du Projet

### Structure du Projet
\`\`\`
ClubManager/
├── src/
│   ├── model/
│   ├── service/
│   ├── repository/
│   ├── controller/
│   ├── view/
│   ├── styles/
│   ├── util/
│   └── Main.java
├── lib/
│   └── gson-2.10.1.jar
├── data/
│   ├── adherents.json
│   ├── activites.json
│   ├── entraineurs.json
│   └── cotisations.json
├── pom.xml (si Maven)
├── build.gradle (si Gradle)
└── README.md
\`\`\`

## Étape 5 : Compilation

### Avec Maven
\`\`\`bash
mvn clean compile
\`\`\`

### Avec Gradle
\`\`\`bash
gradle build
\`\`\`

### Avec javac (Manuel)
\`\`\`bash
javac -d bin \
  --module-path /path/to/javafx-sdk/lib \
  --add-modules javafx.controls,javafx.fxml \
  -cp lib/gson-2.10.1.jar \
  src/**/*.java
\`\`\`

## Étape 6 : Exécution

### Avec Maven
\`\`\`bash
mvn clean javafx:run
\`\`\`

### Avec Gradle
\`\`\`gradle
plugins {
    id 'org.openjfx.javafxplugin' version '0.1.0'
}

javafx {
    version = "21.0.0"
    modules = [ 'javafx.controls', 'javafx.fxml' ]
}

task run(type: JavaExec) {
    classpath += configurations.runtimeClasspath
    main = 'Main'
}
\`\`\`

\`\`\`bash
gradle run
\`\`\`

### Avec java (Manuel)
\`\`\`bash
java \
  --module-path /path/to/javafx-sdk/lib \
  --add-modules javafx.controls,javafx.fxml \
  -cp bin:lib/gson-2.10.1.jar \
  Main
\`\`\`

## Étape 7 : Dépannage

### Erreur : "JavaFX runtime components are missing"
- Solution : Vérifier `--module-path` pointe vers JavaFX SDK lib

### Erreur : "Gson not found"
- Solution : Ajouter `gson-2.10.1.jar` au classpath

### Erreur : "No suitable constructor found"
- Solution : S'assurer tous les JSON sont bien formés

### L'application démarre mais pas d'interface
- Solution : Vérifier les chemins FXML dans les ressources

## Étape 8 : Première Utilisation

1. Lancer l'application
2. Les données d'essai se créent automatiquement
3. Accéder à chaque module via le menu
4. Tester les fonctionnalités CRUD

## Déploiement

### Créer un JAR exécutable
\`\`\`bash
# Avec Maven
mvn clean package

# Avec Gradle
gradle jar
\`\`\`

### Distribution
\`\`\`bash
# Copier le JAR et les dépendances
java -jar ClubManager.jar
\`\`\`

## Support

En cas de problème, vérifier :
- Version Java : `java -version`
- JavaFX SDK : Chemin correct et version 21
- Gson : Dans le classpath
- Fichiers FXML : Dans `src/view/`
- Données JSON : Format valide dans `data/`
