# OmniRoot: selected open-source building blocks

This guide records the projects selected for the OmniRoot web AI stack. These are integrations, not a way to obtain unlimited Claude API access.

## Recommended components

| Project | Role in OmniRoot | Repository |
|---|---|---|
| Ollama | Runs open-weight models on a computer/server you control and exposes a local API | https://github.com/ollama/ollama |
| Open WebUI | Ready-made, responsive web chat interface that can connect to local and cloud models | https://github.com/open-webui/open-webui |
| LiteLLM | Optional backend gateway for multiple authorized providers, routing, retries, budgets, and cost tracking | https://github.com/BerriAI/litellm |
| llama.cpp | Alternative lightweight inference runtime for GGUF models | https://github.com/ggml-org/llama.cpp |

## Suggested OmniRoot architecture

**Browser → OmniRoot backend → provider router → Ollama/local model or authorized cloud API**

- Start with Ollama + Open WebUI for the local-first prototype.
- Add LiteLLM only when multi-provider routing, budgets, and observability are needed.
- Keep Claude as an optional provider requiring the user's own authorized API key.
- When a provider returns a quota/rate-limit response, respect its retry guidance and offer a configured alternative. Never rotate identities, share accounts, or evade quotas.
- Clearly label which model/provider is answering. Ask before any paid request.

## Local-first quick start (Windows / Linux / macOS)

1. Install Ollama from https://ollama.com/download.
2. Start Ollama and download a model that fits the device's RAM/VRAM. Model availability and hardware requirements vary.
3. Run Open WebUI using its official quick-start instructions: https://docs.openwebui.com/.
4. Connect Open WebUI to the Ollama server and test a small prompt.
5. For a custom OmniRoot UI, call a backend endpoint. Do not expose Ollama or provider API keys directly to an untrusted public browser.

Official connection guide: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/

## Hosting reality check

- A local model can avoid per-token API charges, but it is not unlimited in a physical sense: hardware, memory, electricity, network, and concurrency are constraints.
- A public web app needs a server that remains online. Free hosting plans have resource and sleep limits; a static GitHub Pages site cannot itself run a private model or securely proxy secret API keys.
- Do not commit API keys, cookies, client secrets, or access tokens. Put secrets in backend/deployment secret settings.
- Free cloud-provider quotas can change. OmniRoot must show quota/provider errors honestly rather than promising unlimited free access.

## Implementation status

This file is a researched integration plan. It does not claim that the OmniRoot chat service is deployed or operational yet. The next implementation step is to build the backend proxy, frontend chat, provider settings, and deployment configuration.