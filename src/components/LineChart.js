import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { registerables } from 'chart.js';
import { Container } from 'react-bootstrap';

Chart.register(...registerables);

function LineChart(props) {
  function getLabels() {
    let name = props.dataType;
    return props.data[name]["time"];
  }

  function getDataset() {
    let name = props.dataType;
  
    const abnormalPoints = new Set(props.data[name]["anomaly"]);
  
    // Assign different point properties depending on whether the index is in abnormalPoints
    const pointBackgroundColors = props.data[name]["value"].map((_, index) =>
      abnormalPoints.has(index) ? 'rgba(208, 49, 45, 0.7)' : 'rgba(85, 170, 255, 0.7)',
    );
    const pointBorderColors = props.data[name]["value"].map((_, index) =>
      abnormalPoints.has(index) ? 'rgba(208, 49, 45, 0.7)' : 'rgba(85, 170, 255, 0.7)',
    );
    const pointRadius = props.data[name]["value"].map((_, index) =>
      abnormalPoints.has(index) ? 4 : 3,
    );
  
    return [
      {
        id: 1,
        yAxisID: 'y',
        label: props.dataType,
        data: props.data[name]["value"],
        borderColor: 'rgba(85, 170, 255, 0.7)', // Add alpha value
        backgroundColor: 'rgba(85, 170, 255, 0.4)', // Add alpha value
        pointBorderColor: pointBorderColors,
        pointBackgroundColor: pointBackgroundColors,
        pointRadius: pointRadius,
      },
      {
        id: 2,
        label: 'Abnormal',
        data: [],
        backgroundColor: 'rgba(208, 49, 45, 0.7)', // Add alpha value
        borderWidth: 0, 
        pointRadius: 0, 
      },
    ];
  }

  return (
    <Container>
      <h4 style={{ textAlign: 'center', color: 'grey' }}>{props.title}</h4>
      <Line
        datasetIdKey="id"
        data={{
          labels: getLabels(),
          datasets: getDataset(),
        }}
      />
    </Container>
  );
}

export default LineChart;