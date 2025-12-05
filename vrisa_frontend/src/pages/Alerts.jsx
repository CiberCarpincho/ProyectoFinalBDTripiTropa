import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const [selectedSection, setSelectedSection] = useState("alertas");
  const [selectedEstacion, setSelectedEstacion] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [selectedCondicion, setSelectedCondicion] = useState("condicion"); // Opción por defecto
  const [valor, setValor] = useState("");
  const [alertas, setAlertas] = useState([]);
  const [confirmation, setConfirmation] = useState({ show: false, action: null, index: null });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

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

  const handleCrearAlerta = () => {
    // Verificamos que todos los campos estén completos y el valor sea mayor que cero
    if (!selectedEstacion || !selectedVariable || selectedCondicion === "condicion" || !valor || parseFloat(valor) <= 0) {
      alert("Por favor, complete todos los campos correctamente.");
      return;
    }

    // Validar que el valor ingresado sea un número válido
    const numValor = parseFloat(valor);
    if (isNaN(numValor)) {
      alert("Por favor, ingrese un valor numérico válido.");
      return;
    }

    // Crear la alerta
    const nuevaAlerta = {
      estacion: selectedEstacion,
      variable: selectedVariable,
      condicion: selectedCondicion,
      valor: valor,
    };

    setAlertas([...alertas, nuevaAlerta]);

    // Limpiar el formulario
    setSelectedEstacion("");
    setSelectedVariable("");
    setSelectedCondicion("condicion");
    setValor("");
  };

  const handleEliminarAlerta = (index) => {
    setConfirmation({ show: true, action: 'delete', index });
  };

  const handleConfirm = () => {
    if (confirmation.action === 'delete') {
      const updatedAlertas = alertas.filter((_, idx) => idx !== confirmation.index);
      setAlertas(updatedAlertas);
    }
    setConfirmation({ show: false, action: null, index: null });
  };

  const handleCancel = () => {
    setConfirmation({ show: false, action: null, index: null });
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

          {/* Estaciones */}
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

          {/* Reportes */}
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

          {/* Alertas */}
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

      <div className="min-h-screen bg-gray-50 p-8 w-full">
        {/* Contenedor del formulario */}
        <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg">
          {/* Encabezado */}
          <header className="mb-6 text-left">
            <h1 className="text-3xl font-extrabold text-gray-900">Configurar alertas</h1>
            <p className="text-emerald-600 text-sm mt-2">
              Configure las alertas para monitorear las condiciones ambientales en las estaciones.
            </p>
          </header>

          {/* Formulario para crear alerta */}
          <div className="mb-8">
            <label htmlFor="estacion" className="block text-sm font-semibold text-gray-700">Seleccionar estación</label>
            <select
              id="estacion"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={selectedEstacion}
              onChange={(e) => setSelectedEstacion(e.target.value)}
            >
              <option value="">Seleccionar estación</option>
              <option value="estacion1">Estación 1</option>
              <option value="estacion2">Estación 2</option>
              <option value="estacion3">Estación 3</option>
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
              <span>{`Valor de ${selectedVariable}`} </span>
              <select
                id="condicion"
                className="p-2 border border-gray-300 rounded-md"
                value={selectedCondicion}
                onChange={(e) => setSelectedCondicion(e.target.value)}
              >
                <option value="condicion">Seleccionar condición</option> {/* Opción por defecto */}
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

          {/* Botón para crear alerta */}
          <div className="text-center mb-4">
            <button
              onClick={handleCrearAlerta}
              className="text-white bg-emerald-600 hover:bg-emerald-700 p-3 rounded-xl"
            >
              Crear Alerta
            </button>
          </div>

          {/* Desplegable de alertas configuradas */}
          {alertas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Alertas configuradas</h2>
              <ul className="space-y-4">
                {alertas.map((alerta, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <strong>{alerta.estacion}</strong>: {alerta.variable} {alerta.condicion} {alerta.valor}
                    </div>
                    <button
                      onClick={() => handleEliminarAlerta(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Quitar Alerta
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confirmación de eliminación */}
          {confirmation.show && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
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
      </div>
    </div>
  );
}
