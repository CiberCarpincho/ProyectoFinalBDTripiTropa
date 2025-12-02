import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterInstitution from "./pages/RegisterInstitution";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import RegistrationReview from "./pages/RegistrationReview";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterStation from "./pages/RegisterStation";
import StationReview from "./pages/StationReview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-institucion" element={<RegisterInstitution />} />
        <Route path="/crear-cuenta" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro-enviado" element={<RegistrationReview />} />
        <Route path="/registro-exitoso" element={<RegisterSuccess />} />
        <Route path="/registrar-estacion" element={<RegisterStation />} />
        <Route path="/estacion-enviada" element={<StationReview />} />
      </Routes>
    </BrowserRouter>
  );
}
