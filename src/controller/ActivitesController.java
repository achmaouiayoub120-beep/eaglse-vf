package controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import model.Activite;
import model.Entraineur;
import service.ActiviteService;
import repository.*;
import java.net.URL;
import java.util.*;

/**
 * Controller for managing club activities.
 */
public class ActivitesController implements Initializable {
    @FXML private TableView<Activite> activitesTable;
    @FXML private TableColumn<Activite, String> nomColumn;
    @FXML private TableColumn<Activite, Integer> capaciteColumn;
    @FXML private TableColumn<Activite, Integer> inscritsColumn;
    @FXML private TextField nomField;
    @FXML private Spinner<Integer> capaciteSpinner;
    @FXML private TextField descriptionField;
    @FXML private ComboBox<Entraineur> entraineurCombo;
    @FXML private Button addButton;
    @FXML private Button updateButton;
    @FXML private Button deleteButton;

    private ActiviteService activiteService;
    private EntraineurService entraineurService;
    private ObservableList<Activite> activitesList;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        ActiviteRepository activiteRepo = MainController.getActiviteRepository();
        AdherentRepository adherentRepo = MainController.getAdherentRepository();
        EntraineurRepository entraineurRepo = MainController.getEntraineurRepository();

        activiteService = new ActiviteService(activiteRepo, adherentRepo);
        entraineurService = new EntraineurService(entraineurRepo, activiteRepo);
        activitesList = FXCollections.observableArrayList();

        setupTableColumns();
        setupSpinner();
        loadActivites();
        loadEntraineurs();
        setupEventHandlers();
    }

    private void setupTableColumns() {
        nomColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getNom()));
        capaciteColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleIntegerProperty(cellData.getValue().getCapacite()).asObject());
        inscritsColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleIntegerProperty(cellData.getValue().getNbInscrits()).asObject());
    }

    private void setupSpinner() {
        SpinnerValueFactory<Integer> valueFactory = new SpinnerValueFactory.IntegerSpinnerValueFactory(1, 100, 10);
        capaciteSpinner.setValueFactory(valueFactory);
    }

    private void loadActivites() {
        activitesList.clear();
        activitesList.addAll(activiteService.obtenirToutesActivites());
        activitesTable.setItems(activitesList);
        activitesTable.refresh();
    }

    private void loadEntraineurs() {
        ObservableList<Entraineur> entraineurs = FXCollections.observableArrayList();
        entraineurs.add(null); // Allow no trainer selection
        entraineurs.addAll(entraineurService.obtenirTousEntraineurs());
        entraineurCombo.setItems(entraineurs);
        
        entraineurCombo.setCellFactory(param -> new ListCell<Entraineur>() {
            @Override
            protected void updateItem(Entraineur item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText("Aucun");
                } else {
                    setText(item.getNom() + " (" + item.getSpecialite() + ")");
                }
            }
        });
        
        entraineurCombo.setButtonCell(new ListCell<Entraineur>() {
            @Override
            protected void updateItem(Entraineur item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText("Aucun");
                } else {
                    setText(item.getNom() + " (" + item.getSpecialite() + ")");
                }
            }
        });
    }

    private void setupEventHandlers() {
        addButton.setOnAction(e -> handleAddActivite());
        updateButton.setOnAction(e -> handleUpdateActivite());
        deleteButton.setOnAction(e -> handleDeleteActivite());
        activitesTable.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> fillFormFields(newVal));
    }

    private void handleAddActivite() {
        try {
            if (nomField.getText().isEmpty()) {
                showAlert("Erreur", "Le nom de l'activité est obligatoire");
                return;
            }

            Activite activite = new Activite(nomField.getText(), capaciteSpinner.getValue(), descriptionField.getText());
            if (entraineurCombo.getValue() != null) {
                activite.setEntraineurId(entraineurCombo.getValue().getId());
            }
            activiteService.ajouterActivite(activite);
            clearFormFields();
            loadActivites();
            activitesTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Activité ajoutée avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleUpdateActivite() {
        Activite selected = activitesTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner une activité");
            return;
        }

        try {
            selected.setNom(nomField.getText());
            selected.setCapacite(capaciteSpinner.getValue());
            selected.setDescription(descriptionField.getText());
            if (entraineurCombo.getValue() != null) {
                selected.setEntraineurId(entraineurCombo.getValue().getId());
            } else {
                selected.setEntraineurId(null);
            }
            activiteService.modifierActivite(selected);
            clearFormFields();
            loadActivites();
            activitesTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Activité modifiée avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleDeleteActivite() {
        Activite selected = activitesTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner une activité");
            return;
        }

        try {
            activiteService.supprimerActivite(selected.getId());
            clearFormFields();
            loadActivites();
            activitesTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Activité supprimée avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void fillFormFields(Activite activite) {
        if (activite != null) {
            nomField.setText(activite.getNom());
            capaciteSpinner.getValueFactory().setValue(activite.getCapacite());
            descriptionField.setText(activite.getDescription());
            
            if (activite.getEntraineurId() != null) {
                for (Entraineur e : entraineurCombo.getItems()) {
                    if (e != null && e.getId().equals(activite.getEntraineurId())) {
                        entraineurCombo.setValue(e);
                        break;
                    }
                }
            } else {
                entraineurCombo.setValue(null);
            }
        }
    }

    private void clearFormFields() {
        nomField.clear();
        descriptionField.clear();
        capaciteSpinner.getValueFactory().setValue(10);
        entraineurCombo.setValue(null);
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
