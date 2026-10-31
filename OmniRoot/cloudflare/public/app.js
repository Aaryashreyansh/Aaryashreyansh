const messages = document.getElementById("messages");
const form = document.getElementById("form");
const promptBox = document.getElementById("prompt");
const send = document.getElementById("send");
function bubble(text, role, meta) {
  document.getElementById("welcome")?.remove();
  const el = document.createElement("div"); el.className = "bubble " + role;
  const heading = document.createElement("div"); heading.className = "meta"; heading.textContent = meta;
  const body = document.createElement("div"); body.textContent = text;
  el.append(heading, body); messages.append(el); messages.scrollTop = messages.scrollHeight; return body;
}
form.addEventListener("submit", async e => {
  e.preventDefault(); const message = promptBox.value.trim(); if (!message) return;
  bubble(message, "user", "YOU"); promptBox.value = ""; send.disabled = true;
  const answer = bubble("Thinking…", "assistant", "OMNIROOT · CLOUD AI");
  try {
    const r = await fetch("/api/chat", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message})});
    const data = await r.json(); if (!r.ok) throw new Error(data.error || "Request failed");
    answer.textContent = data.reply;
    answer.previousElementSibling.textContent = "OMNIROOT · " + data.provider + " · " + data.model;
  } catch(err) { answer.textContent = err.message; answer.classList.add("error"); }
  finally { send.disabled = false; promptBox.focus(); }
});
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click",()=>{promptBox.value=b.dataset.prompt;promptBox.focus()}));
document.getElementById("newChat").addEventListener("click",()=>{messages.innerHTML='<div id="welcome" class="welcome"><div class="spark">✳</div><p class="eyebrow">WELCOME TO OMNIROOT</p><h1>What are we<br><em>building today?</em></h1><p class="muted">Ask a question, explore an idea, or start building.</p></div>';});
fetch("/api/health").then(r=>r.json()).then(d=>{document.getElementById("status").textContent="Cloud AI endpoint ready";document.getElementById("dot").style.background="#79d9a5"}).catch(()=>{document.getElementById("status").textContent="Backend unavailable"});
