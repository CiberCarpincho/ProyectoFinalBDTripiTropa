//JuanBF
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";

export default function RegisterInstitution() {
  const navigate = useNavigate();

  // ====== ESTADO DE LOS CAMPOS ======
  const [nombre, setNombre] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [colorPrimario, setColorPrimario] = useState("#84cc16");
  const [colorSecundario, setColorSecundario] = useState("#ffffff");
  const [direccion, setDireccion] = useState("");

  // ====== ERRORES ======
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); //juanbf

  // Ref para el input oculto de archivo
  const fileInputRef = useRef(null);


// Helper para asegurar formato hex correcto
  const handleColorChange = (setter) => (e) => {
    const color = e.target.value.substring(0, 7); // Solo 7 caracteres (#rrggbb)
    setter(color);
  };

  // ====== VALIDACIÓN ======
  const validate = () => {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre de la institución es obligatorio.";
    if (!logoFile) newErrors.logo = "Debes subir el logo de la institución.";
    if (!direccion.trim()) newErrors.direccion = "La dirección física es obligatoria.";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====== SUBMIT ======
  // ====== SUBMIT ======
  // ====== SUBMIT ======
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // PASO 1: Crear colores (Usando los nombres exactos: primaryColor, secondaryColor)
      const colorsData = await fetchAPI('/colors/', {
        method: 'POST',
        body: JSON.stringify({
          primaryColor: colorPrimario,
          secondaryColor: colorSecundario
        })
      });

      // Paso de seguridad para verificar que el ID está presente
      if (!colorsData.colorID) {
        throw new Error("El backend no devolvió el ID del color.");
      }

      // PASO 2: Crear institución con el ID del color
      const institutePayload = {
        name: nombre.trim(),
        address: direccion.trim(),
        // La llave foránea en el modelo Institute es 'color'
        color: colorsData.colorID,
        // El campo 'logo' se queda pendiente en el frontend por ahora,
        // ya que el backend lo permite (null=True, blank=True)
      };

      await fetchAPI('/institutes/', {
        method: 'POST',
        body: JSON.stringify(institutePayload)
      });

      // TODOi: La subida de logo se implementará en un paso posterior si es necesario.
      console.log('Logo pendiente de implementación:', logoFile);

      alert('Institución registrada exitosamente. Pendiente de aprobación por administrador.');
      navigate('/registro-enviado');

    } catch (error) {
      console.error('Error registrando institución:', error);
      // Muestra un mensaje de error general al usuario
      setErrors({ general: "Error al registrar la institución. Revise la consola para detalles." });
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir el explorador de archivos
  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  // Cambiar archivo
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, logo: "El archivo supera los 10MB." }));
      return;
    }

    setLogoFile(file);
    setErrors((prev) => ({ ...prev, logo: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-6 py-12 md:py-12 pt-20 font-sans relative">
      {/* Botón "Atrás" en la parte superior izquierda */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-10 px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg border border-lime-500 text-lime-700 bg-white rounded-lg shadow-md hover:bg-lime-100 transition-all"
      >
        Atrás
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-5xl w-full">
        {/* TEXTO IZQUIERDO */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-lime-700 leading-tight">
            Registrar <br /> Institución
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-sm mx-auto md:mx-0">
            Completa los datos para registrar tu institución en la plataforma.
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-lime-100 rounded-2xl shadow-xl p-6 md:p-8 space-y-6 w-full mx-auto"
        >
          {/*agregacion mensaje eerror juanbf*/}
          {errors.general && (
              <div className="p-3 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
          )}
          {/* Nombre */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-base md:text-lg">Nombre de la institución</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Universidad Nacional"
              className={`w-full mt-2 border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 ${errors.nombre ? "border-red-400 focus:ring-red-400" : "border-lime-300 focus:ring-lime-500"}`}
            />
            {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          {/* Logo */}
          <div className="text-center space-y-2">
            <label className="text-gray-800 font-semibold text-base md:text-lg">Logo de la institución</label>

            {/* Input oculto */}
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleLogoChange}
            />

            {/* Área clickeable */}
            <div
              onClick={handleLogoClick}
              className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center bg-white cursor-pointer transition mx-auto ${errors.logo ? "border-red-400" : "border-lime-300 hover:border-lime-500"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-lime-700" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>

              <span className="text-lime-700 font-semibold underline text-sm md:text-base">
                {logoFile ? "Cambiar archivo" : "Sube un archivo"}
              </span>

              <p className="text-gray-500 text-xs md:text-sm mt-1">PNG, JPG o SVG (máx. 10MB)</p>

              {logoFile && (
                <p className="text-xs md:text-sm text-lime-700 mt-2 font-medium">
                  Seleccionado: {logoFile.name}
                </p>
              )}
            </div>

            {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
          </div>

          {/* Colores */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-base md:text-lg">Set de colores</label>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4 mx-auto max-w-xs">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Primario</p>
                <input
                    type="color"
                    value={colorPrimario}
                    onChange={handleColorChange(setColorPrimario)}
                    className="w-full h-10 md:h-12 rounded border border-lime-300 cursor-pointer"
                />
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Secundario</p>
                <input
                    type="color"
                    value={colorSecundario}
                    onChange={handleColorChange(setColorSecundario)}
                    className="w-full h-10 md:h-12 rounded border border-lime-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-base md:text-lg">Dirección física</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, barrio"
              className={`w-full mt-2 border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 ${errors.direccion ? "border-red-400 focus:ring-red-400" : "border-lime-300 focus:ring-lime-500"}`}
            />
            {errors.direccion && <p className="text-sm text-red-500 mt-1">{errors.direccion}</p>}
          </div>

          {/* Botón */}
          <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-3 mt-4 rounded-lg text-base md:text-lg shadow transition-all ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-lime-600 hover:bg-lime-700"
              }`}
          >
            {isLoading ? "Registrando institución..." : "Registrar institución"}
          </button>

        </form>
      </div>
    </div>
  );
}
