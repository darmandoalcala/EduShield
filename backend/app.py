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
    "robo": "🚨 Reporte clasificado como *robo*. Llama a seguridad universitaria y, si aplica, al 911.",
    "acoso": "🙏 Reporte clasificado como *acoso*. Contacta a la unidad de atención y seguridad.",
    "vandalismo": "🛠️ Reporte clasificado como *vandalismo*. Gracias por informar.",
    "otro": "📋 Reporte clasificado como *otro*. ¿Deseas agregar más detalles?"
}

class UserMessage(BaseModel):
    text: str

@app.post("/chat")
def chat(msg: UserMessage):
    category = predict_category(msg.text)
    reply = RESPONSES.get(category, RESPONSES["otro"])
    return {"category": category, "reply": reply}
