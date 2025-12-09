import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCloudSun, FaFireAlt, FaWind, FaTint, FaThermometerHalf } from "react-icons/fa";
import { fetchAPI } from "../api/config";

export default function StationDetails() {
  const [searchParams] = useSearchParams();
  const stationId = searchParams.get('id');

  const [station, setStation] = useState(null);
  const [user, setUser] = useState(null);
  const [monitoringData, setMonitoringData] = useState({});
  const [contaminantsStatus, setContaminantsStatus] = useState({});
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [selectedSection, setSelectedSection] = useState("estaciones");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Verificar autenticación y cargar usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (stationId) {
        loadStationData(stationId);
      } else {
        // Intentar cargar desde localStorage
        const currentStation = localStorage.getItem('currentStation');
        if (currentStation) {
          setStation(JSON.parse(currentStation));
          setIsLoading(false);
        } else {
          navigate('/estaciones');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  }, [navigate, stationId]);

  // Cargar datos de la estación
  const loadStationData = async (id) => {
    setIsLoading(true);
    try {
      const data = await fetchAPI(`/stations/${id}/`);
      setStation(data);
      localStorage.setItem('currentStation', JSON.stringify(data));
    } catch (error) {
      console.error('Error cargando estación:', error);
      // Si falla, intentar con localStorage
      const currentStation = localStorage.getItem('currentStation');
      if (currentStation) {
        setStation(JSON.parse(currentStation));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Generación de datos aleatorios para varios contaminantes
  const generateRandomData = () => {
    const contaminants = {
      PM2_5: Math.floor(Math.random() * 500),
      PM10: Math.floor(Math.random() * 500),
      SO2: Math.floor(Math.random() * 500),
      NO2: Math.floor(Math.random() * 500),
      O3: Math.floor(Math.random() * 500),
      CO: Math.floor(Math.random() * 500),
    };

    const status = {};
    Object.keys(contaminants).forEach((key) => {
      const value = contaminants[key];
      let statusValue = "Bueno";
      if (value > 100) statusValue = "Malo";
      else if (value > 50) statusValue = "Moderado";
      status[key] = statusValue;
    });

    setContaminantsStatus(status);
    setMonitoringData(contaminants);
    setTemperature((Math.random() * 40).toFixed(1));
    setHumidity((Math.random() * 100).toFixed(1));
    setWindSpeed((Math.random() * 100).toFixed(1));
  };

  useEffect(() => {
    generateRandomData();
    const interval = setInterval(generateRandomData, 300000); // Actualiza cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const getIconStyle = (contaminant) => {
    switch (contaminant) {
      case "PM2_5":
        return "bg-blue-300 text-blue-500";
      case "PM10":
        return "bg-green-300 text-green-500";
      case "O3":
        return "bg-pink-300 text-pink-500";
      case "CO":
        return "bg-red-300 text-red-500";
      case "SO2":
        return "bg-gray-400 text-gray-500";
      case "NO2":
        return "bg-purple-300 text-purple-400";
      default:
        return "bg-gray-200 text-gray-300";
    }
  };

  const handleChangeStation = () => {
    navigate("/estaciones");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentStation');
    navigate("/");
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

  const toggleMaintenance = () => {
    setIsInMaintenance(!isInMaintenance);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Permisos
  const isAdmin = user?.role === 'admin';
  const canManageMaintenance = user?.role === 'admin' || user?.role === 'station_admin';
  const canSeeAlerts = user?.role !== 'citizen' && user?.role !== 'researcher';

  // Loading
  if (!user || isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <button
            onClick={toggleMenu}
            className="md:hidden p-4 text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.fLastName}
                </p>
                <p className="text-xs text-emerald-600 capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <button onClick={toggleDropdown} className="ml-auto">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12M6 15h12" />
                </svg>
              </button>
            </div>

            {dropdownVisible && (
                <div className="mt-2 p-2 bg-white shadow-lg rounded-lg absolute w-48 z-20">
                  <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>

                  {isAdmin && (
                      <>
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
                      </>
                  )}
                </div>
            )}
          </div>

          <nav className="mt-4 px-3 space-y-1">
            <button
                onClick={() => handleSelectSection("panel")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "panel" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
            >
            <span className={`p-2 rounded-lg ${selectedSection === "panel" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-7.111 7-12a7 7 0 10-14 0c0 4.889 7 12 7 12z" />
              </svg>
            </span>
              <span>Estaciones</span>
            </button>

            <button
                onClick={() => handleSelectSection("reportes")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "reportes" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
            >
            <span className={`p-2 rounded-lg ${selectedSection === "reportes" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h2v7H5zM11 7h2v12h-2zM17 4h2v15h-2z" />
              </svg>
            </span>
              <span>Reportes</span>
            </button>

            {canSeeAlerts && (
                <button
                    onClick={() => handleSelectSection("alertas")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl ${selectedSection === "alertas" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"} text-sm`}
                >
              <span className={`p-2 rounded-lg ${selectedSection === "alertas" ? "bg-emerald-100" : "bg-gray-100"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </span>
                  <span>Alertas</span>
                </button>
            )}
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 px-4 md:px-10 py-6 md:py-12 flex justify-center">
          <div className="w-full max-w-7xl">
            <header className="mb-6 md:mb-10 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
                {station ? station.name : "Detalles de la estación"}
              </h1>
              {station?.description && (
                  <p className="text-emerald-600 mt-2">{station.description}</p>
              )}
            </header>

            {/* Monitoreo de Contaminantes */}
            <section className="mb-6 md:mb-10">
              <h3 className="text-xl md:text-2xl font-semibold">Monitoreo de contaminantes</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {Object.keys(monitoringData).map((key) => (
                    <div key={key} className="bg-white rounded-xl shadow-md p-4 md:p-6">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${getIconStyle(key)}`}>
                        {key === "PM2_5" && <FaCloudSun className="text-white" />}
                        {key === "PM10" && <FaCloudSun className="text-white" />}
                        {key === "O3" && <FaWind className="text-white" />}
                        {key === "CO" && <FaFireAlt className="text-white" />}
                        {key === "SO2" && <FaTint className="text-white" />}
                        {key === "NO2" && <FaWind className="text-white" />}
                      </div>
                      <p className="text-lg md:text-xl font-bold">{key.replace("_", ",")}</p>
                      <p className="text-base md:text-lg">{isInMaintenance ? "-" : `${monitoringData[key]} µg/m³`}</p>
                      <p className={`text-sm font-semibold ${contaminantsStatus[key] === "Bueno" ? "text-green-500" : contaminantsStatus[key] === "Moderado" ? "text-yellow-500" : "text-red-500"}`}>
                        {contaminantsStatus[key]}
                      </p>
                    </div>
                ))}
              </div>
            </section>

            {/* Variables Meteorológicas */}
            <section className="mb-6 md:mb-10">
              <h3 className="text-xl md:text-2xl font-semibold">Variables meteorológicas</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <FaThermometerHalf className="text-xl md:text-2xl text-yellow-500" />
                    <p className="text-lg md:text-xl font-bold">Temperatura</p>
                  </div>
                  <p className="text-base md:text-lg">{isInMaintenance ? "-" : `${temperature} °C`}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <FaTint className="text-xl md:text-2xl text-blue-500" />
                    <p className="text-lg md:text-xl font-bold">Humedad</p>
                  </div>
                  <p className="text-base md:text-lg">{isInMaintenance ? "-" : `${humidity} %`}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <FaWind className="text-xl md:text-2xl text-green-500" />
                    <p className="text-lg md:text-xl font-bold">Velocidad del Viento</p>
                  </div>
                  <p className="text-base md:text-lg">{isInMaintenance ? "-" : `${windSpeed} km/h`}</p>
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Botón mantenimiento - Solo admin y station_admin */}
              {canManageMaintenance && (
                  <button
                      onClick={toggleMaintenance}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  >
                    {isInMaintenance ? "Salir de Mantenimiento" : "Poner en Mantenimiento"}
                  </button>
              )}

              {/* Botón cambiar estación - Todos */}
              <button
                  onClick={handleChangeStation}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
              >
                Cambiar de estación
              </button>
            </div>
          </div>
        </main>
      </div>
  );
}