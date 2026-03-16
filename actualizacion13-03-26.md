# TFG — Estado actual del proyecto

## Descripción

Este documento resume de forma clara el trabajo realizado hasta ahora en el proyecto, tanto en **backend** como en **frontend**, para que cualquier miembro del equipo pueda entender rápidamente qué partes están terminadas, cuáles están avanzadas y cómo está organizada la base actual del desarrollo.

El proyecto está dividido en dos partes principales:

- **Backend** en Symfony
- **Frontend** conectado al backend mediante `api.js`

El objetivo de todo lo realizado hasta ahora ha sido dejar una base **funcional, ordenada, coherente y reutilizable**, manteniendo además una estética común en la parte visual.

---

# Estado actual del proyecto

## 1. Módulo de carta

### Backend

Se ha dejado preparada la parte de la carta en Symfony con las entidades principales necesarias para su funcionamiento:

- `Categoria`
- `Ingrediente`
- `Alergeno`
- `Plato`

Se revisaron y ajustaron las relaciones entre entidades para que la carta funcionase de manera coherente tanto a nivel de datos como a nivel de consumo desde frontend.

### API preparada para:

- Listar categorías
- Listar platos
- Filtrar platos por categoría
- Ver el detalle de un plato
- Devolver ingredientes y alérgenos asociados a cada plato

---

### Frontend

La página **Carta** quedó preparada para trabajar con la API real.

Se implementó:

- conexión con `api.js`
- carga de categorías
- carga de platos
- filtro por categoría
- detalle del plato

Además, se adaptó la lectura de imágenes para soportar distintos nombres de propiedad que puedan venir desde backend, por ejemplo:

- `imagenUrl`
- `imagen_url`
- `foto_url`

Esto se hizo para evitar fallos si el backend devuelve la imagen con nombres distintos según cómo esté montada la respuesta.

---

## 2. Módulo de reservas

La parte de reservas quedó bastante avanzada y ya tiene una estructura funcional bien pensada.

### Frontend

El formulario quedó conectado al backend enviando los siguientes datos:

- `nombre`
- `email`
- `fecha`
- `hora`
- `numero de personas`
- `zona`
- `observaciones`

---

### Backend

Se revisó `ReservaController` y se adaptó a las entidades reales del proyecto, teniendo en cuenta que:

- `Reserva` usa `Usuario`
- `Mesa` usa `codigo`
- la fecha de la reserva se trabaja mediante `fechaHoraReserva`

### Lógica planteada

Se dejó preparada la lógica para poder:

- reutilizar un usuario si ya existe por email
- crear un usuario automáticamente si no existe
- buscar mesa según la capacidad
- respetar la zona seleccionada
- evitar conflictos aproximados de horario entre reservas

---

## 3. Login y registro

La parte de autenticación quedó bastante avanzada tanto en frontend como en backend.

### Frontend

Se trabajó sobre:

- `login.jsx`
- `registrarse.jsx`
- conexión con `api.js`
- guardado del usuario en `localStorage`
- redirección según el rol

---

### Backend

Se revisó `AuthController` y se dejó recomendada una lógica segura para los roles y el registro:

- el registro público debe crear siempre usuarios con rol `CLIENTE`
- nunca debe aceptarse el rol `ADMIN` desde frontend
- el login debe devolver solo los datos básicos necesarios para mantener la sesión

---

## 4. Cabecera y gestión de sesión

Se adaptó la cabecera para que refleje correctamente el estado real de autenticación.

### Comportamiento actual

#### Si no hay sesión iniciada:
- mostrar **Iniciar sesión**
- mostrar **Registrarse**

#### Si hay sesión iniciada:
- mostrar saludo al usuario
- mostrar opción de **Cerrar sesión**

#### Si el usuario es admin:
- mostrar acceso al **panel de administración**

Además, se sustituyó el uso de enlaces tradicionales por `Link` para mantener una navegación interna más limpia dentro del frontend.

---

## 5. Protección de rutas admin

Se dejó planteada la protección de rutas de administración mediante una lógica tipo `RutaProtegida`.

### Comportamiento esperado

- si no hay sesión → redirección a `/admin/login`
- si no es admin → redirección a `/`
- si es admin → acceso permitido

Esto deja preparada la base para separar correctamente la zona pública de la zona administrativa.

---

## 6. Fixtures de administradores

Se revisó la estructura de fixtures y se dejó planteado un fixture específico para administradores.

### Propuesta

Crear un archivo como:

- `UsuarioAdminFixtures.php`

para generar usuarios administradores iniciales, por ejemplo:

- Víctor
- Rubén

### Objetivo

Que estos usuarios:

- se creen como fixtures normales
- tengan la contraseña hasheada
- se persistan en base de datos
- tengan rol `ADMIN`

Esto facilita tener accesos ya listos para desarrollo y pruebas.

---

## 7. Módulo de contacto

La parte de contacto quedó cerrada a nivel funcional.

### Backend

Se creó el endpoint:

- `POST /api/contacto`

con validación de:

- `nombre`
- `email`
- `mensaje`
- `telefono` opcional

---

### Frontend

Se creó la página de contacto con:

- formulario funcional
- mensajes de éxito y error
- conexión con `api.js`

---

### Diseño

Se mantuvo la misma línea visual del proyecto reutilizando clases globales ya existentes, como por ejemplo:

- `container`
- `title`
- `text`
- `form-standard`
- `form-group`
- `form-full-width`
- `form-button`
- `banner-info`

Además, se añadió un pequeño CSS de apoyo para ajustar detalles sin romper la estética global del resto de páginas.

---

## 8. Estructura general del proyecto

Además de las funcionalidades principales, también se hicieron mejoras de organización para dejar una base más mantenible.

### Mejoras aplicadas

- uso de servicios en `api.js`
- separación más clara entre frontend y backend
- reutilización de estilos globales
- comentarios explicativos en archivos importantes
- mayor consistencia entre páginas

La idea no ha sido solo hacer que funcione, sino dejar una base limpia para poder seguir construyendo sin desorden.

---

# Resumen general

A día de ahora, el proyecto tiene una base bastante avanzada en estas partes:

- carta
- reservas
- login y registro
- gestión de sesión
- protección de rutas admin
- fixtures de administradores
- contacto
- organización general del código

No es solo una base inicial, sino una estructura ya bastante encaminada para continuar el desarrollo con claridad.

---

# Próximos pasos recomendados

Los siguientes pasos lógicos para continuar serían:

1. terminar de ajustar las conexiones finales entre frontend y backend
2. probar completamente el flujo de reservas con datos reales
3. cerrar del todo la autenticación y la protección del panel admin
4. crear y cargar los fixtures de administradores
5. revisar validaciones y mensajes de error en todos los formularios
6. pulir la parte visual final manteniendo una misma estética
7. empezar o continuar el desarrollo del panel de administración

---

# Nota final

Todo lo realizado hasta ahora se ha intentado dejar siguiendo la lógica real de las entidades y del funcionamiento del proyecto, evitando soluciones rápidas que luego compliquen el mantenimiento.

La idea ha sido construir una base clara, reutilizable y escalable para que el desarrollo posterior sea más sencillo.