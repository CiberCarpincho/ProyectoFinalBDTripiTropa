import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaCloudSun, FaFireAlt, FaWind, FaTint } from "react-icons/fa"; // Importación de los íconos

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ReportTendencies() {
  const [selectedVariable, setSelectedVariable] = useState('PM2.5');
  const [data, setData] = useState([]);
  const [selectedSection, setSelectedSection] = useState("reportes");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de datos para ejemplo, puedes reemplazarlo por datos reales
    const exampleData = [
      { fecha: '2021-01-01', value: 35 },
      { fecha: '2021-01-02', value: 40 },
      { fecha: '2021-01-03', value: 55 },
      { fecha: '2021-01-04', value: 60 },
      { fecha: '2021-01-05', value: 70 },
      { fecha: '2021-01-06', value: 80 },
      { fecha: '2021-01-07', value: 90 },
    ];
    setData(exampleData);
  }, [selectedVariable]);

  const handleVariableChange = (event) => {
    setSelectedVariable(event.target.value);
  };

  const chartData = {
    labels: data.map(item => item.fecha),
    datasets: [
      {
        label: selectedVariable,
        data: data.map(item => item.value),
        borderColor: selectedVariable === 'PM2.5' ? 'green' : selectedVariable === 'CO' ? 'blue' : 'orange',
        fill: false,
      },
    ],
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section); // Cambiar la sección seleccionada

    // Redirigir a las páginas correspondientes
    switch (section) {
      case "panel":
        navigate("/dashboard");
        break;
      case "estaciones":
        navigate("/estaciones");
        break;
      case "reportes":
        navigate("/reportes");
        break;
      case "alertas":
        navigate("/alertas");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        {/* Perfil */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-emerald-600">Monitoreo Ambiental</p>
            </div>
            <button onClick={toggleDropdown} className="ml-auto">
              {/* Botón para mostrar/ocultar el menú */}
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12M6 15h12" />
              </svg>
            </button>
          </div>
          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="mt-2 p-2 bg-white shadow-lg rounded-lg absolute w-48">
              <button
                onClick={() => navigate("/")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
              <button
                onClick={() => navigate("/solicitud-registro")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Ver solicitudes de registro
              </button>
              <button
                onClick={() => navigate("/solicitud-integracion")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Ver solicitudes de integración
              </button>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="mt-4 px-3 space-y-1">
          <button
            onClick={() => handleSelectSection("panel")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "panel" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
          >
            <span className={`p-2 rounded-lg ${selectedSection === "panel" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
              </svg>
            </span>
            <span>Panel</span>
          </button>
          <button
            onClick={() => handleSelectSection("estaciones")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "estaciones" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
          >
            <span className={`p-2 rounded-lg ${selectedSection === "estaciones" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 22s7-7.111 7-12a7 7 0 10-14 0c0 4.889 7 12 7 12z"
                />
              </svg>
            </span>
            <span>Estaciones</span>
          </button>
          <button
            onClick={() => handleSelectSection("reportes")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "reportes" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
          >
            <span className={`p-2 rounded-lg ${selectedSection === "reportes" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h2v7H5zM11 7h2v12h-2zM17 4h2v15h-2z"
                />
              </svg>
            </span>
            <span>Reportes</span>
          </button>
          <button
            onClick={() => handleSelectSection("alertas")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "alertas" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
          >
            <span className={`p-2 rounded-lg ${selectedSection === "alertas" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </span>
            <span>Alertas</span>
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 px-10 py-12 flex justify-center">
        <div className="w-full max-w-7xl">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900">Reporte histórico de tendencias por variable</h1>
          </header>

          {/* Selección de Variable */}
          <div className="mb-6">
            <label className="text-lg font-semibold text-gray-700" htmlFor="variable-select">Seleccionar variable:</label>
            <select
              id="variable-select"
              value={selectedVariable}
              onChange={handleVariableChange}
              className="mt-2 p-2 border rounded"
            >
              <option value="PM2.5">PM2.5</option>
              <option value="CO">CO</option>
              <option value="NO2">NO2</option>
            </select>
          </div>

          {/* Gráfica de Tendencias */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={chartData} />
          </div>

          {/* Botón Volver a Reportes */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/reportes")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
            >
              Volver a reportes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
