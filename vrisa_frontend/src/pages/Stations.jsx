import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";

export default function Stations() {
  const [selectedSection, setSelectedSection] = useState("estaciones");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedStation, setSelectedStation] = useState("");
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
      loadStations(parsedUser);
    } catch (error) {
      console.error('Error parseando datos de usuario:', error);
      navigate('/');
    }
  }, [navigate]);

  // Cargar estaciones desde backend
  const loadStations = async (userData) => {
    setIsLoading(true);
    try {
      // Si el usuario tiene instituteID, filtrar por institución
      const endpoint = userData.instituteID
          ? `/stations/?instituteID=${userData.instituteID}`
          : '/stations/';

      const data = await fetchAPI(endpoint);
      setStations(data);
    } catch (error) {
      console.error('Error cargando estaciones:', error);
      setErrors({ general: "Error al cargar estaciones" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleViewDetails = () => {
    if (!selectedStation) {
      setErrors({ general: "Por favor selecciona una estación" });
      return;
    }
    // Guardar estación seleccionada en localStorage para acceso rápido
    const station = stations.find(s => s.stationID === parseInt(selectedStation));
    if (station) {
      localStorage.setItem('currentStation', JSON.stringify(station));
    }
    navigate(`/detalles-estacion?id=${selectedStation}`);
  };

  // Verificar permisos
  const isAdmin = user?.role === 'admin';
  const canSeeAlerts = user?.role !== 'citizen' && user?.role !== 'researcher';

  // Mostrar loading
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Botón para mostrar/ocultar el menú en móvil */}
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
          {/* Perfil */}
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

            {/* Dropdown Menu */}
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

          {/* Navegación */}
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
        <main className="flex-1 px-10 py-12 flex justify-center">
          <div className="w-full max-w-7xl">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900">Estaciones</h1>
              <p className="text-emerald-600 mt-2 text-base">
                Visualiza y gestiona las estaciones de monitoreo
              </p>
            </header>

            {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 rounded-lg mb-4">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
            )}

            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario de selección */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">Seleccionar estación</h3>
                  <p className="text-gray-600">Selecciona una estación para ver sus datos de monitoreo.</p>

                  {isLoading ? (
                      <p className="text-gray-500">Cargando estaciones...</p>
                  ) : stations.length === 0 ? (
                      <p className="text-gray-500">No hay estaciones disponibles</p>
                  ) : (
                      <select
                          value={selectedStation}
                          onChange={(e) => setSelectedStation(e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
                      >
                        <option value="">-- Selecciona una estación --</option>
                        {stations.map((station) => (
                            <option key={station.stationID} value={station.stationID}>
                              {station.name}
                            </option>
                        ))}
                      </select>
                  )}

                  <button
                      onClick={handleViewDetails}
                      disabled={!selectedStation || isLoading}
                      className={`mt-4 px-6 py-3 rounded-xl font-semibold ${
                          selectedStation && !isLoading
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Ver detalles
                  </button>
                </div>

                {/* Lista de estaciones */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-xl font-semibold text-gray-900">Estaciones disponibles</h3>
                  <p className="text-gray-600 mb-4">Total: {stations.length} estaciones</p>

                  {isLoading ? (
                      <p className="text-gray-500">Cargando...</p>
                  ) : stations.length === 0 ? (
                      <p className="text-gray-500">No hay estaciones registradas</p>
                  ) : (
                      <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                        {stations.map((station) => (
                            <div key={station.stationID} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800">{station.name}</h4>
                              <p className="text-sm text-gray-600">
                                {station.description || "Sin descripción"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ID: {station.stationID}
                              </p>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
}