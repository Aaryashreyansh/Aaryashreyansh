# Run OmniRoot on Windows

## 1. Install Python
Install Python 3.11 or newer and enable "Add Python to PATH".

## 2. Install Ollama
Install from https://ollama.com/download/windows. Open PowerShell and run:

```powershell
ollama pull llama3.2:3b
```

Keep Ollama running in the background.

## 3. Start OmniRoot
Open PowerShell in this folder:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000 in your browser.

## Android
For a first test, run the backend on a computer and open its LAN address from the phone while both devices are on the same trusted Wi-Fi. Do not expose the development server to the public internet. For an installable Android experience, use the PWA install option after deploying the app over HTTPS.

## Claude (optional)
Set ANTHROPIC_API_KEY in the server environment only. Never put it in frontend JavaScript or commit it to GitHub. Claude API usage may incur charges and is subject to Anthropic limits.
