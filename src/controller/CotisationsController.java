package controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import model.Cotisation;
import model.Adherent;
import service.CotisationService;
import service.AdherentService;
import repository.*;
import java.net.URL;
import java.time.LocalDate;
import java.util.*;

/**
 * Controller for managing membership fees and payments.
 */
public class CotisationsController implements Initializable {
    @FXML private TableView<Cotisation> cotisationsTable;
    @FXML private TableColumn<Cotisation, String> adherentColumn;
    @FXML private TableColumn<Cotisation, Double> montantColumn;
    @FXML private TableColumn<Cotisation, String> statutColumn;
    @FXML private ComboBox<Adherent> adherentCombo;
    @FXML private Spinner<Double> montantSpinner;
    @FXML private DatePicker datePaiementPicker;
    @FXML private ComboBox<Cotisation.StatutCotisation> statutCombo;
    @FXML private Button addButton;
    @FXML private Button payButton;
    @FXML private Button deleteButton;

    private CotisationService cotisationService;
    private AdherentService adherentService;
    private ObservableList<Cotisation> cotisationsList;
    private ObservableList<Adherent> adherentsList;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        CotisationRepository cotisationRepo = MainController.getCotisationRepository();
        AdherentRepository adherentRepo = MainController.getAdherentRepository();
        ActiviteRepository activiteRepo = MainController.getActiviteRepository();

        cotisationService = new CotisationService(cotisationRepo, adherentRepo);
        adherentService = new AdherentService(adherentRepo, activiteRepo);
        cotisationsList = FXCollections.observableArrayList();
        adherentsList = FXCollections.observableArrayList();

        setupTableColumns();
        setupComboBoxes();
        setupSpinner();
        loadCotisations();
        setupEventHandlers();
    }

    private void setupTableColumns() {
        adherentColumn.setCellValueFactory(cellData -> {
            String adherentId = cellData.getValue().getAdherentId();
            Adherent adherent = adherentService.obtenirAdherent(adherentId);
            String nomComplet = (adherent != null) ? adherent.getNomComplet() : "Inconnu";
            return new javafx.beans.property.SimpleStringProperty(nomComplet);
        });
        montantColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleObjectProperty<>(cellData.getValue().getMontant()));
        statutColumn.setCellValueFactory(cellData -> new javafx.beans.property.SimpleStringProperty(cellData.getValue().getStatut().toString()));
    }

    private void setupComboBoxes() {
        adherentsList.clear();
        adherentsList.addAll(adherentService.obtenirTousAdherents());
        adherentCombo.setItems(adherentsList);
        
        adherentCombo.setCellFactory(param -> new ListCell<Adherent>() {
            @Override
            protected void updateItem(Adherent item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText("");
                } else {
                    setText(item.getNomComplet() + " (" + item.getEmail() + ")");
                }
            }
        });
        
        adherentCombo.setButtonCell(new ListCell<Adherent>() {
            @Override
            protected void updateItem(Adherent item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText("");
                } else {
                    setText(item.getNomComplet());
                }
            }
        });

        ObservableList<Cotisation.StatutCotisation> statuts = FXCollections.observableArrayList(Cotisation.StatutCotisation.values());
        statutCombo.setItems(statuts);
    }

    private void setupSpinner() {
        SpinnerValueFactory<Double> valueFactory = new SpinnerValueFactory.DoubleSpinnerValueFactory(1.0, 1000.0, 150.0);
        montantSpinner.setValueFactory(valueFactory);
    }

    private void loadCotisations() {
        cotisationsList.clear();
        cotisationsList.addAll(cotisationService.obtenirToutesCotisations());
        cotisationsTable.setItems(cotisationsList);
        cotisationsTable.refresh();
    }

    private void setupEventHandlers() {
        addButton.setOnAction(e -> handleAddCotisation());
        payButton.setOnAction(e -> handlePayCotisation());
        deleteButton.setOnAction(e -> handleDeleteCotisation());
    }

    private void handleAddCotisation() {
        try {
            if (adherentCombo.getValue() == null) {
                showAlert("Erreur", "Veuillez sélectionner un adhérent");
                return;
            }

            Cotisation cotisation = new Cotisation(montantSpinner.getValue(), adherentCombo.getValue().getId());
            cotisationService.ajouterCotisation(cotisation);
            clearFormFields();
            loadCotisations();
            cotisationsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Cotisation ajoutée avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handlePayCotisation() {
        Cotisation selected = cotisationsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner une cotisation");
            return;
        }

        try {
            LocalDate datePaiement = datePaiementPicker.getValue() != null ? datePaiementPicker.getValue() : LocalDate.now();
            cotisationService.payerCotisation(selected.getId(), datePaiement);
            clearFormFields();
            loadCotisations();
            cotisationsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Cotisation marquée comme payée");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void handleDeleteCotisation() {
        Cotisation selected = cotisationsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Erreur", "Veuillez sélectionner une cotisation");
            return;
        }

        try {
            cotisationService.supprimerCotisation(selected.getId());
            clearFormFields();
            loadCotisations();
            cotisationsTable.getSelectionModel().clearSelection();
            showAlert("Succès", "Cotisation supprimée avec succès");
        } catch (Exception ex) {
            showAlert("Erreur", ex.getMessage());
        }
    }

    private void clearFormFields() {
        adherentCombo.setValue(null);
        montantSpinner.getValueFactory().setValue(150.0);
        datePaiementPicker.setValue(LocalDate.now());
        statutCombo.setValue(null);
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
