package controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.chart.PieChart;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.XYChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.control.Label;
import javafx.geometry.Insets;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import service.*;
import repository.*;
import java.net.URL;
import java.util.*;

/**
 * Controller for the Dashboard view with statistics and charts.
 */
public class DashboardController implements Initializable {
    @FXML private Label totalAdherentsLabel;
    @FXML private Label totalActivitesLabel;
    @FXML private Label cotisationsPayeesLabel;
    @FXML private Label cotisationsNonPayeesLabel;
    @FXML private PieChart cotisationsPieChart;
    @FXML private BarChart<String, Number> occupancyBarChart;
    @FXML private VBox chartsContainer;

    private AdherentService adherentService;
    private ActiviteService activiteService;
    private CotisationService cotisationService;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        AdherentRepository adherentRepo = MainController.getAdherentRepository();
        ActiviteRepository activiteRepo = MainController.getActiviteRepository();
        EntraineurRepository entraineurRepo = MainController.getEntraineurRepository();
        CotisationRepository cotisationRepo = MainController.getCotisationRepository();

        adherentService = new AdherentService(adherentRepo, activiteRepo);
        activiteService = new ActiviteService(activiteRepo, adherentRepo);
        cotisationService = new CotisationService(cotisationRepo, adherentRepo);

        loadDashboardData();
    }

    private void loadDashboardData() {
        // Update labels
        totalAdherentsLabel.setText(String.valueOf(adherentService.compterAdherents()));
        totalActivitesLabel.setText(String.valueOf(activiteService.compterActivites()));

        Map<String, Object> stats = cotisationService.obtenirStatistiques();
        cotisationsPayeesLabel.setText(stats.get("payees").toString());
        cotisationsNonPayeesLabel.setText(stats.get("nonPayees").toString());

        // Setup pie chart
        ObservableList<PieChart.Data> pieChartData = FXCollections.observableArrayList(
                new PieChart.Data("Payées", (Integer) stats.get("payees")),
                new PieChart.Data("Non Payées", (Integer) stats.get("nonPayees"))
        );
        cotisationsPieChart.setData(pieChartData);

        // Setup bar chart for activity occupancy
        setupOccupancyChart();
    }

    private void setupOccupancyChart() {
        CategoryAxis xAxis = new CategoryAxis();
        NumberAxis yAxis = new NumberAxis();
        xAxis.setLabel("Activités");
        yAxis.setLabel("Nombre d'inscrits");

        occupancyBarChart.setTitle("Taux d'occupation des Activités");
        occupancyBarChart.setStyle("-fx-font-size: 12;");

        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Inscrits / Capacité");

        for (Activite activite : activiteService.obtenirToutesActivites()) {
            series.getData().add(new XYChart.Data<>(activite.getNom(), activite.getNbInscrits()));
        }

        occupancyBarChart.getData().add(series);
    }
}
