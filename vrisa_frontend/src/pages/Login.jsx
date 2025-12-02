import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Validar correo
    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      newErrors.correo = "Ingresa un correo válido.";
    }

    // Validar contraseña
    if (!contrasena.trim()) {
      newErrors.contrasena = "La contraseña es obligatoria.";
    } else if (contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener mínimo 6 caracteres.";
    }

    setErrors(newErrors);

    // Éxito si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return; // No deja avanzar si hay errores

    // Si pasa validación, navegar al dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-12 items-center">

          {/* IZQUIERDA */}
          <div className="space-y-4 text-left">
            <h1 className="text-6xl font-extrabold text-lime-700">VrISA</h1>
            <h2 className="text-3xl font-semibold text-gray-900">Iniciar sesión</h2>
            <p className="text-xl text-gray-600 font-medium">Bienvenido a VrISA</p>

            <button
              type="button"
              onClick={() => navigate("/registrar-institucion")}
              className="mt-26 px-5 py-3 bg-lime-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-lime-700 transition-all"
            >
              Registrar institución
            </button>
          </div>

          {/* DERECHA */}
          <div className="bg-lime-100 rounded-2xl shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* CORREO */}
              <div className="flex flex-col gap-3">
                <label className="text-lg font-bold text-gray-800">Correo</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="email@domain.com"
                  className={`w-full px-3 py-3 border rounded-lg outline-none bg-white focus:ring-2 ${
                    errors.correo ? "border-red-400 focus:ring-red-400" : "border-lime-300 focus:ring-lime-500"
                  }`}
                />
                {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
              </div>

              {/* CONTRASEÑA */}
              <div className="flex flex-col gap-3">
                <label className="text-lg font-bold text-gray-800">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-3 border rounded-lg outline-none bg-white focus:ring-2 ${
                    errors.contrasena ? "border-red-400 focus:ring-red-400" : "border-lime-300 focus:ring-lime-500"
                  }`}
                />
                {errors.contrasena && <p className="text-sm text-red-500">{errors.contrasena}</p>}
              </div>

              {/* ABAJO */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-3">
                <span className="text-base text-gray-700">
                  ¿No tienes una cuenta?{" "}
                  <button
                    className="text-lime-700 font-semibold underline"
                    type="button"
                    onClick={() => navigate("/crear-cuenta")}
                  >
                    Crea tu cuenta
                  </button>
                </span>

                <button
                  type="submit"
                  className="px-6 py-2 bg-lime-600 text-base text-white font-semibold rounded-lg hover:bg-lime-700 transition-all"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
