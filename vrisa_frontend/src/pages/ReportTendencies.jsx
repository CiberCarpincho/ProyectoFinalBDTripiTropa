import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../api/config';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ReportTendencies() {
  const [alertas, setAlertas] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [availableLevels, setAvailableLevels] = useState([]);
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
      
      // Ordenar por fecha ascendente para el gráfico
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAlertas(sortedData);

      // Extraer niveles únicos
      const levels = [...new Set(data.map(alert => alert.pollutantLevels))];
      setAvailableLevels(levels);
      
      // Seleccionar el primer nivel por defecto si existe
      if (levels.length > 0 && selectedLevel === 'all') {
        setSelectedLevel(levels[0]);
      }
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setErrors({ general: 'Error al cargar los datos de tendencias.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  // Filtrar alertas por nivel seleccionado
  const getFilteredData = () => {
    if (selectedLevel === 'all') {
      return alertas;
    }
    return alertas.filter(alert => alert.pollutantLevels === selectedLevel);
  };

  // Formatear fecha para el gráfico
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit'
    });
  };

  // Preparar datos para el gráfico
  const filteredData = getFilteredData();
  
  const chartData = {
    labels: filteredData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: selectedLevel === 'all' ? 'Todos los niveles' : selectedLevel,
        data: filteredData.map(item => item.pollutantValue),
        borderColor: selectedLevel === 'all' ? 'rgb(75, 192, 192)' : 
                     selectedLevel.toLowerCase().includes('high') || selectedLevel.toLowerCase().includes('critical') ? 'rgb(239, 68, 68)' :
                     selectedLevel.toLowerCase().includes('moderate') ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)',
        backgroundColor: selectedLevel === 'all' ? 'rgba(75, 192, 192, 0.1)' :
                        selectedLevel.toLowerCase().includes('high') || selectedLevel.toLowerCase().includes('critical') ? 'rgba(239, 68, 68, 0.1)' :
                        selectedLevel.toLowerCase().includes('moderate') ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Tendencia temporal de valores de contaminantes${selectedLevel !== 'all' ? ` - ${selectedLevel}` : ''}`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Valor: ${context.parsed.y.toFixed(2)} µg/m³`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor del contaminante (µg/m³)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha y hora'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
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

  // Calcular estadísticas
  const calculateStats = () => {
    if (filteredData.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const values = filteredData.map(item => item.pollutantValue);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  };

  const stats = calculateStats();

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
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Reporte histórico de tendencias por variable</h1>
          </header>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando datos de tendencias...</p>
            </div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay datos históricos disponibles.</p>
            </div>
          ) : (
            <>
              {/* Selección de Nivel */}
              <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <label className="text-base md:text-lg font-semibold text-gray-700" htmlFor="level-select">
                  Filtrar por nivel de contaminante:
                </label>
                <select
                  id="level-select"
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="mt-2 p-2 border border-gray-300 rounded w-full md:w-auto"
                >
                  <option value="all">Todos los niveles</option>
                  {availableLevels.map((level, index) => (
                    <option key={index} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Estadísticas */}
              <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">Estadísticas del filtro actual</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Lecturas</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Mínimo</p>
                    <p className="text-2xl font-bold text-green-600">{stats.min.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Máximo</p>
                    <p className="text-2xl font-bold text-red-600">{stats.max.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Promedio</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.avg.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Gráfica de Tendencias */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <Line data={chartData} options={chartOptions} />
              </div>
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