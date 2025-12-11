import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../api/config';

export default function ReportMaintenance() {
  const [estaciones, setEstaciones] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedSection, setSelectedSection] = useState("reportes");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Cargar estaciones y dispositivos en paralelo
      const [stationsData, devicesData] = await Promise.all([
        fetchAPI('/stations/'),
        fetchAPI('/devices/')
      ]);

      setEstaciones(stationsData);
      setDevices(devicesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrors({ general: 'Error al cargar los datos. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Contar dispositivos por estación
  const getDeviceCount = (stationID) => {
    return devices.filter(d => d.stationID === stationID).length;
  };

  // Determinar estado de la estación basado en si tiene dispositivos
  const getEstacionEstado = (stationID) => {
    const deviceCount = getDeviceCount(stationID);
    if (deviceCount === 0) return 'Inactiva';
    if (deviceCount >= 3) return 'Activa';
    return 'Requiere Atención';
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-green-100';
      case 'Requiere Atención':
        return 'bg-yellow-100';
      case 'Inactiva':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
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
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Reportes de Infraestructura y Mantenimiento</h1>
          </header>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando datos de infraestructura...</p>
            </div>
          ) : estaciones.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay estaciones registradas en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Estación</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Dispositivos</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {estaciones.map((estacion) => {
                    const estado = getEstacionEstado(estacion.stationID);
                    const deviceCount = getDeviceCount(estacion.stationID);
                    
                    return (
                      <tr key={estacion.stationID} className={`border-b ${getEstadoColor(estado)}`}>
                        <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-900">{estacion.name}</td>
                        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{estado}</td>
                        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{deviceCount} dispositivo(s)</td>
                        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{estacion.description || 'Sin descripción'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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