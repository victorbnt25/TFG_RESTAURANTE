# TFG – Aplicación Web de Restaurante 🍽️

Proyecto de **Trabajo de Fin de Grado (TFG)** desarrollado en equipo.

El objetivo es crear una **aplicación web completa para la gestión de un restaurante**, con arquitectura moderna y desacoplada, utilizando **Docker**, **Symfony**, **React**, **MySQL** y **n8n**.

---

## 🧱 Arquitectura del proyecto

El proyecto está dividido en varios servicios independientes:

- **Backend**: Symfony + PHP 8.2 + Apache (Docker)
- **Base de datos**: MySQL 8 (Docker)
- **Frontend**: React + Vite (local)
- **Chatbot / Automatización**: n8n (Docker)
- **Control de versiones**: GitHub

Cada servicio se comunica mediante **HTTP / API REST**, siguiendo una arquitectura desacoplada.

---

## 📁 Estructura del proyecto

```text
TFG/
├─ docker-compose.yml
├─ backend/              # Symfony (Docker)
│  ├─ Dockerfile
│  ├─ apache/
│  │  └─ 000-default.conf
│  ├─ public/
│  ├─ src/
│  ├─ composer.json
│  └─ .env
├─ frontend/             # React (Vite, local)
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```

---

## ⚙️ Requisitos previos

Antes de arrancar el proyecto es necesario tener instalado:

- **Docker Desktop** (con WSL2 activo en Windows)
- **Node.js (LTS)**
- **Git**

Comprobación rápida:

```bash
node -v
npm -v
docker --version
git --version
```

---

## 🚀 Arranque completo del proyecto (ordenador recién encendido)

### 1️⃣ Arrancar Docker Desktop

Esperar a que Docker Desktop esté en estado **Running**.

---

### 2️⃣ Arrancar Backend + MySQL + n8n

Desde la raíz del proyecto:

```bash
cd C:\TFG
docker compose up -d
```

Servicios disponibles:

- Symfony → http://localhost:8000
- MySQL → puerto 3306
- n8n → http://localhost:5678



---

### 3️⃣ Arrancar Frontend (React)

En una **segunda terminal**:

```bash
cd C:\TFG\frontend
npm run dev
```

Frontend disponible en:

- React → http://localhost:5173

---

## 🧠 Nota importante sobre Symfony

> **Symfony NO se levanta con `symfony server:start`.**

En este proyecto, Symfony se ejecuta automáticamente cuando **Apache (en Docker)** sirve el archivo:

```
backend/public/index.php
```

El único comando necesario es:

```bash
docker compose up -d
```

---

## 🛢️ Base de datos y Doctrine

La conexión a MySQL se configura en el archivo:

```
backend/.env
```

Ejemplo:

```env
DATABASE_URL="mysql://tfg:tfg@tfg_mysql:3306/tfg_restaurante?serverVersion=8.0"
```

Validación de la conexión:

```bash
docker exec -it tfg_backend bash
php bin/console doctrine:schema:validate
```

---

## 🤖 Chatbot con n8n

n8n se utiliza como **motor de chatbot y automatización**, actuando como intermediario entre el frontend y la API de Symfony.

Ejemplo de flujo:

1. Usuario escribe en el frontend
2. React envía el mensaje a n8n
3. n8n interpreta la intención
4. n8n realiza peticiones HTTP a Symfony (`/api/...`)
5. Symfony responde
6. n8n devuelve la respuesta al usuario

---

## 🔁 Flujo de trabajo con GitHub (obligatorio)

El proyecto es colaborativo. **Todo cambio se sube a GitHub**.

### Subir cambios:

```bash
git status
git add .
git commit -m "Mensaje descriptivo"
git push
```

### Actualizar cambios (otro miembro del equipo):

```bash
git pull
docker compose up -d
```

---

## ❌ Archivos que NO se suben a GitHub

- `node_modules/`
- `vendor/`
- `.env.local`
- Archivos con credenciales reales

Esto se controla mediante `.gitignore`.

---

## 🧪 Comprobación rápida de que todo funciona

- http://localhost:8000 → Symfony
- http://localhost:5173 → React
- http://localhost:5678 → n8n

Y:

```bash
docker ps
```

Debe mostrar:
- `tfg_backend`
- `tfg_mysql`
- `tfg_n8n`

---

## 📌 Tecnologías utilizadas

- Docker / Docker Compose
- Symfony 7 + Doctrine ORM
- PHP 8.2
- MySQL 8
- React + Vite
- n8n
- GitHub

---

## 👥 Autores

- Víctor
- Rubén

---

## 📄 Nota final

Este proyecto sigue buenas prácticas de desarrollo web moderno, separación de responsabilidades y arquitectura desacoplada, siendo totalmente reproducible en cualquier entorno que cumpla los requisitos indicados.

