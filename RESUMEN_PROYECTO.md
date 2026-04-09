# 🍽️ Proyecto: TFG – Gestión Integral de Restaurante

Este proyecto es una solución moderna y escalable para la gestión digital de un restaurante. Se basa en una arquitectura desacoplada donde el **backend (API)** y el **frontend (Interfaz)** funcionan de forma independiente, comunicándose mediante estándares web actuales.

---

## 1. Resumen Técnico (Stack Tecnológico)

El proyecto utiliza tecnologías de vanguardia para asegurar rendimiento, modularidad y facilidad de despliegue:

-   **Arquitectura Desacoplada**: Implementa un patrón **API-First**, separando por completo la lógica de negocio de la interfaz de usuario.
-   **Backend (Cerebro)**:
    -   **Symfony 7 & PHP 8.2**: Un framework robusto y maduro que gestiona toda la seguridad, lógica y persistencia.
    -   **Doctrine ORM**: Para la gestión de la base de datos de forma orientada a objetos.
    -   **API REST**: Servicio que expone los datos (platos, reservas, pedidos) al frontend.
-   **Frontend (Cara al usuario)**:
    -   **React + Vite**: Biblioteca de JavaScript para interfaces rápidas y reactivas.
    -   **Vanilla CSS**: Diseño premium personalizado sin depender de frameworks pesados, enfocado en una estética moderna (glassmorphism, gradientes, animaciones suaves).
-   **Automatización y Chatbot**:
    -   **n8n**: Plataforma de automatización de flujos de trabajo que actúa como motor para el chatbot interactivo, conectando al usuario con la API de Symfony.
-   **Infraestructura y DevOps**:
    -   **Docker & Docker Compose**: Todo el entorno (PHP, Apache, MySQL, n8n) está contenedorizado, garantizando que el proyecto funcione igual en cualquier equipo.
    -   **MySQL 8**: Base de datos relacional para el almacenamiento seguro de información.

---

## 2. Resumen Funcional (¿Qué hace la Web?)

La aplicación ofrece una experiencia completa tanto para el cliente final como para la administración del restaurante:

### 👤 Experiencia del Cliente
-   **Carta Digital Interactiva**: Navegación fluida por los platos divididos en categorías (Entrantes, Carnes, Postres, etc.).
-   **Personalización de Platos**: Los usuarios pueden ver alérgenos e ingredientes, e incluso **añadir o quitar extras** de un plato antes de pedirlo.
-   **Gestión de Carrito**: Un resumen de compra dinámico que permite ajustar cantidades en tiempo real.
-   **Sistema de Reservas**: Formulario inteligente para reservar mesas, con un panel personal de "**Mis Reservas**" para que el usuario gestione sus visitas.
-   **Chatbot Inteligente**: Un asistente virtual (vía n8n) que ayuda al usuario con dudas comunes u operaciones rápidas.
-   **Diseño Premium**: Interfaz adaptable (responsive) con micro-animaciones, modo oscuro/estilizado y transiciones suaves que mejoran la experiencia de usuario (UX).

### ⚙️ Gestión Administrativa (Panel Admin)
-   **Control de la Carta**: Posibilidad de crear, editar o eliminar platos, categorías, ingredientes y alérgenos.
-   **Gestión de Contenidos**: Control dinámico de páginas como la **Política de Privacidad** o información de contacto.
-   **Gestión de Pedidos y Reservas**: Centralización de toda la operativa del restaurante para una gestión eficiente.

---

## 📂 Estructura de Datos (Entidades Clave)

Para que todo esto funcione, el sistema gestiona los siguientes datos principales:
-   **Plato, Categoría, Ingrediente, Alérgeno**: El núcleo de la carta.
-   **Pedido & LíneaPedido**: Registro de las compras realizadas.
-   **Reserva & Mesa**: El motor de la gestión de sala.
-   **Usuario & Pago**: Seguridad y transacciones financieras.

---

## 🚀 Conclusión
Este proyecto sigue las mejores prácticas de desarrollo web moderno, asegurando una separación clara de responsabilidades y facilitando su escalabilidad y mantenimiento futuro.
