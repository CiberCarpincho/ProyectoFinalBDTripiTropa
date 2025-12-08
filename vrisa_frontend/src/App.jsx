import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterInstitution from "./pages/RegisterInstitution";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import Stations from "./pages/Stations";
import RegistrationReview from "./pages/RegistrationReview";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterStation from "./pages/RegisterStation";
import StationReview from "./pages/StationReview";
import RegisterRequest from "./pages/RegisterRequest";
import IntegrationRequest from "./pages/IntegrationRequest";
import StationDetails from "./pages/StationDetails";
import Reports from "./pages/Reports";
import ReportTendencies from "./pages/ReportTendencies";
import ReportAir from "./pages/ReportAir";
import ReportAlerts from "./pages/ReportAlerts";
import ReportMaintenance from "./pages/ReportMaintenance";
import Alerts from "./pages/Alerts";
import { useEffect } from 'react'; //nuevo import JuanConex (borrar luego)

//Ajuste de JuanConex para poder conectar el baqen y fronen (borrar luego)
import { fetchAPI } from './api/config';

export default function App() {

  // Prueba de conexión juanConex
  useEffect(() => {
    console.log('🔥 Probando conexión con backend...');
    fetchAPI('/stations/')
        .then(data => console.log('✅ DATOS DEL BACKEND:', data))
        .catch(err => console.log('❌ ERROR:', err));
  }, []);
  //fin de prueba de JuanConex (luego se borra)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-institucion" element={<RegisterInstitution />} />
        <Route path="/crear-cuenta" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estaciones" element={<Stations />} />
        <Route path="/detalles-estacion" element={<StationDetails />} />
        <Route path="/registro-enviado" element={<RegistrationReview />} />
        <Route path="/registro-exitoso" element={<RegisterSuccess />} />
        <Route path="/registrar-estacion" element={<RegisterStation />} />
        <Route path="/estacion-enviada" element={<StationReview />} />
        <Route path="/solicitud-registro" element={<RegisterRequest />} />
        <Route path="/solicitud-integracion" element={<IntegrationRequest />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/tendencias" element={<ReportTendencies />} />
        <Route path="/aire" element={<ReportAir />} />
        <Route path="/mantenimiento" element={<ReportMaintenance />} />
        <Route path="/reporte-alertas" element={<ReportAlerts />} />
        <Route path="/alertas" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}
