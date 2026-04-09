"""
OMNIQ Leads Router — обработка заявок с сайта
Сохраняет заявку и отправляет email через Resend
"""
import os
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

router = APIRouter()

# ── Модели ────────────────────────────────────────────────────────────────────
class LeadRequest(BaseModel):
    name: str
    company: str
    position: str = ""
    phone: str
    email: str
    message: str = ""
    lead_type: str = "access"

class LeadResponse(BaseModel):
    success: bool
    message: str

# ── In-memory хранилище ───────────────────────────────────────────────────────
leads_store: list[dict] = []

# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("/", response_model=LeadResponse)
async def submit_lead(lead: LeadRequest):
    lead_data = {
        **lead.model_dump(),
        "id": len(leads_store) + 1,
        "created_at": datetime.utcnow().isoformat(),
        "status": "new",
    }
    leads_store.append(lead_data)
    print(f"[OMNIQ] New lead #{lead_data['id']}: {lead.name} / {lead.company} / {lead.email}")

    resend_api_key = os.getenv("RESEND_API_KEY", "")
    if resend_api_key:
        try:
            result = await send_email_notification(lead_data, resend_api_key)
            print(f"[OMNIQ] Email result: {result}")
        except Exception as e:
            print(f"[OMNIQ] Email error: {e}")

    return LeadResponse(
        success=True,
        message="Заявка принята. Мы свяжемся с вами в течение 24 часов."
    )

@router.get("/")
async def get_leads():
    return {"leads": leads_store, "total": len(leads_store)}

# ── Email через Resend ────────────────────────────────────────────────────────
async def send_email_notification(lead: dict, api_key: str) -> dict:
    lead_type_label = "DEMO REQUEST" if lead.get("lead_type") == "demo" else "ACCESS REQUEST"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0a0a0f, #1a1a2e); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #00d4ff; font-size: 20px; margin: 0;">
                OMNIQ — {lead_type_label}
            </h1>
            <p style="color: #888; font-size: 12px; margin: 8px 0 0;">
                Новая заявка получена {lead.get('created_at', '')}
            </p>
        </div>
        <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 140px;">Имя:</td>
                    <td style="padding: 8px 0; font-weight: bold;">{lead.get('name', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Компания:</td>
                    <td style="padding: 8px 0; font-weight: bold;">{lead.get('company', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Должность:</td>
                    <td style="padding: 8px 0;">{lead.get('position', '—')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Телефон:</td>
                    <td style="padding: 8px 0;">{lead.get('phone', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0;">{lead.get('email', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Сообщение:</td>
                    <td style="padding: 8px 0;">{lead.get('message', '—')}</td></tr>
            </table>
        </div>
    </div>
    """

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": "onboarding@resend.dev",
                "to": ["isfandiyorsharipov7@gmail.com"],
                "subject": f"[OMNIQ] {lead.get('company', '')} — {lead.get('name', '')}",
                "html": html_body,
            },
            timeout=10.0,
        )
        resp_data = response.json()
        print(f"[OMNIQ] Resend status: {response.status_code}, body: {resp_data}")
        return resp_data
