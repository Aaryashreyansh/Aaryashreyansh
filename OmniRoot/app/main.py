import os
from pathlib import Path
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")

app = FastAPI(title="OmniRoot AI", version="0.1.0")
app.mount("/static", StaticFiles(directory=ROOT / "static"), name="static")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)
    provider: Literal["ollama", "claude"] = "ollama"
    model: str | None = None


@app.get("/")
async def home():
    return FileResponse(ROOT / "static" / "index.html")


@app.get("/api/health")
async def health():
    ollama_ok = False
    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            response = await client.get(f"{OLLAMA_URL}/api/tags")
            ollama_ok = response.is_success
    except httpx.HTTPError:
        pass
    return {
        "status": "ok",
        "ollama_available": ollama_ok,
        "claude_configured": bool(ANTHROPIC_API_KEY),
    }


@app.post("/api/chat")
async def chat(body: ChatRequest):
    if body.provider == "ollama":
        model = body.model or os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        try:
            async with httpx.AsyncClient(timeout=180) as client:
                response = await client.post(
                    f"{OLLAMA_URL}/api/chat",
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": body.message}],
                        "stream": False,
                    },
                )
            response.raise_for_status()
            data = response.json()
            return {"provider": "ollama", "model": model,
                    "reply": data.get("message", {}).get("content", "")}
        except httpx.ConnectError:
            raise HTTPException(503, "Ollama is not reachable. Start Ollama and try again.")
        except httpx.HTTPStatusError as exc:
            detail = exc.response.text[:500]
            raise HTTPException(exc.response.status_code, f"Ollama error: {detail}")
        except httpx.HTTPError:
            raise HTTPException(502, "Could not contact the local Ollama service.")

    if not ANTHROPIC_API_KEY:
        raise HTTPException(503, "Claude is not configured. Add ANTHROPIC_API_KEY on the server.")
    model = body.model or ANTHROPIC_MODEL
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": model,
                    "max_tokens": 1200,
                    "messages": [{"role": "user", "content": body.message}],
                },
            )
        if response.status_code == 429:
            raise HTTPException(429, "Claude rate limit reached. Wait or select your local Ollama model.")
        response.raise_for_status()
        data = response.json()
        reply = "".join(part.get("text", "") for part in data.get("content", []) if part.get("type") == "text")
        return {"provider": "claude", "model": model, "reply": reply}
    except HTTPException:
        raise
    except httpx.HTTPStatusError as exc:
        raise HTTPException(exc.response.status_code, "Claude API request failed.")
    except httpx.HTTPError:
        raise HTTPException(502, "Could not contact Claude API.")
