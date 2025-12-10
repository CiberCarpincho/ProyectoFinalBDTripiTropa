import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";

export default function IntegrationRequest() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmation, setConfirmation] = useState({ show: false, action: null, instituteID: null });

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

      // Solo admin puede ver solicitudes de integración
      if (parsedUser.role !== 'admin') {
        alert('No tienes permisos para ver solicitudes de integración');
        navigate('/dashboard');
        return;
      }

      loadPendingInstitutes();
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  }, [navigate]);

  // Cargar instituciones pendientes
  const loadPendingInstitutes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAPI('/institutes/pending/');
      setSolicitudes(data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setErrors({ general: "Error al cargar solicitudes pendientes" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRequest = (index) => {
    setSelectedRequest(selectedRequest === index ? null : index);
  };

  const handleAccept = (instituteID) => {
    setConfirmation({ show: true, action: 'accept', instituteID });
  };

  const handleReject = (instituteID) => {
    setConfirmation({ show: true, action: 'reject', instituteID });
  };

  const handleConfirm = async () => {
    const { action, instituteID } = confirmation;

    try {
      if (action === 'accept') {
        await fetchAPI(`/institutes/${instituteID}/approve/`, {
          method: 'PATCH'
        });
      } else if (action === 'reject') {
        await fetchAPI(`/institutes/${instituteID}/reject/`, {
          method: 'DELETE'
        });
      }

      // Recargar lista
      await loadPendingInstitutes();
      setConfirmation({ show: false, action: null, instituteID: null });

    } catch (error) {
      console.error('Error procesando solicitud:', error);
      setErrors({ general: "Error al procesar la solicitud" });
      setConfirmation({ show: false, action: null, instituteID: null });
    }
  };

  const handleCancel = () => {
    setConfirmation({ show: false, action: null, instituteID: null });
  };

  // Loading
  if (!user || isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans px-4 md:px-0">
        {/* Botón Atrás */}
        <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 md:px-6 md:py-3 text-base md:text-lg border border-lime-500 text-lime-700 bg-white rounded-lg shadow-md hover:bg-lime-100 transition-all"
        >
          Atrás
        </button>

        <h1 className="text-2xl md:text-4xl font-extrabold text-lime-700 mb-6 md:mb-10 mt-20 md:mt-24 text-center">
          Solicitudes de Integración
        </h1>

        <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl p-4 md:p-10">
          {errors.general && (
              <div className="p-3 bg-red-100 border border-red-400 rounded-lg mb-4">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
          )}

          {solicitudes.length === 0 ? (
              <p className="text-center text-gray-600">No hay solicitudes de integración pendientes</p>
          ) : (
              solicitudes.map((solicitud, index) => (
                  <div key={solicitud.instituteID} className="border-b pb-4 md:pb-6 mb-4 md:mb-6">
                    <div
                        onClick={() => toggleRequest(index)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                      <h2 className="text-base md:text-xl font-semibold text-gray-900 pr-2">
                        {solicitud.name}
                      </h2>
                      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                  {selectedRequest === index ? "Cerrar" : "Ver detalles"}
                </span>
                    </div>

                    {selectedRequest === index && (
                        <div className="mt-4">
                          <div className="space-y-3">
                            {/* Logo */}
                            {solicitud.logo && (
                                <div>
                                  <p className="font-semibold mb-2">Logo:</p>
                                  <img
                                      src={solicitud.logo}
                                      alt="Logo"
                                      className="h-12 md:h-16"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                </div>
                            )}

                            {/* Colores - Solo si existen */}
                            {solicitud.color && (
                                <>
                                  <div>
                                    <p className="font-semibold mb-2">Color Primario:</p>
                                    <div
                                        style={{
                                          backgroundColor: solicitud.color.primaryColor || '#84cc16',
                                          width: "50px",
                                          height: "25px",
                                        }}
                                        className="border border-gray-300 rounded"
                                    ></div>
                                    <p className="text-xs text-gray-500 mt-1">{solicitud.color.primaryColor}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold mb-2">Color Secundario:</p>
                                    <div
                                        style={{
                                          backgroundColor: solicitud.color.secondaryColor || '#ffffff',
                                          width: "50px",
                                          height: "25px",
                                        }}
                                        className="border border-gray-300 rounded"
                                    ></div>
                                    <p className="text-xs text-gray-500 mt-1">{solicitud.color.secondaryColor}</p>
                                  </div>
                                </>
                            )}

                            {/* Dirección */}
                            <p className="text-sm md:text-base">
                              <strong>Dirección:</strong> {solicitud.address}
                            </p>

                            {/* ID */}
                            <p className="text-xs text-gray-500">
                              ID: {solicitud.instituteID}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row gap-3 md:gap-4">
                            <button
                                onClick={() => handleAccept(solicitud.instituteID)}
                                className="w-full sm:w-auto px-6 py-2 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-colors"
                            >
                              Aceptar
                            </button>
                            <button
                                onClick={() => handleReject(solicitud.instituteID)}
                                className="w-full sm:w-auto px-6 py-2 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
              ))
          )}
        </div>

        {/* Modal de Confirmación */}
        {confirmation.show && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm md:w-96">
                <h3 className="text-lg md:text-xl font-bold mb-4">¿Estás seguro?</h3>
                <p className="text-sm mb-4">
                  ¿Quieres {confirmation.action === 'accept' ? 'aceptar' : 'rechazar'} esta solicitud de integración?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button
                      onClick={handleConfirm}
                      className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {confirmation.action === 'accept' ? 'Aceptar' : 'Rechazar'}
                  </button>
                  <button
                      onClick={handleCancel}
                      className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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