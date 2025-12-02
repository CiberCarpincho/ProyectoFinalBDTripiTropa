import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterStation() {
  const navigate = useNavigate();

  const [institution, setInstitution] = useState("");
  const [measurementType, setMeasurementType] = useState("");
  const [meteorologicalVariable, setMeteorologicalVariable] = useState("");
  const [pollutantVariable, setPollutantVariable] = useState("");
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

    // Validar tipo de medición
    if (!measurementType) {
      newErrors.measurementType = "El tipo de medición es obligatorio.";
    }

    // Validar variables de contaminación o meteorología
    if (measurementType === "concentraciones" && !pollutantVariable) {
      newErrors.pollutantVariable = "Selecciona una variable de contaminantes.";
    } else if (measurementType === "mediciones" && !meteorologicalVariable) {
      newErrors.meteorologicalVariable = "Selecciona una variable meteorológica.";
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

    if (!validate()) return; // No deja avanzar si hay errores

    // Si pasa validación, navegar al siguiente paso
    navigate("/estacion-enviada");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-6 py-12 font-sans">
      <h1 className="text-4xl font-extrabold text-lime-700 mb-10">
        Registro de estación
      </h1>

      <div className="bg-lime-100 shadow-lg rounded-3xl p-10 w-full max-w-5xl">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Nombre institución */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Nombre de la institución
            </label>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
            >
              <option value="">Selecciona una institución</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
            {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
          </div>

          {/* Ubicación geográfica */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Ubicación geográfica
            </label>
            <div className="flex gap-4">
              <input 
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitud"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg w-full"
              />
              <input 
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitud"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg w-full"
              />
            </div>
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Tipo de sensor */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Tipo de sensor
            </label>
            <input 
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              placeholder="Ej: Sensor de partículas PM2.5"
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
            />
            {errors.sensorType && <p className="text-sm text-red-500">{errors.sensorType}</p>}
          </div>

          {/* Variables medidas */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Tipo de medición
            </label>
            <select
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
            >
              <option value="">Selecciona tipo de medición</option>
              <option value="mediciones">Mediciones meteorológicas</option>
              <option value="concentraciones">Concentraciones</option>
            </select>
            {errors.measurementType && <p className="text-sm text-red-500">{errors.measurementType}</p>}
          </div>

          {/* Selección de contaminación o meteorología */}
          {measurementType === "concentraciones" ? (
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">
                Variables de contaminantes
              </label>
              <select
                value={pollutantVariable}
                onChange={(e) => setPollutantVariable(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Selecciona una variable</option>
                {pollutants.map((pollutant) => (
                  <option key={pollutant} value={pollutant}>{pollutant}</option>
                ))}
              </select>
              {errors.pollutantVariable && <p className="text-sm text-red-500">{errors.pollutantVariable}</p>}
            </div>
          ) : measurementType === "mediciones" ? (
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">
                Variables meteorológicas
              </label>
              <select
                value={meteorologicalVariable}
                onChange={(e) => setMeteorologicalVariable(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Selecciona una variable</option>
                {meteorologicalVariables.map((variable) => (
                  <option key={variable} value={variable}>{variable}</option>
                ))}
              </select>
              {errors.meteorologicalVariable && <p className="text-sm text-red-500">{errors.meteorologicalVariable}</p>}
            </div>
          ) : null}

          {/* Responsable Técnico */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Responsable técnico
            </label>
            <input 
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Nombre del responsable"
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
            />
            {errors.responsible && <p className="text-sm text-red-500">{errors.responsible}</p>}
          </div>

          {/* Correo */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Correo del responsable técnico
            </label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

          {/* Calibración */}
          <div>
            <label className="font-semibold text-gray-700">Documentos/Certificados de Calibración</label>
            <div 
              onClick={() => handleFileClick("calibration")}
              className="border-2 border-dashed border-lime-500 rounded-xl py-10 text-center text-lime-700 cursor-pointer bg-white"
            >
              <input 
                type="file"
                ref={fileInputRefCalibration}
                className="hidden"
                accept=".png,.jpg,.doc,.docx,.pdf"
                onChange={(e) => handleFileUpload(e, "calibration")}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600 font-semibold underline">{calibrationFile ? "Cambiar archivo" : "Sube un archivo"}</span>
              <p className="text-sm mt-1 text-lime-700">PNG, JPG, DOC, DOCX, PDF (máx. 10MB)</p>
              {errors.calibrationFile && <p className="text-sm text-red-500">{errors.calibrationFile}</p>}
            </div>
          </div>

          {/* Mantenimiento */}
          <div>
            <label className="font-semibold text-gray-700">Documentos/Certificados de Mantenimiento</label>
            <div 
              onClick={() => handleFileClick("maintenance")}
              className="border-2 border-dashed border-lime-500 rounded-xl py-10 text-center text-lime-700 cursor-pointer bg-white"
            >
              <input 
                type="file"
                ref={fileInputRefMaintenance}
                className="hidden"
                accept=".png,.jpg,.doc,.docx,.pdf"
                onChange={(e) => handleFileUpload(e, "maintenance")}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600 font-semibold underline">{maintenanceFile ? "Cambiar archivo" : "Sube un archivo"}</span>
              <p className="text-sm mt-1 text-lime-700">PNG, JPG, DOC, DOCX, PDF (máx. 10MB)</p>
              {errors.maintenanceFile && <p className="text-sm text-red-500">{errors.maintenanceFile}</p>}
            </div>
          </div>

        </div>

        {/* BOTÓN */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-lime-600 text-white rounded-lg font-semibold text-lg hover:bg-lime-700 transition">
            Crear Estación
          </button>
        </div>
      </div>
    </div>
  );
}
