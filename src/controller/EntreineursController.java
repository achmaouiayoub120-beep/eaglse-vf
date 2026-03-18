package controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import model.Entraineur;
import service.EntraineurService;
import repository.*;
import java.net.URL;
import java.util.*;

/**
 * Controller for managing trainers/coaches.
 */
public class EntreineursController implements Initializable {
    @FXML private TableView<Entraineur> entreineursTable;
    @FXML private TableColumn<Entraineur, String> nomColumn;
    @FXML private TableColumn<Entraineur, String> specialiteColumn;
    @FXML private TextField nomField;
    @FXML private TextField specialiteField;
    @FXML private Button addButton;
    @FXML private Button updateButton;
    @FXML private Button deleteButton;

    private EntraineurService entraineurService;
    private ObservableList<Entraineur> entraineursList;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        EntraineurRepository entraineurRepo = MainController.getEntraineurRepository();
        ActiviteRepository activiteRepo = MainController.getActiviteRepository();

        entraineurService = new EntraineurService(entraineurRepo, activiteRepo);
        entraineursList = FXCollections.observableArrayList();

        setupTableColumns();
        loadEntraineurs();
        setupEventHandlers();
    }

    private void setupTableColumns() {
        nomColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getNom()));
        specialiteColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getSpecialite()));
    }

    private void loadEntraineurs() {
        entraineursList.clear();
        entraineursList.addAll(entraineurService.obtenirTousEntraineurs());
        entreineursTable.setItems(entraineursList);
        entreineursTable.refresh();
    }

    private void setupEventHandlers() {
        addButton.setOnAction(e -> handleAddEntraineur());
        updateButton.setOnAction(e -> handleUpdateEntraineur());
        deleteButton.setOnAction(e -> handleDeleteEntraineur());
        entreineursTable.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> fillFormFields(newVal));
    }

    private void handleAddEntraineur() {
        try {
            if (nomField.getText().isEmpty() || specialiteField.getText().isEmpty()) {
                showAlert("Erreur", "Veuillez remplir tous les champs obligatoires");
                return;
            }

            Entraineur entraineur = new Entraineur(nomField.getText(), specialiteField.getText());
            entraineurService.ajouterEntraineur(entraineur);
            clearFormFields();
            loadEntraineurs();
            entreineursTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Entraîneur ajouté avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleUpdateEntraineur() {
        Entraineur selected = entreineursTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner un entraîneur");
            return;
        }

        try {
            selected.setNom(nomField.getText());
            selected.setSpecialite(specialiteField.getText());
            entraineurService.modifierEntraineur(selected);
            clearFormFields();
            loadEntraineurs();
            entreineursTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Entraîneur modifié avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleDeleteEntraineur() {
        Entraineur selected = entreineursTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner un entraîneur");
            return;
        }

        try {
            entraineurService.supprimerEntraineur(selected.getId());
            clearFormFields();
            loadEntraineurs();
            entreineursTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Entraîneur supprimé avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void fillFormFields(Entraineur entraineur) {
        if (entraineur != null) {
            nomField.setText(entraineur.getNom());
            specialiteField.setText(entraineur.getSpecialite());
        }
    }

    private void clearFormFields() {
        nomField.clear();
        specialiteField.clear();
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
