import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterStation() {
  const navigate = useNavigate();

  const [institution, setInstitution] = useState("");
  const [pollutantVariables, setPollutantVariables] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [responsible, setResponsible] = useState("");
  const [email, setEmail] = useState("");
  const [calibrationFile, setCalibrationFile] = useState(null);
  const [maintenanceFile, setMaintenanceFile] = useState(null);

  const [errors, setErrors] = useState({});

  const fileInputRefCalibration = useRef(null);
  const fileInputRefMaintenance = useRef(null);

  const institutions = ["Universidad del Valle", "Universidad Nacional", "Instituto Brisa"];
  const pollutants = ["Material particulado (PM2.5, PM10)", "Óxido de azufre (SO2)", "Óxido de nitrógeno (NO2)", "Ozono (O3)", "Monóxido de carbono (CO)"];
  const meteorologicalVariables = ["Temperatura", "Humedad", "Velocidad del viento"];

  // Verificación del archivo subido
  const validateFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!file) return false;
    return allowedTypes.includes(file.type);
  };

  // Validación de los campos
  const validate = () => {
    const newErrors = {};

    // Validar institución
    if (!institution.trim()) {
      newErrors.institution = "El nombre de la institución es obligatorio.";
    }

    // Validar ubicación geográfica (latitud y longitud)
    if (!latitude.trim() || !longitude.trim()) {
      newErrors.location = "Las coordenadas geográficas (latitud y longitud) son obligatorias.";
    }

    // Validar variables de contaminación o meteorología
    if (pollutantVariables.length === 0) {
      newErrors.variables = "Debes seleccionar al menos una variable de medición.";
    }

    // Validar tipo de sensor
    if (!sensorType.trim()) {
      newErrors.sensorType = "El tipo de sensor es obligatorio.";
    }

    // Validar responsable técnico
    if (!responsible.trim()) {
      newErrors.responsible = "El nombre del responsable técnico es obligatorio.";
    }

    // Validar correo
    if (!email.trim()) {
      newErrors.email = "El correo del responsable técnico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo válido.";
    }

    // Validar archivo de calibración
    if (!calibrationFile) {
      newErrors.calibrationFile = "El archivo de calibración es obligatorio.";
    } else if (!validateFile(calibrationFile)) {
      newErrors.calibrationFile = "El archivo de calibración debe ser PNG, JPG, DOC, DOCX o PDF.";
    }

    // Validar archivo de mantenimiento
    if (!maintenanceFile) {
      newErrors.maintenanceFile = "El archivo de mantenimiento es obligatorio.";
    } else if (!validateFile(maintenanceFile)) {
      newErrors.maintenanceFile = "El archivo de mantenimiento debe ser PNG, JPG, DOC, DOCX o PDF.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de subida de archivos
  const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("El archivo no debe superar los 10MB.");
      return;
    }

    if (type === "calibration") {
      setCalibrationFile(file);
    } else if (type === "maintenance") {
      setMaintenanceFile(file);
    }
  };

  // Abrir el explorador de archivos
  const handleFileClick = (type) => {
    if (type === "calibration") {
      fileInputRefCalibration.current?.click();
    } else if (type === "maintenance") {
      fileInputRefMaintenance.current?.click();
    }
  };

  // Manejo del submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Si pasa validación, navegar al siguiente paso
    navigate("/estacion-enviada");
  };

  // Manejo del cambio en las variables seleccionadas (checkboxes)
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setPollutantVariables((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-4 md:px-6 py-12 font-sans relative">
      {/* Botón "Atrás" en la parte superior izquierda */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 md:px-6 md:py-3 text-base md:text-lg border border-lime-500 text-lime-700 bg-white rounded-lg shadow-md hover:bg-lime-100 transition-all">
        Atrás
      </button>

      <h1 className="text-2xl md:text-4xl font-extrabold text-lime-700 mb-6 md:mb-10 mt-16 md:mt-20 text-center px-4">
        Registro de estación
      </h1>

      <div className="bg-lime-100 shadow-lg rounded-3xl p-4 md:p-10 w-full max-w-5xl">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

          {/* Nombre institución */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Nombre de la institución
            </label>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
            >
              <option value="">Selecciona una institución</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
            {errors.institution && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.institution}</p>}
          </div>

          {/* Ubicación geográfica */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Ubicación geográfica
            </label>
            <div className="flex gap-2 md:gap-4">
              <input 
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitud"
                className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg w-full text-sm md:text-base"
              />
              <input 
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitud"
                className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg w-full text-sm md:text-base"
              />
            </div>
            {errors.location && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.location}</p>}
          </div>

          {/* Tipo de sensor */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Tipo de sensor
            </label>
            <input 
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              placeholder="Ej: Sensor de partículas PM2.5"
              className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
            />
            {errors.sensorType && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.sensorType}</p>}
          </div>

          {/* Selección de contaminación o meteorología */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Variables de contaminación
            </label>
            <div className="space-y-2 max-h-40 md:max-h-none overflow-y-auto">
              {pollutants.map((pollutant) => (
                <div key={pollutant} className="flex items-center">
                  <input
                    type="checkbox"
                    value={pollutant}
                    checked={pollutantVariables.includes(pollutant)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700 text-sm md:text-base">{pollutant}</label>
                </div>
              ))}
            </div>
            {errors.variables && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.variables}</p>}
          </div>

          {/* Responsable Técnico */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Responsable técnico
            </label>
            <input 
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Nombre del responsable"
              className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
            />
            {errors.responsible && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.responsible}</p>}
          </div>

          {/* Correo */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1 text-sm md:text-base">
              Correo del responsable técnico
            </label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-sm md:text-base"
            />
            {errors.email && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-10">

          {/* Calibración */}
          <div>
            <label className="font-semibold text-gray-700 text-sm md:text-base">Documentos/Certificados de Calibración</label>
            <div 
              onClick={() => handleFileClick("calibration")}
              className="border-2 border-dashed border-lime-500 rounded-xl py-6 md:py-10 text-center text-lime-700 cursor-pointer bg-white mt-2"
            >
              <input 
                type="file"
                ref={fileInputRefCalibration}
                className="hidden"
                accept=".png,.jpg,.doc,.docx,.pdf"
                onChange={(e) => handleFileUpload(e, "calibration")}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600 font-semibold underline text-sm md:text-base">{calibrationFile ? "Cambiar archivo" : "Sube un archivo"}</span>
              <p className="text-xs md:text-sm mt-1 text-lime-700">PNG, JPG, DOC, DOCX, PDF (máx. 10MB)</p>
              {errors.calibrationFile && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.calibrationFile}</p>}
            </div>
          </div>

          {/* Mantenimiento */}
          <div>
            <label className="font-semibold text-gray-700 text-sm md:text-base">Documentos/Certificados de Mantenimiento</label>
            <div 
              onClick={() => handleFileClick("maintenance")}
              className="border-2 border-dashed border-lime-500 rounded-xl py-6 md:py-10 text-center text-lime-700 cursor-pointer bg-white mt-2"
            >
              <input 
                type="file"
                ref={fileInputRefMaintenance}
                className="hidden"
                accept=".png,.jpg,.doc,.docx,.pdf"
                onChange={(e) => handleFileUpload(e, "maintenance")}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600 font-semibold underline text-sm md:text-base">{maintenanceFile ? "Cambiar archivo" : "Sube un archivo"}</span>
              <p className="text-xs md:text-sm mt-1 text-lime-700">PNG, JPG, DOC, DOCX, PDF (máx. 10MB)</p>
              {errors.maintenanceFile && <p className="text-xs md:text-sm text-red-500 mt-1">{errors.maintenanceFile}</p>}
            </div>
          </div>

        </div>

        {/* BOTÓN */}
        <div className="mt-6 md:mt-10 flex justify-center md:justify-end">
          <button 
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 py-3 bg-lime-600 text-white rounded-lg font-semibold text-base md:text-lg hover:bg-lime-700 transition">
            Crear Estación
          </button>
        </div>
      </div>
    </div>
  );
}


