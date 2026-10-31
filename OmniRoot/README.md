# OmniRoot AI Web

OmniRoot is a provider-switching AI chat starter. It uses legitimate provider access and a user-controlled local model where available.

## No artificial unlimited Claude access

Claude API has usage tiers, rate limits, and spend limits. OmniRoot will not bypass those controls, share accounts, rotate identities, or conceal usage. If Claude is unavailable or its quota is reached, the app can switch only to another provider with valid credentials and remaining quota.

## Practical ways to keep chat available

1. Local model: run an open model on a computer you control with Ollama and connect the web app to your own backend. Usage is limited by your hardware, electricity, and network.
2. Free provider tiers: configure providers that offer a free tier, following their terms and quotas. Free tiers can change and are not guaranteed to be unlimited.
3. Provider fallback: switch to another configured provider after a temporary outage or quota response. Respect Retry-After and do not repeatedly retry a provider that rejected requests.
4. Usage controls: set request/token caps, show the active provider, and ask before using any paid provider.

## Recommended architecture

- Browser UI: chat, model selector, provider status, and conversation history.
- Backend: one /api/chat endpoint. Keep provider credentials on the server, never in browser JavaScript or a public repository.
- Provider adapters: Claude, other providers with authorized API access, and a local Ollama endpoint.
- Fallback router: use only configured providers and honor their terms, quotas, and retry guidance.
- Deployment: static frontend plus a serverless/backend service. GitHub Pages alone cannot safely store API secrets or run a private API proxy.

## Environment variables

Store these as deployment secrets, not in source control:
- ANTHROPIC_API_KEY (optional; authorized Claude API access)
- OPENAI_API_KEY (optional; only with an authorized account)
- OLLAMA_BASE_URL (optional; your own Ollama server URL, reachable from the backend)
- DEFAULT_PROVIDER (for example: ollama)

Never commit real API keys, client secrets, cookies, or access tokens. If a key is exposed, revoke it and create a new one.

## Suggested routing policy

1. Use the provider explicitly selected by the user.
2. If it returns a temporary rate-limit or availability response, respect its Retry-After value.
3. Offer a configured fallback provider and clearly show that the provider/model changed.
4. Never silently switch to a paid provider. Require explicit consent before any billable request.
5. If no configured provider is available, show a clear message instead of attempting quota evasion.

## Current status

This folder documents the safe architecture and operating model. It is not yet a deployed, functioning chat service. A backend, frontend, and deployment configuration are still required.