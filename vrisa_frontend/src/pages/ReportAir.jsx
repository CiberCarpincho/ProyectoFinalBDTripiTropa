import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../api/config';
import { FaCloudSun, FaFireAlt, FaWind, FaTint } from "react-icons/fa";

export default function ReportAir() {
  const [alertas, setAlertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedSection, setSelectedSection] = useState("reportes");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    loadAlertas();
  }, []);

  const loadAlertas = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const data = await fetchAPI('/alerts/');
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setErrors({ general: 'Error al cargar los datos de calidad del aire.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular promedio de valores de contaminantes
  const calculateAverage = () => {
    if (alertas.length === 0) return 0;
    const sum = alertas.reduce((acc, alert) => acc + alert.pollutantValue, 0);
    return sum / alertas.length;
  };

  // Determinar estado general de calidad del aire
  const getAirQualityStatus = (average) => {
    if (average <= 50) return { text: 'Bueno', color: 'text-green-500' };
    if (average <= 100) return { text: 'Moderado', color: 'text-yellow-500' };
    return { text: 'Malo', color: 'text-red-500' };
  };

  // Agrupar alertas por nivel de contaminante
  const groupByLevel = () => {
    const grouped = {};
    alertas.forEach(alert => {
      const level = alert.pollutantLevels;
      if (!grouped[level]) {
        grouped[level] = [];
      }
      grouped[level].push(alert.pollutantValue);
    });
    return grouped;
  };

  const average = calculateAverage();
  const airQuality = getAirQualityStatus(average);
  const groupedData = groupByLevel();

  // Calcular promedio por nivel
  const getAverageByLevel = (level) => {
    const values = groupedData[level] || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const getIconStyle = (index) => {
    const styles = [
      "bg-blue-300 text-blue-500",
      "bg-red-300 text-red-500",
      "bg-purple-300 text-purple-500",
      "bg-green-300 text-green-500",
      "bg-yellow-300 text-yellow-500",
      "bg-pink-300 text-pink-500"
    ];
    return styles[index % styles.length];
  };

  const getIcon = (index) => {
    const icons = [FaCloudSun, FaFireAlt, FaWind, FaTint, FaCloudSun, FaFireAlt];
    const Icon = icons[index % icons.length];
    return <Icon className="text-white" />;
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section);
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
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <button
        onClick={toggleMenu}
        className="md:hidden p-4 text-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* SIDEBAR */}
      <aside className={`w-full md:w-64 bg-white border-r border-gray-100 flex flex-col z-10 ${isMenuOpen ? "block" : "hidden md:block"}`}>
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-emerald-600">Monitoreo Ambiental</p>
            </div>
            <button onClick={toggleDropdown} className="ml-auto">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12M6 15h12" />
              </svg>
            </button>
          </div>
          {dropdownVisible && (
            <div className="mt-2 p-2 bg-white shadow-lg rounded-lg absolute w-48">
              <button onClick={() => navigate("/")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Cerrar sesión
              </button>
              <button onClick={() => navigate("/solicitud-registro")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Ver solicitudes de registro
              </button>
              <button onClick={() => navigate("/solicitud-integracion")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Ver solicitudes de integración
              </button>
            </div>
          )}
        </div>

        <nav className="mt-4 px-3 space-y-1">
          <button onClick={() => handleSelectSection("panel")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "panel" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}>
            <span className={`p-2 rounded-lg ${selectedSection === "panel" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
              </svg>
            </span>
            <span>Panel</span>
          </button>
          <button onClick={() => handleSelectSection("estaciones")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "estaciones" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}>
            <span className={`p-2 rounded-lg ${selectedSection === "estaciones" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-7.111 7-12a7 7 0 10-14 0c0 4.889 7 12 7 12z" />
              </svg>
            </span>
            <span>Estaciones</span>
          </button>
          <button onClick={() => handleSelectSection("reportes")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "reportes" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}>
            <span className={`p-2 rounded-lg ${selectedSection === "reportes" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h2v7H5zM11 7h2v12h-2zM17 4h2v15h-2z" />
              </svg>
            </span>
            <span>Reportes</span>
          </button>
          <button onClick={() => handleSelectSection("alertas")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "alertas" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}>
            <span className={`p-2 rounded-lg ${selectedSection === "alertas" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
            <span>Alertas</span>
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 px-4 md:px-10 py-6 md:py-12 flex justify-center">
        <div className="w-full max-w-7xl">
          <header className="mb-6 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Calidad del aire y estado ambiental</h1>
          </header>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando datos de calidad del aire...</p>
            </div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay datos de contaminantes disponibles.</p>
            </div>
          ) : (
            <>
              {/* Resumen General */}
              <section className="mb-6 md:mb-10 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl md:text-2xl font-semibold mb-4">Resumen General</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Promedio General</p>
                    <p className="text-3xl font-bold text-gray-900">{average.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Estado del Aire</p>
                    <p className={`text-3xl font-bold ${airQuality.color}`}>{airQuality.text}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Total de Lecturas</p>
                    <p className="text-3xl font-bold text-gray-900">{alertas.length}</p>
                  </div>
                </div>
              </section>

              {/* Monitoreo por Nivel de Contaminante */}
              <section className="mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-semibold mb-4">Promedio por nivel de contaminante</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {Object.keys(groupedData).map((level, index) => {
                    const avgValue = getAverageByLevel(level);
                    const status = getAirQualityStatus(avgValue);
                    
                    return (
                      <div key={index} className="bg-white rounded-xl shadow-md p-4 md:p-6">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${getIconStyle(index)}`}>
                          {getIcon(index)}
                        </div>
                        <p className="text-lg md:text-xl font-bold mt-3">{level}</p>
                        <p className="text-base md:text-lg">{avgValue.toFixed(2)} µg/m³</p>
                        <p className={`text-sm font-semibold ${status.color}`}>
                          {status.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {groupedData[level].length} lectura(s)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/reportes")}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
            >
              Volver a reportes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}