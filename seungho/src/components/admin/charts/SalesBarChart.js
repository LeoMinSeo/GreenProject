import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// ❗ Chart.js에 BarElement 등록하기
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Sales",
      data: [30, 20, 50, 40, 60],
      backgroundColor: "rgba(75,192,192,0.6)",
    },
  ],
};

const SalesBarChart = () => {
  return <Bar data={data} />;
};

export default SalesBarChart;
