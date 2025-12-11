# VRISA - Vigilancia de la Red de Inmisiones y Sustancias Atmosféricas

Sistema de monitoreo de contaminantes criterio en la ciudad de Cali para la gestión y análisis de calidad del aire.

---

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado:

- **Git**: https://git-scm.com/downloads
- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- **Node.js v20+**: https://nodejs.org/ (versión LTS)

### Verificar Instalaciones
```bash
git --version
docker --version
docker-compose --version
node --version
npm --version
```

---

## Instalación y Ejecución

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/CiberCarpincho/ProyectoFinalBDTripiTropa.git
cd ProyectoFinalBDTripiTropa
git checkout BF
```


### Paso 2: Ejecutar el Backend
```bash
# Ir a la carpeta del backend (raíz del proyecto)
cd ProyectoFinalBDTripiTropa

# Levantar contenedores Docker en segundo plano
docker-compose up -d
```

**Esperar** aproximadamente 1-2 minutos para que los contenedores se inicialicen completamente.

### Paso 3: Instalar Dependencias del Frontend
```bash
# Ir a la carpeta del frontend
cd vrisa_frontend

# Instalar dependencias (solo la primera vez)
npm install
```

### Paso 4: Ejecutar el Frontend
```bash
# Desde la carpeta vrisa_frontend
npm run dev
```

---

## Acceso a las Aplicaciones

Una vez ejecutados ambos comandos, podrá acceder a:

| Aplicación | URL | Descripción |
|------------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interfaz web de usuario (React) |
| **Admin Django** | http://localhost:8000/admin | Panel de administración |


---

## Estructura de Carpetas
```
ProyectoFinalBDTripiTropa/
├── Backend (raíz del proyecto)
│   ├── core/                    # Aplicación Django
│   ├── vrisa_backend/           # Configuración Django
│   ├── docker-compose.yml       # Configuración Docker
│   ├── Dockerfile               # Imagen Docker
│   ├── requirements.txt         # Dependencias Python
│   ├── manage.py                # CLI Django
│   └── .env                     # Variables de entorno
│
└── vrisa_frontend/              # Frontend React
    ├── src/                     # Código fuente
    ├── public/                  # Archivos públicos
    ├── package.json             # Dependencias npm
    └── vite.config.js           # Configuración Vite
```

---

## Flujo de Trabajo Diario

### Iniciar el Sistema

**Terminal 1 - Backend:**
```bash
cd ProyectoFinalBDTripiTropa
docker-compose up -d
```

**Terminal 2 - Frontend:**
```bash
cd ProyectoFinalBDTripiTropa/vrisa_frontend
npm run dev
```

### Detener el Sistema

**Frontend:**
- Presionar `Ctrl + C` en la terminal del frontend

**Backend:**
```bash
cd ProyectoFinalBDTripiTropa
docker-compose down
```


