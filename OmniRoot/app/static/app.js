const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const form = document.getElementById("composer");
const message = document.getElementById("message");
const provider = document.getElementById("provider");
const model = document.getElementById("model");
const send = document.getElementById("send");
const statusText = document.getElementById("status");

function addBubble(text, role, meta = "") {
  if (welcome) welcome.remove();
  const box = document.createElement("div");
  box.className = "bubble " + role;
  if (meta) {
    const label = document.createElement("div");
    label.className = "meta";
    label.textContent = meta;
    box.appendChild(label);
  }
  const body = document.createElement("div");
  body.textContent = text;
  box.appendChild(body);
  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;
  return box;
}

async function checkHealth() {
  try {
    const r = await fetch("/api/health");
    const data = await r.json();
    statusText.textContent = data.ollama_available ? "Ollama connected" : "Ollama not detected";
    statusText.previousElementSibling.style.background = data.ollama_available ? "#78d6a1" : "#d5a34d";
  } catch {
    statusText.textContent = "Backend unavailable";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = message.value.trim();
  if (!prompt) return;
  addBubble(prompt, "user", "YOU");
  message.value = "";
  send.disabled = true;
  send.textContent = "…";
  const pending = addBubble("Thinking…", "assistant", "OMNIROOT");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: prompt, provider: provider.value, model: model.value.trim() || null})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Request failed");
    pending.querySelector("div:last-child").textContent = data.reply || "(No text response)";
    pending.querySelector(".meta").textContent = "OMNIROOT · " + data.provider.toUpperCase() + " · " + data.model;
  } catch (error) {
    pending.querySelector("div:last-child").textContent = error.message;
    pending.classList.add("error");
  } finally {
    send.disabled = false;
    send.textContent = "↑";
    message.focus();
  }
});

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    message.value = button.dataset.prompt;
    message.focus();
  });
});

document.getElementById("newChat").addEventListener("click", () => {
  chat.innerHTML = '<div class="welcome" id="welcome"><div class="orb">✳</div><p class="eyebrow">WELCOME TO OMNIROOT</p><h1>What are we<br><em>building today?</em></h1><p class="intro">One workspace. Multiple AI providers. Your choice of model.</p></div>';
});
checkHealth();
