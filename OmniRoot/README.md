# OmniRoot AI Web

OmniRoot is a browser-based AI chat project for Android, Windows, and desktop browsers.

## Recommended: deploy directly from GitHub to Cloudflare

The `cloudflare/` folder contains a Cloudflare Worker that serves the responsive web UI and the AI API together. This deployment does not require Pydroid, Termux, or a personal computer to stay online.

Follow [CLOUDFLARE-DEPLOY.md](CLOUDFLARE-DEPLOY.md). After connecting the GitHub repository to Cloudflare Workers, pushes to the selected branch can deploy automatically.

The Cloudflare version uses the Workers AI binding and the `@cf/meta/llama-3.1-8b-instruct` model. Cloudflare account eligibility, model availability, quotas, and billing rules apply. This is not unlimited Claude access.

## Alternative: run locally on Windows

The `app/` folder contains an optional FastAPI + Ollama starter. See [START-WINDOWS.md](START-WINDOWS.md).

## Project contents

- `cloudflare/`: deployable web app and AI Worker for Cloudflare.
- `app/`: optional FastAPI web app for local development.
- `INTEGRATIONS.md`: open-source integration plan.
- `CLOUDFLARE-DEPLOY.md`: GitHub-to-Cloudflare deployment steps.

## Security

Do not commit API keys, cookies, or access tokens. Keep secrets in server-side deployment settings. A public URL can let other people use the AI endpoint under your account's usage limits, so review access and usage before sharing it.

## Status

The Cloudflare deployment files are committed, but the app is not live until you connect the repository in Cloudflare and complete the first deployment.