# Deploy OmniRoot directly from GitHub to Cloudflare

This Cloudflare version serves the web UI and AI API from one Worker. No Pydroid, Termux, or personal computer is needed after deployment.

## Connect the repository

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages** and choose **Create application**.
3. Choose **Workers** and import/connect a GitHub repository.
4. Select `Aaryashreyansh/Aaryashreyansh`.
5. Set the project root / working directory to `OmniRoot/cloudflare`.
6. Cloudflare should detect `wrangler.jsonc`. Confirm the Worker name is `omniroot-ai`.
7. Save and deploy. Open the generated `workers.dev` URL.

Official guide: https://developers.cloudflare.com/workers/ci-cd/builds/

## Enable the AI binding

The included `wrangler.jsonc` declares the Workers AI binding named `AI`. If the dashboard asks you to enable or authorize Workers AI, enable it for this Worker and deploy again.

The app uses `@cf/meta/llama-3.1-8b-instruct`. Cloudflare account eligibility, model availability, usage quotas, and billing rules apply. This is not unlimited Claude access.

## Automatic updates

After Git integration is enabled, pushes to the configured production branch trigger a new build and deployment.

## Security and usage

- Do not place API keys in HTML, JavaScript, or public repository files.
- Workers AI is the default provider in this deployment.
- If account quotas are reached, the API returns an error. It does not bypass quotas.
- Publicly sharing the URL lets others use the AI endpoint under your Cloudflare account limits. Keep the URL private while testing and review usage controls before sharing widely.
- GitHub Pages is not used to run this backend; the Worker serves both static files and API requests.
