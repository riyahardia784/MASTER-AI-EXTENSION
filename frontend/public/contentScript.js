console.log("🧠 Study Assistant active on this page!");

// 🪄 Create generation dialog
function createDialog() {
  if (document.getElementById("study-dialog")) return;

  const dialog = document.createElement("div");
  dialog.id = "study-dialog";
  dialog.innerHTML = `
    <div style="
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      z-index: 999999;
      background: rgba(0,0,0,0.6);
    ">
      <div style="
        background: #fcfbf1; color: #323c4b; padding: 20px;
        border-radius: 16px; width: 340px; text-align: center;
        font-family: 'Open Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <h2 style="margin-bottom: 10px; color: #0694d1;">MASTER</h2>
        <select id="mode" style="
          width: 100%; padding: 8px; border: 2px solid #0694d1;
          border-radius: 10px; background: transparent;
          color: #0694d1; font-weight: 600; font-size: 14px;
        ">
          <option>Summary</option>
          <option>Notes</option>
          <option>Flashcards</option>
          <option>Quiz</option>
          <option>Visualization</option>
        </select>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel" style="
            background: gray; color: white; padding: 6px 12px;
            border-radius: 20px; font-weight: 600; cursor: pointer;
          ">Cancel</button>
          <button id="generate" style="
            background: linear-gradient(90deg,#5de0e6,#004aad);
            color: white; padding: 6px 14px; border-radius: 20px;
            font-weight: 600; cursor: pointer;
          ">Generate</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById("cancel").onclick = () => dialog.remove();

  document.getElementById("generate").onclick = async () => {
    const mode = document.getElementById("mode").value;
    const selectedText = window.getSelection().toString().trim();
    const text = selectedText || document.body.innerText.slice(0, 5000);
    dialog.remove();

    const BASE_URL = "http://localhost:4000";
    const endpoint = mode === "Visualization" ? "/visualize/generate" : "/learn/generate";

    // 🌈 Show loading strip
    showLoadingStrip("Generating " + mode + "...");

    try {
      console.log("📤 Sending request:", `${BASE_URL}${endpoint}`, { text, type: mode });
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: mode }),
      });

      const data = await res.json();
      console.log("📦 Backend Response:", data);

      const output =
        data.visualization || data.content || data.result || "⚠️ No content generated.";

      // 🎯 Render output
      if (mode === "Visualization") {
        showMindMap(output);
        saveVisualizationToStorage(text, output);
      } else {
        showOutputPanel(mode, output);
        saveOutputToStorage(mode, output);
      }
    } catch (err) {
      console.error("❌ Generation Error:", err);
      showOutputPanel("Error", "❌ Failed to generate output. Check backend or API key.");
    } finally {
      // ✅ Hide loading bar with fade
      hideLoadingStrip();
    }
  };
}

// 🎨 Regular output panel (summary, notes, etc.)
function showOutputPanel(type, content) {
  const existing = document.getElementById("study-output-panel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "study-output-panel";
  panel.style.cssText = `
    position: fixed;
    bottom: 20px; right: 20px;
    width: 400px; max-height: 75vh;
    background: #fcfbf1; color: #323c4b;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: 'Open Sans', sans-serif;
    display: flex; flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    font-size: 18px;
  `;

  panel.innerHTML = `
    <div style="
      background: linear-gradient(90deg,#5de0e6,#004aad);
      color: white; padding: 12px 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 600;
    ">
      <span>${type} Result</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button id="copy-output" style="background:none;border:none;color:white;cursor:pointer;">📋 Copy</button>
        <button id="close-output" style="background:none;border:none;color:white;cursor:pointer;">✖</button>
      </div>
    </div>
    <div id="output-content" style="padding: 20px; overflow-y: auto;">
      ${formatMarkdown(content)}
    </div>
  `;

  panel.querySelector("#close-output").onclick = () => panel.remove();
  panel.querySelector("#copy-output").onclick = () => {
    navigator.clipboard.writeText(content)
      .then(() => showCopyToast("✅ Copied to clipboard!"))
      .catch(err => console.error("❌ Copy failed:", err));
  };

  document.body.appendChild(panel);
}

// 🧠 Mind Map Visualization Renderer
function showMindMap(content) {
  const existing = document.getElementById("study-output-panel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "study-output-panel";
  panel.style.cssText = `
    position: fixed;
    bottom: 20px; right: 20px;
    width: 700px; max-height: 75vh;
    background: #fcfbf1; color: #323c4b;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: 'Courier New', monospace;
    display: flex; flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  `;

  panel.innerHTML = `
    <div style="
      background: linear-gradient(90deg,#5de0e6,#004aad);
      color: white; padding: 12px 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 600; font-size: 18px;
    ">
      <span>Visualization Result</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button id="copy-output" style="background:none;border:none;color:white;cursor:pointer;">📋 Copy</button>
        <button id="close-output" style="background:none;border:none;color:white;cursor:pointer;">✖</button>
      </div>
    </div>

    <pre id="viz-content" style="padding: 20px; overflow-y: auto; overflow-x: auto; background: #fcfbf1; z-index: 999999; color: #323c4b;">${content}</pre>
  `;

  panel.querySelector("#close-output").onclick = () => panel.remove();
  panel.querySelector("#copy-output").onclick = () => {
    navigator.clipboard.writeText(content)
      .then(() => showCopyToast("✅ Visualization copied!"))
      .catch(err => console.error("❌ Copy failed:", err));
  };

  document.body.appendChild(panel);
}

// ✨ Markdown formatter
function formatMarkdown(text) {
  if (!text) return "<p>No content generated.</p>";
  if (/[│├└→]/.test(text)) {
    return `<pre>${text}</pre>`;
  }

  let html = text
    .replace(/^### (.*$)/gim, "<h3 style='color:#0694d1;'>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2 style='color:#0694d1;'>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1 style='color:#0694d1;'>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong style='color:#0694d1;'>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/\n/g, "<br>");

  if (html.includes("<li>")) {
    html = html.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");
  }

  return html;
}

// 💾 Save learning outputs (summary, notes, etc.)
function saveOutputToStorage(type, content) {
  const savedData = { type, content, url: window.location.href, time: new Date().toLocaleString() };

  chrome.storage.local.get({ savedOutputs: [] }, (res) => {
    const updated = [savedData, ...res.savedOutputs];
    chrome.storage.local.set({ savedOutputs: updated }, () => {
      console.log("✅ Saved output:", savedData);
      chrome.runtime.sendMessage({ action: "outputSaved", data: savedData });
    });
  });
}

// 💾 Save visualization (special key)
function saveVisualizationToStorage(text, visualization) {
  const newItem = {
    text,
    visualization,
    url: window.location.href,
    time: new Date().toLocaleString(),
  };

  chrome.storage.local.get({ savedVisualizations: [] }, (res) => {
    const updated = [newItem, ...res.savedVisualizations];
    chrome.storage.local.set({ savedVisualizations: updated }, () => {
      console.log("✅ Saved visualization to chrome.storage:", newItem);
      chrome.runtime.sendMessage({
        action: "NEW_VISUALIZATION",
        payload: newItem,
      });
    });
  });
}

// 🌈 Loading strip
function showLoadingStrip(message = "Generating...") {
  if (document.getElementById("loading-strip")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "loading-strip";
  wrapper.innerHTML = `
    <div class="loading-bar"></div>
    <div class="loading-message">${message}</div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #loading-strip {
      position: fixed;
      bottom: 0; left: 0; width: 100%;
      z-index: 9999999;
      pointer-events: none;
    }
    #loading-strip .loading-bar {
      height: 15px;
      background: linear-gradient(90deg, #5de0e6, #004aad);
      animation: loadingMove 1s infinite linear;
    }
    #loading-strip .loading-message {
      position: fixed;
      bottom: 10px; right: 20px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      opacity: 0.9;
    }
    @keyframes loadingMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .fade-out {
      opacity: 0;
      transition: opacity 0.4s ease-out;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(wrapper);
}

function hideLoadingStrip() {
  const strip = document.getElementById("loading-strip");
  if (strip) {
    strip.classList.add("fade-out");
    setTimeout(() => strip.remove(), 400);
  }
}

// 🌟 Floating toast message (for copy confirmation)
function showCopyToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px; right: 30px;
    background: #323c4b;
    color: #fff;
    padding: 10px 16px;
    border-radius: 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    z-index: 9999999;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  `;
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

// ⌨️ Shortcut (Ctrl + M)
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "m") createDialog();
});  