# OmniRoot AI Web

OmniRoot is a local-first, cross-platform AI chat starter for Windows, Android browsers/PWA, and the web.

## What's included

- Responsive dark chat interface.
- FastAPI backend with a single `/api/chat` endpoint.
- Ollama local-model integration.
- Optional Claude API integration using a server-side key.
- Health status endpoint and PWA manifest.
- Windows setup guide and environment-variable example.

## Run on Windows

See [START-WINDOWS.md](START-WINDOWS.md).

Quick start:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
ollama pull llama3.2:3b
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000.

## Providers and limits

- Ollama runs a model on hardware you control. There is no per-token cloud API bill, but performance and capacity depend on your device, memory, electricity, and network.
- Claude is optional and requires authorized API access. Its usage is subject to Anthropic's quotas, rate limits, and charges.
- This starter does not bypass provider limits or promise unlimited cloud AI. It currently lets the user choose Ollama or Claude; automatic multi-provider fallback is a future enhancement.
- Do not silently switch to a paid provider. Ask the user first.

## Security

Keep `ANTHROPIC_API_KEY` on the backend only. Never put secrets in browser code or commit real credentials. Use HTTPS and an appropriately secured deployment before exposing the app publicly.

## Project status

The first runnable starter has been added to the repository. It has not yet been deployed or tested in your environment.