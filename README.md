# 🩺 MediConnect API - Examen Práctico de Recuperación

> **Materia:** Programación Backend  
> **Framework:** NestJS + TypeORM + MySQL  
> **Tiempo Estimado de Desarrollo:** 45 - 60 minutos  
> **Modalidad:** Desarrollo en Parejas (Pair Programming) + Sustentación Oral 100% Individual  

---

## 🧭 1. Descripción del Proyecto y Dominio

**MediConnect API** es un sistema backend modular para la gestión de personal médico y agendamiento de citas clínicas. La arquitectura sigue los principios de diseño modular de NestJS, separación de responsabilidades (SRP), validación estricta en el borde de la aplicación con DTOs y persistencia relacional asíncrona mediante TypeORM.

```
┌─────────────────────────┐               1 : N              ┌──────────────────────────┐
│      Médico (Padre)     │ ───────────────────────────────► │    Cita Médica (Hijo)    │
│    (Módulo 'medicos')   │                                  │    (Módulo 'citas')      │
└─────────────────────────┘                                  └──────────────────────────┘
```

---

## 🏗️ 2. Mapa de Arquitectura y Flujo de Datos

```
[ Cliente HTTP / Postman ]
       │
       ▼ (Request con payload JSON)
[ ValidationPipe Global (main.ts) ] ── (¿Cumple DTO? No ➔ 400 Bad Request)
       │
       ▼
[ CitasController (@Post, @Get, @Patch, @Delete) ]
       │
       ▼ (Invoca método)
[ CitasService (Lógica de Negocio) ] ──► [ MedicosService inyectado ] (Valida existencia y estado del Médico ➔ 404 / 400)
       │
       ▼ (Operaciones con TypeORM)
[ Repository<CitaMedica> ]
       │
       ▼ (SQL Queries)
[ Base de Datos MySQL ]
```

---

## 🚀 3. Instrucciones de Configuración y Levantamiento

### Paso 3.1: Instalar dependencias
```bash
npm install
```

### Paso 3.2: Configurar Variables de Entorno
Copia el archivo `.env.example` y crea tu archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

Configura tus credenciales de MySQL y el puerto asignado:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=citas_medicas_db
DB_SYNC=true
DB_LOGGING=true
```

> [!IMPORTANT]
> **Crear la Base de Datos antes de arrancar:** Crea la base de datos `citas_medicas_db` (o el nombre que definas) en tu gestor de MySQL (phpMyAdmin, DBeaver, MySQL Workbench o consola) antes de iniciar el servidor.

### Paso 3.3: Iniciar el Servidor en Modo Desarrollo
```bash
npm run start:dev
```
La API estará disponible con prefijo global en: `http://localhost:5000/api`

---

## 🎯 4. Retos Prácticos a Resolver

Dispones del tiempo de la prueba para resolver los siguientes requerimientos en el código:

### 🔹 Reto 1: Diagnóstico y Reparación del Arranque
* Al intentar iniciar el proyecto por primera vez, la aplicación no compilará debido a un desacoplamiento en la configuración modular de dependencias.
* **Criterio:** Identificar la causa raíz del error en la consola de NestJS y corregir la configuración de módulos para que el servicio inyectado sea resuelto correctamente.

### 🔹 Reto 2: Levantamiento y Puerto Personalizado
* Configura la aplicación para ejecutarse en el puerto **`PORT=8080`** con el prefijo global **`/api`**.
* **Criterio:** Verifica que `main.ts` y `ConfigService` lean la variable dinámicamente desde el entorno (`.env`).

### 🔹 Reto 3: Migración de Atributo en Entidad y DTOs
* En el módulo `citas`, agrega el atributo **`duracionMinutos`** (número entero, obligatorio, duración mínima de 15 minutos y máxima de 120 minutos):
  1. Agrega `@Column({ type: 'int', default: 30 })` en `src/citas/entities/cita.entity.ts`.
  2. Agrega las validaciones correspondientes (`@IsInt`, `@Min(15)`, `@Max(120)`) en `src/citas/dto/create-cita.dto.ts`.
  3. Asegúrate de que `src/citas/dto/update-cita.dto.ts` herede usando `PartialType`.

### 🔹 Reto 4: Regla de Negocio de Médico Inactivo
* Al registrar una cita médica (`POST /api/citas`):
  1. Si el `medicoId` no existe en la base de datos, la API debe responder automáticamente con **`404 Not Found`** generado por el servicio de médicos.
  2. **Regla de Negocio:** Si el médico existe pero su estado es inactivo (`activo: false`), la API debe rechazar la solicitud respondiendo con código **`400 Bad Request`** y el mensaje:  
     `"No se pueden programar citas para un médico inactivo"`.
  3. Si el médico está activo (`activo: true`), la cita se registra exitosamente con código **`201 Created`**.

### 🔹 Reto 5: Endpoint Especializado de Consulta
* Implementar el endpoint **`GET /api/citas/medico/:medicoId`**:
  1. Debe recibir el parámetro `:medicoId` validado como número entero mediante `ParseIntPipe`.
  2. Debe validar primero la existencia del médico (si no existe, retornar **`404 Not Found`**).
  3. Debe retornar el listado de todas las citas médicas asociadas a dicho médico.

