import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const navigate = useNavigate();

  // ====== ESTADO DEL FORMULARIO ======
  const [firstName, setFirstName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [expectedRole, setExpectedRole] = useState("");

  // ====== ERRORES ======
  const [errors, setErrors] = useState({});

  // Esqueleto de instituciones (mock hasta conectar backend)
  const institutionsMock = [
    { id: "1", name: "Universidad Nacional" },
    { id: "2", name: "Universidad del Valle" },
    { id: "3", name: "Institución Educativa VrISA" },
  ];

  // Opciones de rol esperado
  const roleOptions = [
    { value: "station_admin", label: "Administrador de estación" },
    { value: "institution_admin", label: "Administrador de institución" },
    { value: "researcher", label: "Investigador" },
    { value: "environmental_authority", label: "Autoridad ambiental" },
    { value: "citizen", label: "Ciudadanía" },
  ];

  // ====== VALIDACIÓN ======
  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Los nombres son obligatorios.";
    }

    if (!firstLastName.trim()) {
      newErrors.firstLastName = "El primer apellido es obligatorio.";
    }

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Ingresa un correo válido.";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "El teléfono debe tener 10 dígitos numéricos.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!expectedRole) {
      newErrors.expectedRole = "Debes seleccionar un rol esperado.";
    }

    // La institución solo es obligatoria para admin de estación o investigador
    const roleNeedsInstitution =
      expectedRole === "station_admin" || expectedRole === "researcher" || expectedRole === "institution_admin";

    if (roleNeedsInstitution && !institution) {
      newErrors.institution = "Debes seleccionar una institución.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====== SUBMIT ======
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  const payload = {
    firstName,
    firstLastName,
    secondLastName: secondLastName || null,
    email,
    phone,
    password,
    expectedRole,
    institution: institution || null,
  };

  console.log("Account payload ready (mock) →", payload);

  // Si el rol es ciudadanía → éxito inmediato
  if (expectedRole === "citizen") {
    navigate("/registro-exitoso");
    return;
  }

  // Si NO es ciudadanía → va a revisión por un administrador
  navigate("/registro-enviado");
};

  // Para saber si se debe mostrar el campo institución
  const shouldShowInstitution =
    expectedRole === "station_admin" || expectedRole === "researcher";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-6 py-12 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl w-full">
        
        {/* TEXTO IZQUIERDO */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-lime-700 leading-tight">
            Crear <br /> cuenta
          </h1>
          <p className="text-lg text-gray-600 max-w-sm mx-auto md:mx-0">
            Regístrate para comenzar a usar VrISA.
          </p>
        </div>

        {/* FORMULARIO DERECHA */}
        <form
          onSubmit={handleSubmit}
          className="bg-lime-100 rounded-2xl shadow-xl p-8 space-y-6 w-full mx-auto"
        >
          {/* Nombres */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-lg">
              Nombres
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej: Juan Carlos"
              className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                errors.firstName
                  ? "border-red-400 focus:ring-red-400"
                  : "border-lime-300 focus:ring-lime-500"
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primer apellido */}
            <div className="text-center sm:text-left">
              <label className="text-gray-800 font-semibold text-lg">
                Primer apellido
              </label>
              <input
                type="text"
                value={firstLastName}
                onChange={(e) => setFirstLastName(e.target.value)}
                placeholder="Ej: Pérez"
                className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                  errors.firstLastName
                    ? "border-red-400 focus:ring-red-400"
                    : "border-lime-300 focus:ring-lime-500"
                }`}
              />
              {errors.firstLastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstLastName}
                </p>
              )}
            </div>

            {/* Segundo apellido */}
            <div className="text-center sm:text-left">
              <label className="text-gray-800 font-semibold text-lg">
                Segundo apellido
              </label>
              <input
                type="text"
                value={secondLastName}
                onChange={(e) => setSecondLastName(e.target.value)}
                placeholder="Ej: Gómez"
                className="w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 border-lime-300 focus:ring-lime-500"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-lg">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@dominio.com"
              className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-lime-300 focus:ring-lime-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-lg">
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 3001234567"
              className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                errors.phone
                  ? "border-red-400 focus:ring-red-400"
                  : "border-lime-300 focus:ring-lime-500"
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-lg">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-lime-300 focus:ring-lime-500"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Rol esperado */}
          <div className="text-center">
            <label className="text-gray-800 font-semibold text-lg">
              Rol esperado
            </label>
            <select
              value={expectedRole}
              onChange={(e) => setExpectedRole(e.target.value)}
              className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                errors.expectedRole
                  ? "border-red-400 focus:ring-red-400"
                  : "border-lime-300 focus:ring-lime-500"
              }`}
            >
              <option value="">Selecciona un rol</option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.expectedRole && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expectedRole}
              </p>
            )}
          </div>

          {/* Institución (solo para admin de estación / institucion o investigador) */}
          {shouldShowInstitution && (
            <div className="text-center">
              <label className="text-gray-800 font-semibold text-lg">
                Institución
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className={`w-full mt-2 px-4 py-3 text-lg border rounded-lg bg-white outline-none focus:ring-2 ${
                  errors.institution
                    ? "border-red-400 focus:ring-red-400"
                    : "border-lime-300 focus:ring-lime-500"
                }`}
              >
                <option value="">Seleccione una institución</option>
                {institutionsMock.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
              {errors.institution && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.institution}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-1">
                * Esta lista será cargada dinámicamente desde el backend en una siguiente etapa.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 text-base font-semibold text-lime-700 underline"
            >
              Volver al inicio de sesión
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-lime-600 text-lg text-white font-semibold rounded-lg hover:bg-lime-700 transition-all shadow"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
