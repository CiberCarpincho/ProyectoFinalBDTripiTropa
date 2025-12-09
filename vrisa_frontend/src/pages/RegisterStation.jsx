import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";

export default function RegisterStation() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    instituteID: "",
    latitude: "",
    longitude: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

      // Verificar permisos (solo admin y station_admin)
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'station_admin') {
        alert('No tienes permisos para registrar estaciones');
        navigate('/dashboard');
        return;
      }

      loadInstitutions();
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  }, [navigate]);

  // Cargar instituciones
  const loadInstitutions = async () => {
    try {
      const data = await fetchAPI('/institutes/');
      setInstitutions(data);
    } catch (error) {
      console.error('Error cargando instituciones:', error);
      setErrors({ general: "Error al cargar instituciones" });
    }
  };

  // Validación
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la estación es obligatorio.";
    }

    if (!formData.instituteID) {
      newErrors.instituteID = "Debes seleccionar una institución.";
    }

    if (!formData.latitude.trim() || !formData.longitude.trim()) {
      newErrors.location = "Las coordenadas (latitud y longitud) son obligatorias.";
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.location = "Latitud debe ser un número entre -90 y 90.";
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.location = "Longitud debe ser un número entre -180 y 180.";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Crear el Point en formato WKT para PostGIS
      const payload = {
        name: formData.name.trim(),
        instituteID: parseInt(formData.instituteID),
        location: `POINT(${formData.longitude} ${formData.latitude})`,
        description: formData.description.trim()
      };

      const data = await fetchAPI('/stations/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log('Estación creada:', data);
      navigate('/estacion-enviada');

    } catch (error) {
      console.error('Error registrando estación:', error);
      setErrors({ general: error.message || "Error al registrar la estación" });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-4 md:px-6 py-12 font-sans relative">
        {/* Botón Atrás */}
        <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 md:px-6 md:py-3 text-base md:text-lg border border-lime-500 text-lime-700 bg-white rounded-lg shadow-md hover:bg-lime-100 transition-all"
        >
          Atrás
        </button>

        <h1 className="text-2xl md:text-4xl font-extrabold text-lime-700 mb-6 md:mb-10 mt-16 md:mt-20 text-center px-4">
          Registro de estación
        </h1>

        <div className="bg-lime-100 shadow-lg rounded-3xl p-4 md:p-10 w-full max-w-4xl">
          <form onSubmit={handleSubmit}>

            {/* Error general */}
            {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 rounded-lg mb-6">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
            )}

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

              {/* Nombre de estación */}
              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
                  Nombre de la estación *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Estación Norte"
                    className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
                />
                {errors.name && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Institución */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
                  Institución *
                </label>
                <select
                    name="instituteID"
                    value={formData.instituteID}
                    onChange={handleChange}
                    className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
                >
                  <option value="">Selecciona una institución</option>
                  {institutions.map((inst) => (
                      <option key={inst.instituteID} value={inst.instituteID}>
                        {inst.name}
                      </option>
                  ))}
                </select>
                {errors.instituteID && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.instituteID}</p>}
              </div>

              {/* Ubicación geográfica */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
                  Coordenadas *
                </label>
                <div className="flex gap-2 md:gap-4">
                  <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Latitud"
                      className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg w-full text-sm md:text-base"
                  />
                  <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Longitud"
                      className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg w-full text-sm md:text-base"
                  />
                </div>
                {errors.location && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.location}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: Latitud: 3.4516, Longitud: -76.5320 (Cali)
                </p>
              </div>

              {/* Descripción */}
              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
                  Descripción *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe la ubicación, propósito y características de la estación..."
                    rows="4"
                    className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base resize-none"
                />
                {errors.description && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

            </div>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Los sensores y dispositivos de esta estación se registran posteriormente en "Registrar Dispositivo".
              </p>
            </div>

            {/* BOTÓN */}
            <div className="mt-6 md:mt-10 flex justify-center md:justify-end">
              <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-base md:text-lg transition ${
                      isLoading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-lime-600 text-white hover:bg-lime-700"
                  }`}
              >
                {isLoading ? "Registrando..." : "Crear Estación"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}