Guía de Instalación y Ejecución - VRISA
Requisitos:
Git: https://git-scm.com/downloads
Docker Desktop: https://www.docker.com/products/docker-desktop
Node.js v20+: https://nodejs.org/ (versión LTS)
Verificar Instalaciones en la consola:
bashgit --version
docker --version
docker-compose --version
node --version
npm --version
Paso 1:Clonar el Repositorio
bashgit clone https://github.com/CiberCarpincho/ProyectoFinalBDTripiTropa.git
cd ProyectoFinalBDTripiTropa
git checkout juanBF
Paso 2: Ejecutar el Backend
//Ir a la carpeta del backend (raíz del proyecto)
cd ProyectoFinalBDTripiTropa
# Levantar contenedores Docker en segundo plano
docker-compose up -d
Esperar aproximadamente 1-2 minutos para que los contenedores se inicialicen completamente.
Paso 4: Instalar Dependencias del Frontend
cd vrisa_frontend      //ir a la carpeta de forntend
npm install
Paso 5: Ejecutar el Frontend
npm run dev
