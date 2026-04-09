import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import httpx
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI(title="Restaurante Inteligente Orchestrator")

# --- CONFIGURACIÓN DE CORS ---
# Esto permite que tu frontend (React) se comunique con este script sin bloqueos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de Clientes
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SYMFONY_API_URL = os.getenv("SYMFONY_API_URL", "http://backend/api")

client = OpenAI(api_key=OPENAI_API_KEY)

# Esquema de datos para la petición desde React
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    user: Optional[dict] = None

# --- HERRAMIENTAS (TOOLS) PARA OPENAI ---
# Aquí le decimos a la IA qué funciones "sabe" ejecutar
tools = [
    {
        "type": "function",
        "function": {
            "name": "consultar_menu",
            "description": "Obtiene la lista de platos del restaurante. Puede filtrar por categoría.",
            "parameters": {
                "type": "object",
                "properties": {
                    "categoria": {
                        "type": "string", 
                        "enum": ["entrantes", "carnes", "pescados", "postres", "bebidas"],
                        "description": "La categoría de comida que busca el usuario."
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "crear_reserva",
            "description": "Registra una nueva reserva en el sistema. Debe tener todos los datos: nombre, email, fecha, hora y número de personas.",
            "parameters": {
                "type": "object",
                "properties": {
                    "nombre": {"type": "string", "description": "Nombre completo del cliente"},
                    "email": {"type": "string", "description": "Dirección de correo electrónico para contacto"},
                    "telefono": {"type": "string", "description": "Número de teléfono del cliente para aviso"},
                    "fecha": {"type": "string", "description": "Fecha en formato YYYY-MM-DD"},
                    "hora": {"type": "string", "description": "Hora en formato HH:MM"},
                    "numero_personas": {"type": "integer", "description": "Número de comensales"},
                    "zona": {
                        "type": "string", 
                        "description": "Zona preferida del restaurante",
                        "enum": ["SALA", "TERRAZA", "BARRA", "PRIVADO"]
                    }
                },
                "required": ["nombre", "email", "telefono", "fecha", "hora", "numero_personas"]
            }
        }
    }
]

# --- FUNCIONES DE COMUNICACIÓN CON SYMFONY ---

async def call_symfony_api(endpoint: str, method: str = "GET", data: dict = None):
    """Comunicación directa con el backend de Symfony dentro de la red Docker."""
    async with httpx.AsyncClient(timeout=30.0) as ac:
        url = f"{SYMFONY_API_URL}/{endpoint}"
        try:
            print(f"Llamando a Symfony: {method} {url} con data={data}")
            if method == "POST":
                response = await ac.post(url, json=data)
            else:
                response = await ac.get(url, params=data)
            
            print(f"Respuesta Symfony status: {response.status_code}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            err_msg = f"Error conectando con Symfony: {repr(e)}"
            print(err_msg)
            return {"error": err_msg}


# --- ENDPOINT PRINCIPAL ---

@app.post("/chat")
async def handle_chat(request: ChatRequest):
    # Obtener fecha y hora actual para el contexto
    ahora = datetime.now()
    fecha_hoy = ahora.strftime("%Y-%m-%d")
    dia_semana = ahora.strftime("%A") # Podrías traducirlo si quieres

    # Determinar estado de login y datos de usuario
    user_info = ""
    if request.user:
        nombre_user = request.user.get("nombre", "Usuario")
        email_user = request.user.get("email", "")
        tel_user = request.user.get("telefono", "")
        user_info = f"El usuario está LOGUEADO como '{nombre_user}' ({email_user}) Tel: {tel_user}. Puedes usar estos datos para reservas automáticamente sin preguntar. NUNCA pidas el nombre, email o teléfono si ya los tienes arriba."
    else:
        user_info = "El usuario NO está logueado. IMPORTANTE: Las reservas están PROHIBIDAS. Si el usuario intenta reservar, dile amablemente que debe iniciar sesión o registrarse primero."

    # 1. Mensaje del sistema con contexto real
    system_prompt = (
        "Eres el asistente virtual jefe de un restaurante moderno y vibrante. Tu ÚNICO propósito es promocionar el restaurante y gestionar reservas 🌟.\n"
        f"CONTEXTO TEMPORAL: Hoy es {dia_semana}, {fecha_hoy}. Hora actual: {ahora.strftime('%H:%M')}.\n"
        f"CONTEXTO DE USUARIO: {user_info}\n\n"
        "REGLAS DE CONDUCTA CRÍTICAS:\n"
        "- HORARIO: Martes a Domingos de 12:00 a 00:00. Lunes CERRADO 📌.\n"
        "- COCINA: Cierra a las 23:30. No permitas reservas después de esa hora 🍳.\n"
        "- DURACIÓN: Todas las reservas tienen una duración máxima de 90 minutos ⏱️.\n"
        "- ZONAS: Tenemos SALA y TERRAZA principalmente. También hay BARRA y PRIVADO si lo preguntan.\n"
        "- IMPORTANTE (ZONAS): Antes de confirmar cualquier reserva, PREGUNTA siempre qué zona prefieren (Sala o Terraza) 🏛️⛲. Si el usuario dice que le da igual, no envíes el parámetro 'zona'.\n"
        "- IMPORTANTE (MENÚ): Si el usuario pide ver la carta o el menú, NO enumeres los platos uno a uno. En su lugar, dale este enlace: [Ver nuestra Carta Digital](http://localhost:5173/carta) 📖✨ e invítale a echar un vistazo.\n"
        "- Solo usa la herramienta 'consultar_menu' si el usuario hace una pregunta muy específica (ej: '¿Tenéis platos para celíacos?' o '¿Qué postres hay?') 🕵️‍♂️.\n"
        "- No des consejos generales de vida (deporte, salud, viajes). Si el usuario saca temas ajenos, sé muy simpático pero redirige la conversación inmediatamente hacia el restaurante 🍽️.\n"
        "- Ejemplo: Si el usuario va a correr, dile que eso es genial y que le esperamos con una mesa lista para recuperar energías 🏃‍♂️💨 -> 🍔.\n"
        "- Sé proactivo: cada mensaje debe invitar a ver el menú o a reservar una mesa.\n"
        "- Usa emojis en cada frase para mantener la energía alta ✨.\n"
        "- NO uses Markdown complejo.\n\n"
        "REGLAS DE NEGOCIO:\n"
        "- Usa 'consultar_menu' para platos reales de la DB.\n"
        "- Usa 'crear_reserva' SOLO si el usuario está logueado.\n"
        "- Si el usuario está logueado, inyecta su nombre, email y teléfono automáticamente en la herramienta.\n"
        "- Pregunta SIEMPRE por la zona antes de usar 'crear_reserva'."
    )

    # Reconstruir historial para OpenAI
    # Si tenemos history, lo usamos; si no, creamos el inicio
    openai_messages = [{"role": "system", "content": system_prompt}]
    
    if request.history:
        # Mapeamos los roles del frontend ('bot' -> 'assistant')
        for msg in request.history:
            role = "assistant" if msg["role"] == "bot" else "user"
            openai_messages.append({"role": role, "content": msg["content"]})

    # SIEMPRE añadimos el último mensaje del usuario para que la IA lo procese
    openai_messages.append({"role": "user", "content": request.message})

    try:
        if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
            return {"reply": "❌ Configuración incompleta: Falta la OpenAI API Key en el servidor. Por favor, añádela al archivo .env."}

        # 2. Llamada inicial a OpenAI para detectar intención
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages,
            tools=tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # 3. Si la IA decide usar una función (ej. consultar menú)
        if tool_calls:
            openai_messages.append(response_message)
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Si es reserva y tenemos usuario, forzamos sus datos por si la IA no los puso
                if function_name == "crear_reserva" and request.user:
                    function_args["nombre"] = request.user.get("nombre", function_args.get("nombre"))
                    function_args["email"] = request.user.get("email", function_args.get("email"))
                    function_args["telefono"] = request.user.get("telefono", function_args.get("telefono"))

                # Lógica según la función detectada
                if function_name == "consultar_menu":
                    api_result = await call_symfony_api("platos", "GET", {})
                elif function_name == "crear_reserva":
                    # Solo ejecutamos si hay login (doble check de seguridad)
                    if request.user:
                        api_result = await call_symfony_api("reservas", "POST", function_args)
                    else:
                        api_result = {"error": "Debes iniciar sesión para reservar mesa."}
                else:
                    api_result = {"error": "Función no implementada"}

                # Añadimos el resultado de Symfony al historial para que la IA lo procese
                openai_messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": json.dumps(api_result)
                })

            # 4. Segunda llamada a OpenAI
            final_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=openai_messages
            )
            return {"reply": final_response.choices[0].message.content}

        # Si no hubo llamada a función, devolvemos la respuesta directa de la IA
        return {"reply": response_message.content}

    except Exception as e:
        error_str = str(e)
        if "insufficient_quota" in error_str:
            return {"reply": "⚠️ Lo siento, parece que el servicio de IA ha agotado su cuota mensual. Por favor, revisa tu cuenta de OpenAI 💳."}
        elif "invalid_api_key" in error_str:
            return {"reply": "🔑 La clave de API configurada no es válida. Por favor, verifícala en el archivo .env."}
        
        print(f"ERROR CHATBOT: {error_str}")
        raise HTTPException(status_code=500, detail=f"Error en el asistente: {error_str}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)