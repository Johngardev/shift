<div align="center">

# Shift

**Aplicación web para registrar y consultar la jornada laboral de empleados.**

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-EA2845?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)

</div>

## Descripción

Shift es una aplicación full stack para gestionar el inicio y el fin de las jornadas laborales mediante un código de trabajador. La interfaz muestra un cronómetro mientras la jornada está activa; la API valida las operaciones y persiste los registros en MongoDB.

Este proyecto se desarrolló como prueba técnica y utiliza una arquitectura cliente-servidor con una API REST.

## Funcionalidades

- Iniciar una jornada asociada a un código de trabajador.
- Evitar que un trabajador inicie otra jornada si ya tiene una activa.
- Mostrar el tiempo transcurrido en tiempo real en la interfaz.
- Finalizar la jornada y guardar su duración en milisegundos y en formato `HH:MM:SS`.
- Consultar si un trabajador tiene una jornada activa.
- Mostrar mensajes de éxito y error en la aplicación.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | Angular 18, Angular Material, TypeScript, Reactive Forms, RxJS |
| Backend | NestJS 11, TypeScript, Mongoose, class-validator |
| Persistencia | MongoDB |

## Arquitectura

El frontend Angular consume la API REST de NestJS. El backend encapsula las reglas del dominio en el servicio de jornadas y usa Mongoose para comunicarse con MongoDB.

```mermaid
flowchart LR
    empleado[Empleado] -->|Interactúa| frontend[Frontend Angular 18<br/>Standalone · Material · Reactive Forms]
    frontend -->|HTTP / JSON| api[API REST NestJS 11<br/>/api/shifts]
    api --> controller[ShiftsController<br/>Rutas y validación]
    controller --> service[ShiftsService<br/>Reglas de negocio]
    service --> odm[Mongoose<br/>Esquema Shift]
    odm --> db[(MongoDB)]
    api -.->|Respuestas y errores HTTP| frontend
```

### Flujo de una jornada

```mermaid
flowchart TD
    inicio([El trabajador ingresa su código]) --> accion{Acción}

    accion -->|Iniciar| buscarInicio{¿Tiene una jornada activa?}
    buscarInicio -->|Sí| error400[HTTP 400 · Jornada activa existente]
    buscarInicio -->|No| crear[Crear jornada con estado ACTIVE]
    crear --> cronometro[Iniciar cronómetro en la interfaz]

    accion -->|Finalizar| buscarFin{¿Hay una jornada activa?}
    buscarFin -->|No| error404[HTTP 404 · No hay jornada activa]
    buscarFin -->|Sí| calcular[Calcular duración total]
    calcular --> guardar[Guardar fin, duración y estado FINISHED]
    guardar --> resumen[Mostrar duración de la jornada]
```

### Modelo de datos

```mermaid
erDiagram
    SHIFT {
        ObjectId _id PK
        string workerCode "Código del trabajador"
        Date startTime "Inicio de la jornada"
        Date endTime "Fin; nulo mientras está activa"
        number totalTimeWorkedMs "Duración en milisegundos"
        string totalTimeFormatted "Duración HH:MM:SS"
        string status "ACTIVE o FINISHED"
        Date createdAt "Fecha de creación"
        Date updatedAt "Fecha de actualización"
    }
```

## Requisitos previos

- Node.js y npm.
- Una instancia de MongoDB local o una URI de MongoDB Atlas.

## Configuración y ejecución

El repositorio contiene dos aplicaciones independientes. Ejecuta cada una en una terminal distinta.

### 1. Backend

```bash
cd backend
npm install
```

Configura la URI de MongoDB en `backend/.env`:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>/<base-de-datos>
PORT=3000
```

A continuación, inicia el servidor:

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api`.

### 2. Frontend

En otra terminal, desde la raíz del repositorio:

```bash
cd frontend
npm install
npm start
```

Abre la URL que muestra Angular CLI en la terminal (habitualmente `http://localhost:4200`).

> No publiques credenciales de MongoDB ni archivos `.env` con secretos en el repositorio.

## API REST

Todas las rutas usan el prefijo `/api`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/shifts/start` | Inicia una jornada. Devuelve `400` si ya existe una jornada activa para el trabajador. |
| `POST` | `/api/shifts/end` | Finaliza la jornada activa y calcula su duración. Devuelve `404` si no existe una jornada activa. |
| `GET` | `/api/shifts/active/:code` | Consulta si el trabajador tiene una jornada activa. |

Las rutas de inicio y finalización reciben un código de trabajador no vacío:

```json
{
  "workerCode": "EMP001"
}
```

Ejemplo para iniciar una jornada:

```bash
curl -X POST http://localhost:3000/api/shifts/start \
  -H "Content-Type: application/json" \
  -d '{"workerCode":"EMP001"}'
```

La ruta de consulta responde con `hasActiveShift` y `data` (el registro de la jornada o `null`). Las operaciones de inicio y finalización devuelven un mensaje y el registro en `data`.

## Pruebas y compilación

### Backend

```bash
cd backend
npm test
npm run test:e2e
npm run test:cov
npm run build
```

### Frontend

```bash
cd frontend
npm test
npm run build
```

## Estructura del repositorio

```text
.
├── backend/   # API REST en NestJS y acceso a MongoDB
└── frontend/  # Aplicación web en Angular
```

## Licencia

No se ha especificado una licencia para este repositorio.
