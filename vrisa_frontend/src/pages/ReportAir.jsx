import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudSun, FaFireAlt, FaWind, FaTint, FaThermometerHalf } from "react-icons/fa"; // Importación de los íconos

export default function ReportAir() {
  const [selectedSection, setSelectedSection] = useState("reportes"); // Para controlar la sección seleccionada
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Datos directamente asignados (para simular los datos de contaminantes)
  const data = [
    { pm25: 35, pm10: 60, so2: 20, no2: 40, o3: 50, co: 0.6 },
    { pm25: 40, pm10: 70, so2: 30, no2: 42, o3: 55, co: 0.8 },
    { pm25: 55, pm10: 80, so2: 40, no2: 50, o3: 60, co: 1.0 },
    // Agrega más datos si es necesario
  ];

  const calculateAverage = (contaminants) => {
    const sum = contaminants.reduce((acc, value) => acc + value, 0);
    return sum / contaminants.length;
  };

  const getAirQualityStatus = (average) => {
    if (average <= 50) return 'Bueno';
    if (average <= 100) return 'Moderado';
    return 'Malo';
  };

  const pm25Average = calculateAverage(data.map(item => item.pm25));
  const pm10Average = calculateAverage(data.map(item => item.pm10));
  const so2Average = calculateAverage(data.map(item => item.so2));
  const no2Average = calculateAverage(data.map(item => item.no2));
  const o3Average = calculateAverage(data.map(item => item.o3));
  const coAverage = calculateAverage(data.map(item => item.co));

  const airQualityStatus = getAirQualityStatus((pm25Average + pm10Average + so2Average + no2Average + o3Average + coAverage) / 6);

  // Función para asignar un estilo de color a cada contaminante
  const getIconStyle = (contaminant) => {
    switch (contaminant) {
      case "PM2.5":
        return "bg-blue-300 text-blue-500";
      case "CO":
        return "bg-red-300 text-red-500";
      case "NO2":
        return "bg-purple-300 text-purple-500";
      case "PM10":
        return "bg-green-300 text-green-500";
      case "SO2":
        return "bg-yellow-300 text-yellow-500";
      case "O3":
        return "bg-pink-300 text-pink-500";
      default:
        return "bg-gray-200 text-gray-300";
    }
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
            <h1 className="text-4xl font-extrabold text-gray-900">Calidad del aire y estado ambiental</h1>
          </header>

          {/* Monitoreo de Contaminantes */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold">Promedio general de contaminantes</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* PM2.5 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("PM2.5")}`}>
                  <FaCloudSun className="text-white" />
                </div>
                <p className="text-xl font-bold">PM2.5</p>
                <p className="text-lg">{pm25Average.toFixed(2)} µg/m³</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>

              {/* PM10 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("PM10")}`}>
                  <FaCloudSun className="text-white" />
                </div>
                <p className="text-xl font-bold">PM10</p>
                <p className="text-lg">{pm10Average.toFixed(2)} µg/m³</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>

              {/* SO2 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("SO2")}`}>
                  <FaFireAlt className="text-white" />
                </div>
                <p className="text-xl font-bold">SO2</p>
                <p className="text-lg">{so2Average.toFixed(2)} µg/m³</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>

              {/* NO2 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("NO2")}`}>
                  <FaWind className="text-white" />
                </div>
                <p className="text-xl font-bold">NO2</p>
                <p className="text-lg">{no2Average.toFixed(2)} µg/m³</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>

              {/* O3 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("O3")}`}>
                  <FaTint className="text-white" />
                </div>
                <p className="text-xl font-bold">O3</p>
                <p className="text-lg">{o3Average.toFixed(2)} µg/m³</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>

              {/* CO */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconStyle("CO")}`}>
                  <FaFireAlt className="text-white" />
                </div>
                <p className="text-xl font-bold">CO</p>
                <p className="text-lg">{coAverage.toFixed(2)} ppm</p>
                <p className={`text-sm font-semibold ${airQualityStatus === "Bueno" ? "text-green-500" : airQualityStatus === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                  {airQualityStatus}
                </p>
              </div>
            </div>
          </section>
          {/* Botón Volver a Estaciones */}
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
