import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";

export default function Alerts() {
  const [user, setUser] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedSection, setSelectedSection] = useState("alertas");
  const [selectedEstacion, setSelectedEstacion] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [selectedCondicion, setSelectedCondicion] = useState("");
  const [valor, setValor] = useState("");
  const [alertas, setAlertas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState({ show: false, action: null, configID: null });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Verificar autenticación y permisos
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

      // Verificar permisos (NO citizen ni researcher)
      if (parsedUser.role === 'citizen' || parsedUser.role === 'researcher') {
        alert('No tienes permisos para configurar alertas');
        navigate('/dashboard');
        return;
      }

      loadStations();
      loadAlertConfigurations();
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  }, [navigate]);

  // Cargar estaciones
  const loadStations = async () => {
    try {
      const data = await fetchAPI('/stations/');
      setStations(data);
    } catch (error) {
      console.error('Error cargando estaciones:', error);
    }
  };

  // Cargar configuraciones de alertas
  const loadAlertConfigurations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAPI('/alert-configurations/');
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setErrors({ general: "Error al cargar alertas configuradas" });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCrearAlerta = async () => {
    // Validaciones
    if (!selectedEstacion || !selectedVariable || !selectedCondicion || !valor || parseFloat(valor) <= 0) {
      setErrors({ form: "Por favor, complete todos los campos correctamente." });
      return;
    }

    const numValor = parseFloat(valor);
    if (isNaN(numValor)) {
      setErrors({ form: "Por favor, ingrese un valor numérico válido." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        stationID: parseInt(selectedEstacion),
        variable: selectedVariable,
        condition: selectedCondicion,
        threshold_value: numValor,
        is_active: true
      };

      await fetchAPI('/alert-configurations/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Recargar alertas
      await loadAlertConfigurations();

      // Limpiar formulario
      setSelectedEstacion("");
      setSelectedVariable("");
      setSelectedCondicion("");
      setValor("");

    } catch (error) {
      console.error('Error creando alerta:', error);
      setErrors({ form: "Error al crear la alerta" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarAlerta = (configID) => {
    setConfirmation({ show: true, action: 'delete', configID });
  };

  const handleConfirm = async () => {
    const { configID } = confirmation;

    try {
      await fetchAPI(`/alert-configurations/${configID}/`, {
        method: 'DELETE'
      });

      await loadAlertConfigurations();
      setConfirmation({ show: false, action: null, configID: null });

    } catch (error) {
      console.error('Error eliminando alerta:', error);
      setErrors({ general: "Error al eliminar la alerta" });
      setConfirmation({ show: false, action: null, configID: null });
    }
  };

  const handleCancel = () => {
    setConfirmation({ show: false, action: null, configID: null });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Obtener nombre de estación
  const getStationName = (stationID) => {
    const station = stations.find(s => s.stationID === stationID);
    return station ? station.name : `Estación ${stationID}`;
  };

  // Permisos
  const isAdmin = user?.role === 'admin';
  const canSeeAlerts = user?.role !== 'citizen' && user?.role !== 'researcher';

  // Loading
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
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

        <div className="min-h-screen bg-gray-50 p-8 w-full">
          <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <header className="mb-6 text-left">
              <h1 className="text-3xl font-extrabold text-gray-900">Configurar alertas</h1>
              <p className="text-emerald-600 text-sm mt-2">
                Configure las alertas para monitorear las condiciones ambientales en las estaciones.
              </p>
            </header>

            {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 rounded-lg mb-4">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
            )}

            {errors.form && (
                <div className="p-3 bg-red-100 border border-red-400 rounded-lg mb-4">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
            )}

            {/* Formulario */}
            <div className="mb-8">
              <label htmlFor="estacion" className="block text-sm font-semibold text-gray-700">Seleccionar estación</label>
              <select
                  id="estacion"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  value={selectedEstacion}
                  onChange={(e) => setSelectedEstacion(e.target.value)}
              >
                <option value="">Seleccionar estación</option>
                {stations.map((station) => (
                    <option key={station.stationID} value={station.stationID}>
                      {station.name}
                    </option>
                ))}
              </select>

              <label htmlFor="variable" className="block text-sm font-semibold text-gray-700 mt-4">Seleccionar variable de material particulado</label>
              <select
                  id="variable"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
              >
                <option value="">Seleccionar variable</option>
                <option value="PM25">PM₂.₅</option>
                <option value="PM10">PM₁₀</option>
                <option value="SO2">Dióxido de Azufre (SO₂)</option>
                <option value="NO2">Dióxido de Nitrógeno (NO₂)</option>
                <option value="O3">Ozono (O₃)</option>
                <option value="CO">Monóxido de Carbono (CO)</option>
              </select>

              <label htmlFor="condicion" className="block text-sm font-semibold text-gray-700 mt-4">Condición</label>
              <div className="flex items-center gap-4">
                <span>Valor de {selectedVariable || "variable"}</span>
                <select
                    id="condicion"
                    className="p-2 border border-gray-300 rounded-md"
                    value={selectedCondicion}
                    onChange={(e) => setSelectedCondicion(e.target.value)}
                >
                  <option value="">Seleccionar condición</option>
                  <option value=">">Mayor que</option>
                  <option value="<">Menor que</option>
                  <option value="=">Igual a</option>
                  <option value=">=">Mayor o igual a</option>
                  <option value="<=">Menor o igual a</option>
                </select>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    className="w-24 p-2 border border-gray-300 rounded-md"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
              </div>
            </div>

            {/* Botón crear */}
            <div className="text-center mb-4">
              <button
                  onClick={handleCrearAlerta}
                  disabled={isLoading}
                  className={`text-white p-3 rounded-xl ${
                      isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                {isLoading ? "Creando..." : "Crear Alerta"}
              </button>
            </div>

            {/* Lista de alertas */}
            {alertas.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas configuradas</h2>
                  <ul className="space-y-4">
                    {alertas.map((alerta) => (
                        <li key={alerta.configID} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <strong>{getStationName(alerta.stationID)}</strong>: {alerta.variable} {alerta.condition} {alerta.threshold_value}
                          </div>
                          <button
                              onClick={() => handleEliminarAlerta(alerta.configID)}
                              className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Quitar Alerta
                          </button>
                        </li>
                    ))}
                  </ul>
                </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación */}
        {confirmation.show && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">¿Estás seguro?</h3>
                <p className="text-sm mb-4">¿Quieres eliminar esta alerta?</p>
                <div className="flex gap-4">
                  <button
                      onClick={handleConfirm}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                  <button
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}