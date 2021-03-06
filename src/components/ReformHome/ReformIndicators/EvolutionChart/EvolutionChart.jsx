import React, { useState, useContext } from "react";
import { ReformContext } from "../../ReformHome";
import "./EvolutionChart.css";
import Select from "react-select";
import DepartementalData from "../../../../data/barometre_resultats_detail_departemental.json";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// options du graphique d'évolution
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      color: "#000091",
      font: { weight: "normal" },
    },
  },
  scales: {
    x: {
      type: "time",
    },
  },
};

function EvolutionChart() {
  const [selectedDepartements, setSelectedDepartements] = useState([]);
  const reform = useContext(ReformContext);

  // fill the dropdown options with the departements
  const selectOptions = DepartementalData.map((el) => {
    return { value: el.code_departement, label: el.libelle_departement };
  }).filter(
    (item, index, arr) =>
      arr.findIndex(
        (indexEl) => JSON.stringify(indexEl) === JSON.stringify(item)
      ) === index
  );

  // get the ids of the selected departements
  const handleSelectDepartement = (e) => {
    const idDepartements = e.map((el) => parseInt(el.value));
    setSelectedDepartements(idDepartements);
  };

  // creating random colors for datasets
  const randomColors = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  const idReformIndicator = DepartementalData.filter(
    (el) => el.mesure === reform
  )[0].id_indicateur;

  // get the data of the selected departements from the json file
  const dataSelectedDepartements = DepartementalData.filter((el) => {
    return (
      el.id_indicateur === idReformIndicator &&
      selectedDepartements.includes(parseInt(el.code_departement))
    );
  });

  const labels = dataSelectedDepartements.map((el) => el.date);

  const preStructuredData = dataSelectedDepartements.map((el) => {
    return { label: el.libelle_departement, data: el.valeur };
  });

  const datasets = Object.values(
    preStructuredData.reduce((acc, cur) => {
      const key = cur.label;
      acc[key] = acc[key] || {
        label: cur.label,
        data: [],
        backgroundColor: randomColors(),
      };
      acc[key].data.push(cur.data);
      return acc;
    }, {})
  );

  const dataEvolutionChart = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <>
      <div className="evolution_chart_main_container">
        <div className="evolution_chart__leftblock">
          <span className="evolution_chart__title">Evolution de l'indicateur</span>
          <Select
            isMulti
            name="departements"
            className="basic-multi-select"
            classNamePrefix="select"
            options={selectOptions}
            placeholder="Sélectionner un département..."
            onChange={(e) => handleSelectDepartement(e)}
          />
        </div>
        <div className="evolution_chart__chart">
        {
          selectedDepartements.length > 0 ? <Line options={options} data={dataEvolutionChart} /> : null
        }
        </div>
      </div>
    </>
  );
}

export default EvolutionChart;
