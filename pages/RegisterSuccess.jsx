import { useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100 px-6 py-12 font-sans text-center">
      
      <div className="bg-white shadow-xl rounded-2xl px-10 py-12 max-w-md w-full border border-lime-200">
        
        {/* Check verde */}
        <div className="w-20 h-20 rounded-full bg-lime-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-lime-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-lime-700 mb-3">
          Registro exitoso
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Tu cuenta ha sido creada correctamente.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-lime-600 text-white rounded-lg text-lg font-semibold hover:bg-lime-700 transition"
        >
          Volver al inicio de sesión
        </button>
      </div>

    </div>
  );
}
