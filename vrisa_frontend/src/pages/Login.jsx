import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/config";  //Conexion baqenFronen JuanConex


export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);  // JuanConex

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

  //Funcion handleSubmit modificada por JuanConex
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // No deja avanzar si hay errores

    setIsLoading(true); // Mostrar estado de carga
    setErrors({}); // Limpiar errores previos

    try {
      // Hacer petición al backend
      const data = await fetchAPI('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          email: correo,
          password: contrasena
        })
      });

      // Si el login es exitoso, guardar el token
      if (data.access) {
        localStorage.setItem('token', data.access);

        // Guardar datos del usuario si vienen
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Navegar al dashboard
        navigate("/dashboard");
      } else {
        setErrors({ general: "Error al iniciar sesión" });
      }

    } catch (error) {
      console.error('Error en login:', error);
      setErrors({
        general: "Usuario o contraseña incorrectos. Verifica tus credenciales."
      });
    } finally {
      setIsLoading(false); // Quitar estado de carga
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-12 items-center">

          {/* IZQUIERDA */}
          <div className="space-y-4 text-left">
            <h1 className="text-6xl font-extrabold text-lime-700">VriSA</h1>
            <h2 className="text-3xl font-semibold text-gray-900">Iniciar sesión</h2>
            <p className="text-xl text-gray-600 font-medium">Bienvenido a VriSA</p>

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

              {/* Mensaje de error general JuanConex*/}
              {errors.general && (
                  <div className="p-3 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
              )}

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
                  disabled={isLoading}  // agregacion JuanConex
                  className={`px-6 py-2 text-base text-white font-semibold rounded-lg transition-all ${
                      isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-lime-600 hover:bg-lime-700"
                  }`}  // Agregacio JuanConex
                >
                  {isLoading ? "Iniciando sesión..." : "Continuar"}  {/* ← agreg JuanConex */}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
