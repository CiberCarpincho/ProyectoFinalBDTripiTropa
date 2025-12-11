VRISA - Guía de Instalación y Ejecución
Este proyecto utiliza una arquitectura con backend en Docker (PostgreSQL + Node.js) y frontend en React.

Requisitos Previos
Asegúrate de tener instaladas las siguientes herramientas:

Herramienta	Enlace de Descarga	Versión Requerida
Git	https://git-scm.com/downloads	Cualquier versión estable
Docker Desktop	https://www.docker.com/products/docker-desktop	Docker + Docker Compose
Node.js	https://nodejs.org/	v20 o superior (LTS recomendada)
Verificar Instalaciones
Ejecuta los siguientes comandos en tu terminal para confirmar que todo está correctamente instalado:

bash
git --version
docker --version
docker-compose --version
node --version
npm --version
Configuración del Proyecto
Paso 1: Clonar el Repositorio
bash
# Clonar el repositorio
git clone https://github.com/CiberCarpincho/ProyectoFinalBDTripiTropa.git

# Navegar al directorio del proyecto
cd ProyectoFinalBDTripiTropa

# Cambiar a la rama de desarrollo
git checkout juanBF
Paso 2: Ejecutar el Backend con Docker
bash
# Asegúrate de estar en la raíz del proyecto (ProyectoFinalBDTripiTropa)

# Levantar los contenedores Docker en segundo plano
docker-compose up -d
⏳ Espera 1-2 minutos para que los contenedores se inicialicen completamente.

Paso 3: Instalar Dependencias del Frontend
bash
# Navegar a la carpeta del frontend
cd vrisa_frontend

# Instalar las dependencias de Node.js
npm install
Paso 4: Ejecutar la Aplicación
bash
# Iniciar el servidor de desarrollo del frontend
npm run dev
