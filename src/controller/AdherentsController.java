package controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import model.Adherent;
import service.AdherentService;
import repository.*;
import java.net.URL;
import java.util.*;

/**
 * Controller for managing club members (adherents).
 */
public class AdherentsController implements Initializable {
    @FXML private TableView<Adherent> adherentsTable;
    @FXML private TableColumn<Adherent, String> nomColumn;
    @FXML private TableColumn<Adherent, String> prenomColumn;
    @FXML private TableColumn<Adherent, String> emailColumn;
    @FXML private TextField searchField;
    @FXML private TextField nomField;
    @FXML private TextField prenomField;
    @FXML private TextField emailField;
    @FXML private Button addButton;
    @FXML private Button updateButton;
    @FXML private Button deleteButton;

    private AdherentService adherentService;
    private ObservableList<Adherent> adherentsList;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        AdherentRepository adherentRepo = MainController.getAdherentRepository();
        ActiviteRepository activiteRepo = MainController.getActiviteRepository();

        adherentService = new AdherentService(adherentRepo, activiteRepo);
        adherentsList = FXCollections.observableArrayList();

        setupTableColumns();
        loadAdherents();
        setupEventHandlers();
    }

    private void setupTableColumns() {
        nomColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getNom()));
        prenomColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getPrenom()));
        emailColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getEmail()));
    }

    private void loadAdherents() {
        adherentsList.clear();
        adherentsList.addAll(adherentService.obtenirTousAdherents());
        adherentsTable.setItems(adherentsList);
        adherentsTable.refresh();
    }

    private void setupEventHandlers() {
        addButton.setOnAction(e -> handleAddAdherent());
        updateButton.setOnAction(e -> handleUpdateAdherent());
        deleteButton.setOnAction(e -> handleDeleteAdherent());
        searchField.textProperty().addListener((obs, oldVal, newVal) -> handleSearch(newVal));
        adherentsTable.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> fillFormFields(newVal));
    }

    private void handleAddAdherent() {
        try {
            if (nomField.getText().isEmpty() || emailField.getText().isEmpty()) {
                showAlert("Erreur", "Veuillez remplir tous les champs obligatoires");
                return;
            }

            Adherent adherent = new Adherent(nomField.getText(), prenomField.getText(), emailField.getText());
            adherentService.ajouterAdherent(adherent);
            clearFormFields();
            loadAdherents();
            adherentsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Adhérent ajouté avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleUpdateAdherent() {
        Adherent selected = adherentsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner un adhérent");
            return;
        }

        try {
            selected.setNom(nomField.getText());
            selected.setPrenom(prenomField.getText());
            selected.setEmail(emailField.getText());
            adherentService.modifierAdherent(selected);
            clearFormFields();
            loadAdherents();
            adherentsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Adhérent modifié avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleDeleteAdherent() {
        Adherent selected = adherentsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner un adhérent");
            return;
        }

        try {
            adherentService.supprimerAdherent(selected.getId());
            clearFormFields();
            loadAdherents();
            adherentsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Adhérent supprimé avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleSearch(String keyword) {
        if (keyword.isEmpty()) {
            loadAdherents();
        } else {
            adherentsList.clear();
            adherentsList.addAll(adherentService.rechercherAdherents(keyword));
            adherentsTable.refresh();
        }
    }

    private void fillFormFields(Adherent adherent) {
        if (adherent != null) {
            nomField.setText(adherent.getNom());
            prenomField.setText(adherent.getPrenom());
            emailField.setText(adherent.getEmail());
        }
    }

    private void clearFormFields() {
        nomField.clear();
        prenomField.clear();
        emailField.clear();
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
