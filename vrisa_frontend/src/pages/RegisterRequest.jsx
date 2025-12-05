import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterRequest() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([
    {
      nombre: "Juan Carlos",
      primerApellido: "Pérez",
      segundoApellido: "Gómez",
      correo: "juan.perez@email.com",
      telefono: "3001234567",
      contrasena: "******",
      rol: "Investigador",
      institucion: "Universidad del Valle",
    },
    {
      nombre: "María Fernanda",
      primerApellido: "López",
      segundoApellido: "Martínez",
      correo: "maria.lopez@email.com",
      telefono: "3009876543",
      contrasena: "******",
      rol: "Administrador de estación",
      institucion: "Universidad Nacional",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmation, setConfirmation] = useState({ show: false, action: null, index: null });

  const toggleRequest = (index) => {
    setSelectedRequest(selectedRequest === index ? null : index);
  };

  const handleAccept = (index) => {
    setConfirmation({ show: true, action: 'accept', index });
  };

  const handleReject = (index) => {
    setConfirmation({ show: true, action: 'reject', index });
  };

  const handleConfirm = () => {
    if (confirmation.action === 'accept' || confirmation.action === 'reject') {
      const updatedSolicitudes = solicitudes.filter((_, idx) => idx !== confirmation.index);
      setSolicitudes(updatedSolicitudes);
    }
    setConfirmation({ show: false, action: null, index: null });
  };

  const handleCancel = () => {
    setConfirmation({ show: false, action: null, index: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      {/* Botón Atrás en la esquina superior izquierda */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 px-6 py-3 text-lg border border-lime-500 text-lime-700 bg-white rounded-lg shadow-md hover:bg-lime-100 transition-all"
      >
        Atrás
      </button>

      <h1 className="text-4xl font-extrabold text-lime-700 mb-10 mt-20">Solicitudes de Registro</h1>

      <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl p-10">
        {solicitudes.map((solicitud, index) => (
          <div key={index} className="border-b pb-6 mb-6">
            <div
              onClick={() => toggleRequest(index)}
              className="flex items-center justify-between cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-900">{`${solicitud.nombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`}</h2>
              <span className="text-sm text-gray-600">
                {selectedRequest === index ? "Cerrar" : "Ver detalles"}
              </span>
            </div>

            {selectedRequest === index && (
              <div className="mt-4">
                <div>
                  <p><strong>Correo:</strong> {solicitud.correo}</p>
                  <p><strong>Teléfono:</strong> {solicitud.telefono}</p>
                  <p><strong>Rol esperado:</strong> {solicitud.rol}</p>
                  <p><strong>Institución:</strong> {solicitud.institucion}</p>
                </div>

                <div className="mt-4 flex gap-4">
                  {/* Botones Aceptar y Rechazar */}
                  <button
                    onClick={() => handleAccept(index)}
                    className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-colors"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(index)}
                    className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmación */}
      {confirmation.show && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">¿Estás seguro?</h3>
            <p className="text-sm mb-4">¿Quieres {confirmation.action === 'accept' ? 'aceptar' : 'rechazar'} esta solicitud?</p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {confirmation.action === 'accept' ? 'Aceptar' : 'Rechazar'}
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
