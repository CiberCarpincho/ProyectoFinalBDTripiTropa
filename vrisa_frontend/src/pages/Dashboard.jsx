import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("panel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
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
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parseando datos de usuario:', error);
      navigate('/');
    }
  }, [navigate]);

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

  // Verificar si es admin
  const isAdmin = user?.role === 'admin';

  // Verificar si puede registrar estaciones
  const canRegisterStation = user?.role === 'admin' || user?.role === 'station_admin';

  // Mostrar loading mientras carga usuario
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
                <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
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

                  {/* Solo admin ve estas opciones */}
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
            {/* Panel */}
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

            {/* Estaciones */}
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

            {/* Reportes */}
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

            {/* Alertas - NO visible para citizen y researcher */}
            {user.role !== 'citizen' && user.role !== 'researcher' && (
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
            {/* Header */}
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {selectedSection === "panel" ? "Panel principal" : "Estaciones"}
              </h1>
              <p className="text-emerald-600 mt-2 text-base">
                {selectedSection === "panel"
                    ? `Bienvenido ${user.firstName}, aquí tienes un resumen del estado del sistema.`
                    : "Selecciona una estación para ver sus datos."}
              </p>
            </header>

            {/* PRIMERA FILA */}
            {selectedSection === "panel" && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                  {/* Registrar estación - Solo admin y station_admin */}
                  {canRegisterStation && (
                      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Registrar nueva estación
                          </h2>
                          <p className="text-gray-600 text-sm mt-1 max-w-md">
                            Añade una nueva estación de monitoreo al sistema para empezar a recolectar datos ambientales.
                          </p>
                        </div>

                        <button
                            onClick={() => navigate("/registrar-estacion")}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                          </svg>
                          Registrar estación
                        </button>
                      </div>
                  )}

                  {/* Estaciones activas */}
                  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between ${!canRegisterStation ? 'lg:col-span-3' : ''}`}>
                    <div className="text-sm font-semibold text-gray-500">
                      Estaciones activas
                    </div>
                    <div className="mt-4">
                      <p className="text-5xl font-extrabold text-gray-900">12</p>
                      <p className="mt-2 text-xs text-emerald-600">
                        ↑ 2 nuevas este mes
                      </p>
                    </div>
                  </div>
                </section>
            )}

            {/* SEGUNDA FILA */}
            {selectedSection === "panel" && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Alertas críticas */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <span className="text-red-500 text-lg font-bold">!</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Alertas críticas
                      </h3>
                      <p className="text-3xl font-extrabold text-red-500 mt-2">3</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Atención requerida en Estación Norte.
                      </p>
                    </div>
                  </div>

                  {/* Nivel PM2.5 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4 5 5 0 019.584-1.03A4 4 0 1119 17H7a4 4 0 01-4-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Nivel PM2.5 Promedio
                      </h3>
                      <p className="text-3xl font-extrabold text-blue-500 mt-2">
                        45 µg/m³
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Dentro de los límites aceptables.
                      </p>
                    </div>
                  </div>

                  {/* Estado del sistema */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M6 10h4v9H6zm8-5h4v14h-4zM4 19h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Estado del sistema
                      </h3>
                      <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                        Operacional
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Todos los sensores reportando correctamente.
                      </p>
                    </div>
                  </div>
                </section>
            )}
          </div>
        </main>
      </div>
  );
}