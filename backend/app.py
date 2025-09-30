from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model_service import predict_category

app = FastAPI()

# Permitir acceso desde tu app RN
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RESPONSES = {
    "robo": {
        "text": "🚨 Reporte clasificado como *robo*. ¿Quieres registrar los detalles?",
        "next": "registrar_robo",
        "action": None
    },
    "acoso": {
        "text": "🙏 Reporte clasificado como *acoso*. ¿Deseas que te muestre los teléfonos de apoyo?",
        "next": "contactos_acoso",
        "action": None
    },
    "vandalismo": {
        "text": "🛠️ Reporte clasificado como *vandalismo*. ¿Quieres adjuntar evidencia?",
        "next": "evidencia_vandalismo",
        "action": None
    },
    "otro": {
        "text": "📋 Reporte clasificado como *otro*. ¿Deseas que te dirija al área de control escolar?",
        "next": "redirigir_escolar",
        "action":None
    }
}

user_states = {}  # { user_id: {"pending_action": str | None} }

class UserMessage(BaseModel):
    user_id: str
    text: str


# Función principal de chatbot
def get_bot_response(user_id: str, user_input: str):
    state = user_states.get(user_id, {"pending_action": None})

    # Caso 1: el usuario tiene acción pendiente
    if state["pending_action"]:
        action = state["pending_action"]
        # No limpies aquí, ya limpias dentro de handle_next_action
        return handle_next_action(user_id, action, user_input)

    # Caso 2: flujo normal → clasificar con el modelo
    category = predict_category(user_input)
    response = RESPONSES.get(category, {"text": "❓ No entendí tu reporte.", "next": None})

    # Guardar acción pendiente (si existe)
    user_states[user_id] = {"pending_action": response.get("next")}
    return {
        "text": response["text"],
        "action": response.get("action")
    }


## Lógica para manejar el "sí / no / detalles" del usuario
def handle_next_action(user_id: str, action: str, user_input: str):
    if action == "registrar_robo":
        if user_input.lower() in ["no", "nop", "n"]:
            user_states[user_id] = {"pending_action": None}
            return {
                "text": "✅ Entendido, no registraré nada más.",
                "action": None
            }
        # si dice algo distinto de no → guardar y redirigir
        user_states[user_id] = {"pending_action": None}
        return {
            "text": f"📝 Gracias, registraré este detalle: '{user_input}'",
            "action": "Report"
        }

    elif action == "contactos_acoso":
        if user_input.lower() in ["si", "sí", "yes", "y"]:
            user_states[user_id] = {"pending_action": None}
            return {
                "text": "📞 Apóyate de los contactos CUCEI",
                "action": "Contacts"
            }
        user_states[user_id] = {"pending_action": None}
        return {
            "text": "✅ Entendido, no mostraré contactos ahora.",
            "action": None
        }

    elif action == "evidencia_vandalismo":
        if user_input.lower() in ["si", "sí", "yes", "y"]:
            user_states[user_id] = {"pending_action": None}
            return {
                "text": "📷 Por favor adjunta una foto o describe lo ocurrido.",
                "action": "Report"
            }
        user_states[user_id] = {"pending_action": None}
        return {
            "text": "✅ Entendido, se notificará el acto de vandalismo sin evidencia adicional.",
            "action": None
        }

    elif action == "redirigir_escolar":
        if user_input.lower() in ["si", "sí", "yes", "y"]:
            user_states[user_id] = {"pending_action": None}
            return {
                "text": "🏛️ Redirigiendo a contactos CUCEI",
                "action": "Contacts"
            }
        user_states[user_id] = {"pending_action": None}
        return {
            "text": "✅ Ok, quedo atento a tus dudas.",
            "action": None
        }

    else:
        user_states[user_id] = {"pending_action": None}
        return {
            "text": "⚠️ Acción no definida.",
            "action": None
        }



@app.post("/chat")
def chat(msg: UserMessage):
    category = predict_category(msg.text)
    reply = get_bot_response(msg.user_id, msg.text)

    return {
        "reply": reply["text"],     # 👈 mensaje del bot
        "category": category,       # 👈 la categoría detectada
        "action": reply.get("action")  # 👈 la screen a redirigir
    }