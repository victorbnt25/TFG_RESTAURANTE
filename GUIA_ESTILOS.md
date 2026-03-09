# 🎨 Guía de Estilos - Sons of Burger

Este documento contiene las clases de CSS genéricas que puedes reutilizar en todo el proyecto para mantener la coherencia visual.

## 📁 Archivos de Estilo Principales
1.  **`src/styles/theme.css`**: Variables globales (colores, fuentes) y estructura básica.
2.  **`src/styles/forms.css`**: Todo lo relacionado con formularios y entradas de datos.

---

## 📋 Variables de Color
Usa siempre estas variables en lugar de colores fijos:
*   `var(--color-primary)`: Dorado/Oro premium.
*   `var(--color-secondary)`: Negro oscuro del fondo.
*   `var(--text-primary)`: Blanco puro.
*   `var(--text-secondary)`: Gris suave.

---

## 📝 Formularios (`forms.css`)

### 1. Contenedor Principal
Añade esta clase a tu etiqueta `<form>`:
*   `.form-standard`: Crea el recuadro oscuro con bordes dorados, centrado y con grid de 2 columnas.

### 2. Campos de Entrada
Para cada conjunto de `label` + `input/select/textarea`, úsalos dentro de un `div`:
*   `.form-group`: Aplica el espaciado correcto y estilos al label y al input.

### 3. Layout de Columnas
Por defecto, los campos ocupan 1 columna (hay 2 en total). Si quieres que un campo ocupe todo el ancho (ej: observaciones o botones):
*   `.form-full-width`: Hace que el elemento ocupe las 2 columnas.

### 4. Botones
*   `.form-button`: Botón grande dorado con efectos de hover.

---

## 📢 Componentes de Información

### 1. Banner de Información
Ideal para avisos en la parte superior del formulario (ej: descuentos, enlaces a login):
*   `.banner-info`: Recuadro con borde discontinuo y texto alineado.

### 2. Callouts (Avisos Destacados)
Para advertencias o notas importantes (ej: reservas de grupos):
*   `.callout-info`: Recuadro con fondo sutil, icono y título destacado.

---

## 📐 Estructura y Texto (`theme.css`)

*   `.container`: Contenedor centrado con ancho máximo de 1200px.
*   `.grid`, `.grid-2`, `.grid-3`, `.grid-4`: Sistemas de rejilla rápidos.
*   `.title`: Título grande estándar.
*   `.text`: Párrafo de texto estándar.

---

## 🚀 Ejemplo de Uso (Registrarse.jsx)

```jsx
<form className="form-standard">
    <div className="form-group">
        <label>Nombre</label>
        <input type="text" />
    </div>
    
    <div className="form-group">
        <label>Email</label>
        <input type="email" />
    </div>

    <div className="form-full-width form-group">
        <label>Contraseña</label>
        <input type="password" />
    </div>

    <button className="form-button">CREAR CUENTA</button>
</form>
```
