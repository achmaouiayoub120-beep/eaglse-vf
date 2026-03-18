package controller;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import repository.*;

/**
 * Main controller managing application initialization and scene switching.
 */
public class MainController extends Application {
    private static Stage primaryStage;
    private static AdherentRepository adherentRepo;
    private static ActiviteRepository activiteRepo;
    private static EntraineurRepository entraineurRepo;
    private static CotisationRepository cotisationRepo;

    @Override
    public void start(Stage stage) throws Exception {
        primaryStage = stage;

        // Initialize data
        DataInitializer.initializeData();
        adherentRepo = DataInitializer.getAdherentRepository();
        activiteRepo = DataInitializer.getActiviteRepository();
        entraineurRepo = DataInitializer.getEntraineurRepository();
        cotisationRepo = DataInitializer.getCotisationRepository();

        // Load main layout
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/main.fxml"));
        BorderPane root = loader.load();

        Scene scene = new Scene(root, 1200, 700);
        scene.getStylesheets().add(getClass().getResource("/styles/app.css").toExternalForm());

        primaryStage.setTitle("Club Manager - Gestion de Club Sportif");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void switchToScene(String fxmlFile) throws Exception {
        FXMLLoader loader = new FXMLLoader(MainController.class.getResource("/view/" + fxmlFile));
        BorderPane newContent = loader.load();
        if (primaryStage.getScene() != null) {
            BorderPane root = (BorderPane) primaryStage.getScene().getRoot();
            root.setCenter(newContent);
        }
    }

    public static Stage getPrimaryStage() {
        return primaryStage;
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

    public static void main(String[] args) {
        launch(args);
    }
}
