"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          "https://fedskillstest.coalitiontechnologies.workers.dev",
          {
            auth: {
              username: "coalition",
              password: "skills-test"
            }
          }
        );

        const jessica = response.data.find(
          (p) => p.name === "Jessica Taylor"
        );
        setPatient(jessica);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!patient)
    return (
      <p className="text-center mt-10 text-red-500">
        No data found for Jessica Taylor.
      </p>
    );

  // Prepare blood pressure data for Chart.js
  const bpLabels = patient.diagnosis_history.map(
    (month) => `${month.month} ${month.year}`
  );
  const systolicData = patient.diagnosis_history.map(
    (month) => month.blood_pressure.systolic.value
  );
  const diastolicData = patient.diagnosis_history.map(
    (month) => month.blood_pressure.diastolic.value
  );

  const bpData = {
    labels: bpLabels,
    datasets: [
      {
        label: "Systolic",
        data: systolicData,
        borderColor: "rgba(255,99,132,1)",
        fill: false
      },
      {
        label: "Diastolic",
        data: diastolicData,
        borderColor: "rgba(54,162,235,1)",
        fill: false
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
        <p className="text-gray-600 mt-2">Age: {patient.age}</p>
        <p className="text-gray-600 mt-1">
          Insurance: {patient.insurance_type}
        </p>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Blood Pressure Over the Months
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <Line data={bpData} />
          </div>
        </div>
      </div>
    </div>
  );
}