---

## 📋 5. Catálogo de Endpoints de la API

### Módulo Médicos (`/api/medicos`)
| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/medicos` | Registra un nuevo médico | `201 Created`, `400 Bad Request`, `409 Conflict` (tarjeta duplicada) |
| `GET` | `/api/medicos` | Lista todos los médicos | `200 OK` |
| `GET` | `/api/medicos/:id` | Obtiene el detalle de un médico por ID | `200 OK`, `404 Not Found`, `400 Bad Request` |
| `PATCH` | `/api/medicos/:id` | Actualiza datos (ej: cambiar `activo` a `false`) | `200 OK`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/api/medicos/:id` | Elimina médico y sus citas en cascada | `200 OK`, `404 Not Found` |

### Módulo Citas (`/api/citas`)
| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/citas` | Registra una cita médica validando el médico | `201 Created`, `400 Bad Request` (inactivo/DTO), `404 Not Found` |
| `GET` | `/api/citas` | Lista todas las citas con los datos del médico | `200 OK` |
| `GET` | `/api/citas/:id` | Obtiene una cita por ID | `200 OK`, `404 Not Found` |
| `GET` | `/api/citas/medico/:medicoId` | Lista todas las citas asociadas a un médico | `200 OK`, `404 Not Found` |
| `PATCH` | `/api/citas/:id` | Actualiza los datos de una cita | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/citas/:id` | Elimina una cita médica | `200 OK`, `404 Not Found` |

---

## 🧪 6. Payloads de Prueba para Postman / Thunder Client

### 1. Registrar Médico Activo
`POST http://localhost:5000/api/medicos`
```json
{
  "nombreCompleto": "Dra. Valentina Morales",
  "tarjetaProfesional": "TP-98765-COL",
  "especialidad": "Cardiología",
  "activo": true
}
```

### 2. Registrar Cita Médica Exitosa (Médico ID: 1)
`POST http://localhost:5000/api/citas`
```json
{
  "pacienteNombre": "Andrés Gómez",
  "pacienteCorreo": "andres.gomez@correo.com",
  "motivoConsulta": "Chequeo preventivo de rutina y electrocardiograma",
  "costo": 180000.00,
  "duracionMinutos": 45,
  "medicoId": 1
}
```

### 3. Casos de Prueba de Validación (Demostraciones en Vivo)
* **Desactivar Médico:** `PATCH http://localhost:5000/api/medicos/1` con Body: `{ "activo": false }`.
* **Prueba 400 (Médico Inactivo):** Intentar agendar cita con el médico desactivado.
* **Prueba 400 (Validación DTO):** Enviar `"duracionMinutos": 5` o `"pacienteCorreo": "no-es-correo"`.
* **Prueba 400 (Propiedad no permitida):** Enviar payload con `"campoInvalido": 123` (Demuestra `forbidNonWhitelisted: true`).
* **Prueba 404 (Médico Inexistente):** Enviar `"medicoId": 9999`.
* **Prueba 409 (Conflicto de Unicidad):** Intentar registrar un médico con la misma `tarjetaProfesional`.

---

## 🎓 7. Criterios de Evaluación y Sustentación Oral

> [!WARNING]
> **Regla de Evaluación:** El desarrollo práctico se puede realizar en parejas, pero la **sustentación oral y la nota final son 100% individuales**. Cada integrante debe dominar y saber explicar cada línea de código implementada.

| Criterio | Porcentaje | Aspectos a Evaluar |
| :--- | :--- | :--- |
| **Funcionalidad y Pruebas en Vivo** | **30%** | La API compila, conecta a MySQL, responde en el puerto 8080 y pasa las pruebas en Postman sin errores 500. |
| **Arquitectura de Módulos e Inyección** | **30%** | Diagnóstico del error de arranque, configuración de inyección de dependencias entre módulos y desacoplamiento. |
| **Sustentación Oral Individual** | **40%** | Explicación técnica de las decisiones de código generadas, decoradores utilizados, flujo de datos y capacidad de realizar ajustes en vivo. |

---

## 📂 8. Estructura del Código Fuente

```
src/
├── app.module.ts                   # Módulo raíz (carga global de ConfigModule)
├── main.ts                         # Bootstrap de NestJS con ValidationPipe global
├── database/
│   └── database.module.ts          # Conexión asíncrona a MySQL con ConfigService
├── medicos/                        # Módulo Médicos (Padre)
│   ├── dto/
│   │   ├── create-medico.dto.ts
│   │   └── update-medico.dto.ts
│   ├── entities/
│   │   └── medico.entity.ts
│   ├── medicos.controller.ts
│   ├── medicos.service.ts
│   └── medicos.module.ts
└── citas/                          # Módulo Citas (Hijo)
    ├── dto/
    │   ├── create-cita.dto.ts
    │   └── update-cita.dto.ts
    ├── entities/
    │   └── cita.entity.ts
    ├── citas.controller.ts
    ├── citas.service.ts
    └── citas.module.ts
```
