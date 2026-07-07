# tap-examen
Examen de admisión - Área de Desarrollo TAP Terminal

# TAP Examen - Área de Desarrollo

Sistema de gestión de productos, usuarios y perfiles, desarrollado como examen de admisión para el área de Tecnologías de la Información de Grupo TAP Terminal.

## Stack
- Backend: Laravel 11 + PHP 8.2
- Frontend: Angular 19 + TypeScript 5.0
- Base de datos: MongoDB 7
- Documentación API: Postman
- Autenticación: Laravel Sanctum (tokens Bearer)
- Contenedores: Docker + Docker Compose
- Correo (recuperación de contraseña): Mailtrap (entorno de pruebas)

## Estructura
```
tap-examen/
├── backend/          → API Laravel
├── frontend/         → Aplicación Angular
├── docker-compose.yml
└── README.md
```

## Requisitos previos
- Docker Desktop con integración WSL2 habilitada (o Docker nativo en Linux/Mac)
- Git

## Instalación y arranque
 
1. Clonar el repositorio:
```bash
   git clone <url-del-repositorio>
   cd tap-examen
```
 
2. Crear el archivo `.env` en la raíz (para permisos de usuario dentro de Docker):
```bash
   cat > .env << EOF
   HOST_UID=$(id -u)
   HOST_GID=$(id -g)
   EOF
```
 
3. Levantar todos los servicios:
```bash
   docker compose up -d
```
 
4. Instalar dependencias (si es la primera vez o tras clonar):
```bash
   docker compose exec backend composer install
   docker compose exec frontend npm install
```
 
5. Configurar el archivo `backend/.env` (copiar de `.env.example` si no existe) con las credenciales de MongoDB y Mailtrap correspondientes.
6. Ejecutar el seeder para crear el usuario Super Admin, perfil y secciones iniciales:
```bash
   docker compose exec backend php artisan db:seed
```
 
7. Acceder a:
   - **Frontend (Angular):** http://localhost:4200
   - **API (Laravel):** http://localhost:8000/api
   - **Mongo Express (administración visual de BD):** http://localhost:8081

## Credenciales de acceso inicial
 
| Usuario | Contraseña | Perfil |
|---|---|---|
| admin@tapterminal.com | Admin123! | Super Admin (todas las secciones) |
 
## Arquitectura y decisiones de diseño
 
### Modelo de permisos (RBAC dinámico)
 
El sistema no maneja roles fijos codificados (ej. "admin", "capturador" como constantes). En su lugar:
 
- Existen **Secciones** (Productos, Usuarios, Perfiles), que representan módulos del sistema.
- Existen **Perfiles**, que son conjuntos de secciones a las que dan acceso (relación muchos a muchos con Secciones).
- Cada **Usuario** tiene asignado un Perfil (relación diseñada como muchos a muchos a nivel de base de datos para flexibilidad futura, aunque en la práctica de este sistema cada usuario tiene un único perfil asignado desde el frontend).
Un usuario solo puede acceder a las pantallas cuyas secciones estén incluidas en su perfil. La gestión de Perfiles es, por convención, la sección más sensible: quien tiene acceso a ella puede otorgar o restringir accesos a otros usuarios.
 
### Base de datos NoSQL (MongoDB)
 
Se utilizó el paquete oficial `mongodb/laravel-mongodb`. Algunas piezas de Laravel que asumen bases de datos SQL requirieron adaptación:
 
- **Sanctum (autenticación por tokens):** se creó un modelo `PersonalAccessToken` propio, usando el trait `DocumentModel`, ya que el modelo por defecto de Sanctum depende de conexiones PDO que MongoDB no utiliza.
- **Recuperación de contraseña:** se implementó un flujo propio (generación de contraseña temporal + envío por correo) en lugar del broker nativo de Laravel (`Password::sendResetLink`), ya que este último presenta incompatibilidades documentadas con MongoDB.
- **Sesiones HTTP:** se configuraron con el driver `file` en lugar de `database`, para no depender de una tabla SQL de sesiones.
### Seguridad
 
- Contraseñas hasheadas con bcrypt (`Hash::make`).
- Autenticación stateless mediante tokens Bearer (Sanctum).
- Validación de contraseña robusta (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo) al cambiar contraseña.
- CORS restringido explícitamente al origen del frontend (`http://localhost:4200`).
- Campos sensibles (contraseñas) excluidos explícitamente del registro de bitácora.
- **Advisories de seguridad conocidas:** se detectaron 3 advisories en `laravel/framework` relacionadas con inyección CRLF en la regla de validación `email` (CVE-2026-48019) y confusión de rutas en URLs firmadas. No existe versión parchada dentro de la rama Laravel 11.x requerida por el examen (el fix está disponible desde Laravel 12.60+/13.10+). Se aceptó el riesgo de forma consciente y se mitigó evitando depender exclusivamente de la regla `email` por defecto en validaciones críticas.
### Bitácora
 
Implementada mediante Eloquent Model Observers (`AuditObserver`), registrado sobre los modelos `Product`, `User` y `Profile`. Captura automáticamente creación, actualización y eliminación, sin necesidad de código adicional en los controladores. Guarda el estado completo antes/después (excluyendo campos sensibles) y el usuario autenticado que realizó el cambio.
 
### Exportación de reportes
 
Cada uno de los 3 recursos principales (Productos, Usuarios, Perfiles) cuenta con exportación a PDF (vía `barryvdh/laravel-dompdf`) y Excel (vía `maatwebsite/excel`), accesible desde botones en la interfaz de listado.
 
## Documentación de la API
 
La documentación completa de endpoints (incluyendo ejemplos de peticiones y respuestas) se encuentra en la colección de Postman adjunta: `TAP Examen API.postman_collection.json`.
 
### Resumen de endpoints principales
 
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/login` | Inicio de sesión | No |
| POST | `/api/logout` | Cierre de sesión | Sí |
| POST | `/api/forgot-password` | Recuperación de contraseña | No |
| POST | `/api/change-password` | Cambio de contraseña propia | Sí |
| GET/POST/PUT/DELETE | `/api/products` | CRUD de productos | Sí |
| GET | `/api/products/export/{pdf\|excel}` | Exportar productos | Sí |
| GET/POST/PUT/DELETE | `/api/users` | CRUD de usuarios | Sí |
| GET | `/api/users/export/{pdf\|excel}` | Exportar usuarios | Sí |
| GET/POST/PUT/DELETE | `/api/profiles` | CRUD de perfiles | Sí |
| GET | `/api/profiles/export/{pdf\|excel}` | Exportar perfiles | Sí |
| GET/POST | `/api/sections` | Listado/alta de secciones | Sí |
| GET | `/api/bitacora` | Consulta de bitácora | Sí |
 
## Notas operativas para desarrollo local
- Si se reinicia el contenedor `backend`, es necesario reiniciar también `nginx` (`docker compose restart backend nginx`) para evitar errores 502 por caché de resolución de IP interna de Docker.
- Los permisos de archivos generados dentro de los contenedores (Composer, Artisan, Angular CLI) se resuelven automáticamente gracias a la configuración de usuario con UID/GID espejado en los Dockerfiles (`backend/Dockerfile` y `frontend/Dockerfile`).

## Pendientes / mejoras futuras 
- Subida real de archivo para foto de perfil de usuario (actualmente se recibe como URL).
- Envío de correo en entorno de producción (actualmente configurado con Mailtrap, entorno de pruebas).
- Pruebas unitarias y pipeline de CI/CD (no implementado por restricción de tiempo).
