const chatFeed = document.getElementById("chatFeed");
const actionDrawer = document.getElementById("actionDrawer");
const helperCard = document.getElementById("helperCard");
const starterStrip = document.getElementById("starterStrip");
const homeBanner = document.getElementById("homeBanner");
const fileInput = document.getElementById("fileInput");
const attachmentTray = document.getElementById("attachmentTray");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const largeTypeBtn = document.getElementById("largeTypeBtn");
const softToneBtn = document.getElementById("softToneBtn");
const speakBtn = document.getElementById("speakBtn");
const timeText = document.getElementById("timeText");
const dateText = document.getElementById("dateText");

const state = {
  messages: [],
  attachments: [],
  currentFlow: null,
  currentStepIndex: null,
  tried: [],
  helperRequested: false,
  largeType: false,
  softTone: false,
  speak: false,
  currentVisual: null,
  summaryVisible: false
};

const flows = {
  video_call: {
    label: "Cannot hear someone on a video call",
    detect: ["hear", "video", "grandson", "zoom", "facetime", "call", "meeting", "audio"],
    start: "We can work on the sound together. I’ll keep it simple and only give you one thing at a time.",
    steps: [
      {
        title: "Which device are you using?",
        text: {
          normal: "Please tell me if you are using a tablet, a laptop, or a phone for the call.",
          soft: "Tell me which device you’re using so I can explain the next step the right way."
        },
        choices: [
          { label: "Tablet", desc: "Touch screen device", result: "device: tablet" },
          { label: "Laptop", desc: "Keyboard and screen", result: "device: laptop" },
          { label: "Phone", desc: "Mobile phone", result: "device: phone" }
        ]
      },
      {
        title: "Raise the sound first",
        text: {
          normal: "Let’s make sure the sound is turned up. Please press the volume up button a few times.",
          soft: "First, let’s make the sound louder."
        },
        visual: "volume",
        choices: [
          { label: "I did that", desc: "The volume is higher now", result: "next" },
          { label: "Still no sound", desc: "It did not fix it", result: "next" }
        ]
      },
      {
        title: "Check the call controls",
        text: {
          normal: "Now tap the screen once so the call buttons appear. Do you see a muted speaker or mute button?",
          soft: "Touch the screen once. Do you see a mute button?"
        },
        visual: "controls",
        choices: [
          { label: "Yes, I see it", desc: "The call buttons are showing", result: "mute_check" },
          { label: "No, I don’t", desc: "I can’t find the buttons", result: "show_visual" },
          { label: "I’m confused", desc: "Say it another way", result: "simplify" }
        ]
      },
      {
        key: "mute_check",
        title: "Turn sound back on",
        text: {
          normal: "Please tap that mute button once to turn the sound back on. Then ask the other person to say hello again.",
          soft: "Tap the mute button once. Then ask them to speak again."
        },
        choices: [
          { label: "I can hear them now", desc: "That fixed it", result: "resolved" },
          { label: "Still no sound", desc: "We need one more step", result: "next" }
        ]
      },
      {
        title: "Choose the right speaker",
        text: {
          normal: "Let’s check where the sound is coming from. Open the call settings and choose this device’s speaker.",
          soft: "Open the call settings and choose speaker."
        },
        visual: "output",
        choices: [
          { label: "I changed it", desc: "The speaker setting is updated", result: "retest" },
          { label: "I can’t find that", desc: "I need help with this setting", result: "helper" },
          { label: "Show me where", desc: "Visual help", result: "show_visual" }
        ]
      },
      {
        key: "retest",
        title: "Try the call again",
        text: {
          normal: "Please ask them to speak again. Can you hear them now?",
          soft: "Ask them to speak again. Can you hear them now?"
        },
        choices: [
          { label: "Yes, it works", desc: "The sound is back", result: "resolved" },
          { label: "No, not yet", desc: "Send this to a helper", result: "helper" }
        ]
      }
    ]
  },
  internet: {
    label: "Internet stopped working",
    detect: ["internet", "wifi", "wi-fi", "network", "offline", "router", "no connection"],
    start: "I can help with that. Let’s check the easiest things first.",
    steps: [
      {
        title: "Is this happening on one device or everything?",
        text: {
          normal: "Please tell me whether the internet problem is on only this device or on everything in the room.",
          soft: "Is it just this device, or is everything offline?"
        },
        choices: [
          { label: "Only this device", desc: "The problem seems local", result: "next" },
          { label: "Everything is offline", desc: "The whole room is affected", result: "helper" }
        ]
      },
      {
        title: "Restart the device",
        text: {
          normal: "Please restart the device and wait a moment before trying the internet again.",
          soft: "Please restart the device."
        },
        choices: [
          { label: "That fixed it", desc: "The internet is back", result: "resolved" },
          { label: "Still not working", desc: "Keep troubleshooting", result: "next" }
        ]
      },
      {
        title: "Reconnect to Wi-Fi",
        text: {
          normal: "Open the Wi-Fi list, choose your network again, and enter the password carefully.",
          soft: "Please reconnect to your Wi-Fi."
        },
        choices: [
          { label: "I’m back online", desc: "Resolved", result: "resolved" },
          { label: "I need more help", desc: "Send this along", result: "helper" }
        ]
      }
    ]
  },
  printer: {
    label: "Printer will not print",
    detect: ["printer", "print", "scanner", "scan", "paper jam"],
    start: "We can work through that together.",
    steps: [
      {
        title: "Check the printer itself",
        text: {
          normal: "Please make sure the printer is turned on and has paper loaded correctly.",
          soft: "Make sure the printer is on and has paper."
        },
        choices: [
          { label: "That was the issue", desc: "It is working now", result: "resolved" },
          { label: "Still not printing", desc: "Keep going", result: "next" }
        ]
      },
      {
        title: "Restart the printer",
        text: {
          normal: "Turn the printer off, wait 15 seconds, then turn it back on and try again.",
          soft: "Restart the printer and try again."
        },
        choices: [
          { label: "It works now", desc: "Resolved", result: "resolved" },
          { label: "Still not working", desc: "Send to helper", result: "helper" }
        ]
      }
    ]
  },
  tv: {
    label: "TV is not working",
    detect: ["tv", "television", "remote", "cable", "show", "screen", "channel"],
    start: "I can help you check that.",
    steps: [
      {
        title: "Let’s start with power",
        text: {
          normal: "Please make sure the TV is on and the remote has fresh batteries or is responding.",
          soft: "Make sure the TV is on and the remote is working."
        },
        choices: [
          { label: "That fixed it", desc: "The TV is working", result: "resolved" },
          { label: "Still not working", desc: "Go to the next check", result: "next" }
        ]
      },
      {
        title: "Check the input",
        text: {
          normal: "Press the Input or Source button on the remote and choose the correct source.",
          soft: "Use the Input button and choose the right source."
        },
        choices: [
          { label: "Now it works", desc: "Resolved", result: "resolved" },
          { label: "Still blank", desc: "Need a helper", result: "helper" }
        ]
      }
    ]
  },
  email: {
    label: "Email will not open",
    detect: ["email", "mail", "inbox", "outlook", "gmail", "message"],
    start: "Let’s check the easiest path first.",
    steps: [
      {
        title: "Restart the app or browser",
        text: {
          normal: "Please close the email app or browser tab completely, then open it again.",
          soft: "Close email and open it again."
        },
        choices: [
          { label: "That worked", desc: "Email is open", result: "resolved" },
          { label: "Still stuck", desc: "Go to the next step", result: "next" }
        ]
      },
      {
        title: "Try signing in again",
        text: {
          normal: "If you see a sign-in screen, enter your email and password carefully. Watch for capital letters.",
          soft: "Try signing in again carefully."
        },
        choices: [
          { label: "I’m back in", desc: "Resolved", result: "resolved" },
          { label: "I still need help", desc: "Send a note", result: "helper" }
        ]
      }
    ]
  }
};

const visuals = {
  volume: {
    title: "Where to turn the sound up",
    normal: "Use the physical volume buttons on the side of the device, or the louder-volume key on a laptop keyboard.",
    soft: "Use the volume button or louder key."
  },
  controls: {
    title: "Where the call buttons usually appear",
    normal: "Tap the call screen once, or move the mouse over it. A row of call controls should appear near the bottom.",
    soft: "Touch the screen once so the call buttons show up."
  },
  output: {
    title: "Where to choose the speaker",
    normal: "Look for a small menu, dots, or settings icon inside the call window. Choose speaker or this device.",
    soft: "Open call settings and choose speaker."
  }
};

function updateClock() {
  const now = new Date();
  timeText.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  dateText.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
updateClock();
setInterval(updateClock, 60000);

function autoGrow() {
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 140) + "px";
}
messageInput.addEventListener("input", autoGrow);

largeTypeBtn.addEventListener("click", () => {
  state.largeType = !state.largeType;
  document.body.classList.toggle("large-type", state.largeType);
  largeTypeBtn.setAttribute("aria-pressed", String(state.largeType));
});

softToneBtn.addEventListener("click", () => {
  state.softTone = !state.softTone;
  softToneBtn.setAttribute("aria-pressed", String(state.softTone));
  rerenderDrawer();
});

speakBtn.addEventListener("click", () => {
  state.speak = !state.speak;
  speakBtn.setAttribute("aria-pressed", String(state.speak));
  if (!state.speak && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

function say(text) {
  if (!state.speak || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

function addMessage(role, text) {
  state.messages.push({ role, text });
  renderMessages();
  if (role === "assistant") say(text);
}

function renderMessages() {
  chatFeed.innerHTML = state.messages.map(msg => `
    <article class="message ${msg.role}">
      <span class="message-role">${msg.role === "assistant" ? "Hearth" : msg.role === "user" ? "You" : "System"}</span>
      <div class="message-text">${msg.text}</div>
    </article>
  `).join("");
  chatFeed.scrollTop = chatFeed.scrollHeight;
  renderHelper();
}

function renderAttachments() {
  attachmentTray.innerHTML = state.attachments.map((file, idx) => `
    <div class="attachment-chip">
      <strong>📎</strong>
      <span>${file.name}</span>
      <button class="secondary-btn" style="padding:6px 10px" onclick="removeAttachment(${idx})">Remove</button>
    </div>
  `).join("");
  renderHelper();
}

function removeAttachment(idx) {
  state.attachments.splice(idx, 1);
  renderAttachments();
}
window.removeAttachment = removeAttachment;

fileInput.addEventListener("change", () => {
  const newFiles = Array.from(fileInput.files || []);
  if (!newFiles.length) return;
  newFiles.forEach(file => {
    state.attachments.push({ name: file.name, type: file.type || "file" });
  });
  renderAttachments();
  addMessage("system", `Attached ${newFiles.length > 1 ? "files" : "file"} for context.`);
  fileInput.value = "";
});

function clearStarter() {
  homeBanner.style.display = "none";
  starterStrip.style.display = "none";
}

document.querySelectorAll(".starter-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const scenario = btn.dataset.scenario;
    startFlow(scenario);
  });
});

function detectFlow(text = "", attachments = []) {
  const haystack = `${text} ${attachments.map(f => f.name).join(" ")}`.toLowerCase();
  for (const [key, flow] of Object.entries(flows)) {
    if (flow.detect.some(word => haystack.includes(word))) return key;
  }
  return null;
}

function startFlow(flowKey) {
  clearStarter();
  state.currentFlow = flowKey;
  state.currentStepIndex = 0;
  state.helperRequested = false;
  state.currentVisual = null;
  state.summaryVisible = false;
  const flow = flows[flowKey];
  if (!state.messages.length) {
    addMessage("assistant", `Hello. I’m Hearth.`);
  }
  addMessage("assistant", flow.start);
  addMessage("assistant", getCurrentStepText());
  state.tried.push(`Started guided flow: ${flow.label}`);
  renderDrawer();
}

function getCurrentFlow() {
  return state.currentFlow ? flows[state.currentFlow] : null;
}

function getCurrentStep() {
  const flow = getCurrentFlow();
  if (!flow || state.currentStepIndex === null) return null;
  return flow.steps[state.currentStepIndex];
}

function getCurrentStepText(step = getCurrentStep()) {
  if (!step) return "";
  return state.softTone ? step.text.soft : step.text.normal;
}

function renderDrawer() {
  const step = getCurrentStep();
  if (!step) {
    actionDrawer.innerHTML = state.summaryVisible ? renderSummaryCard() : renderGeneralActions();
    return;
  }

  const choicesHtml = step.choices.map((choice, idx) => `
    <button class="quick-btn" onclick="handleChoice(${idx})">
      <strong>${choice.label}</strong>
      <span>${choice.desc}</span>
    </button>
  `).join("");

  actionDrawer.innerHTML = `
    <section class="drawer-card">
      <p class="eyebrow">Current step</p>
      <h3>${step.title}</h3>
      <p class="muted">${getCurrentStepText(step)}</p>

      <div class="choice-grid">
        ${choicesHtml}
      </div>

      <div class="utility-row">
        <button class="secondary-btn" onclick="explainAnotherWay()">Explain it another way</button>
        ${step.visual ? `<button class="secondary-btn" onclick="showVisual('${step.visual}')">Show me where</button>` : ""}
        <button class="secondary-btn" onclick="sendToHelper()">Send this to a helper</button>
      </div>
    </section>
    ${state.currentVisual ? renderVisualCard(state.currentVisual) : ""}
  `;
}

function rerenderDrawer() {
  renderDrawer();
}

window.handleChoice = function(idx) {
  const step = getCurrentStep();
  const choice = step.choices[idx];
  addMessage("user", choice.label);
  state.currentVisual = null;
  handleResult(choice.result);
};

function handleResult(result) {
  const flow = getCurrentFlow();
  const step = getCurrentStep();
  if (!flow || !step) return;

  if (result.startsWith("device:")) {
    const value = result.split(":")[1].trim();
    state.tried.push(`Device selected: ${value}`);
    state.currentStepIndex += 1;
    addMessage("assistant", getCurrentStepText());
    renderDrawer();
    return;
  }

  if (result === "next") {
    state.tried.push(`Completed step: ${step.title}`);
    state.currentStepIndex += 1;
    if (state.currentStepIndex >= flow.steps.length) {
      resolveIssue("Issue likely improved after guided steps.");
      return;
    }
    addMessage("assistant", getCurrentStepText());
    renderDrawer();
    return;
  }

  if (result === "show_visual") {
    showVisual(step.visual || "controls");
    return;
  }

  if (result === "simplify") {
    explainAnotherWay();
    return;
  }

  if (result === "mute_check") {
    const targetIndex = flow.steps.findIndex(s => s.key === "mute_check");
    if (targetIndex !== -1) {
      state.currentStepIndex = targetIndex;
      state.tried.push(`Reached targeted step: ${flow.steps[targetIndex].title}`);
      addMessage("assistant", getCurrentStepText());
      renderDrawer();
    }
    return;
  }

  if (result === "retest") {
    const targetIndex = flow.steps.findIndex(s => s.key === "retest");
    if (targetIndex !== -1) {
      state.currentStepIndex = targetIndex;
      state.tried.push(`Reached targeted step: ${flow.steps[targetIndex].title}`);
      addMessage("assistant", getCurrentStepText());
      renderDrawer();
    }
    return;
  }

  if (result === "resolved") {
    state.tried.push(`Resolved during step: ${step.title}`);
    resolveIssue(`Resolved through guided flow: ${flow.label}`);
    return;
  }

  if (result === "helper") {
    state.tried.push(`Helper requested during step: ${step.title}`);
    sendToHelper();
  }
}

function explainAnotherWay() {
  const step = getCurrentStep();
  if (step) {
    addMessage("assistant", step.text.soft);
  } else {
    addMessage("assistant", "I can say it more simply. Tell me what the device is doing right now, and I’ll break it into one small step.");
  }
}
window.explainAnotherWay = explainAnotherWay;

function renderVisualCard(key) {
  const visual = visuals[key];
  const device = inferDevice();
  const body = state.softTone ? visual.soft : visual.normal;

  return `
    <section class="visual-card">
      <p class="eyebrow">Visual help</p>
      <h3>${visual.title}</h3>
      <div class="visual-layout">
        <div class="mini-device ${device}">
          <div class="mini-frame"></div>
          <div class="mini-screen"></div>
          <div class="mini-camera"></div>
          <div class="hotspot ${key}"></div>
        </div>
        <div>
          <p class="muted">${body}</p>
          <div class="utility-row">
            <button class="secondary-btn" onclick="closeVisual()">Close this guide</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function inferDevice() {
  const match = state.tried.find(item => item.toLowerCase().includes("device selected"));
  if (!match) return "tablet";
  if (match.includes("laptop")) return "laptop";
  return "tablet";
}

function showVisual(key) {
  state.currentVisual = key;
  const visual = visuals[key];
  addMessage("assistant", state.softTone ? visual.soft : visual.normal);
  renderDrawer();
}
window.showVisual = showVisual;

function closeVisual() {
  state.currentVisual = null;
  renderDrawer();
}
window.closeVisual = closeVisual;

function resolveIssue(summary) {
  state.currentFlow = null;
  state.currentStepIndex = null;
  state.summaryVisible = true;
  addMessage("assistant", "Good news. It looks like the issue may be fixed.");
  state.tried.push(summary);
  renderDrawer();
}

function sendToHelper() {
  state.helperRequested = true;
  state.currentFlow = null;
  state.currentStepIndex = null;
  state.summaryVisible = true;
  addMessage("assistant", "I’ve prepared a note so a helper can step in with context instead of starting from zero.");
  renderDrawer();
}
window.sendToHelper = sendToHelper;

function renderSummaryCard() {
  return `
    <section class="summary-card">
      <p class="eyebrow">Prepared helper note</p>
      <h3>${state.helperRequested ? "Handoff ready" : "Resolution summary"}</h3>
      <div class="summary-note">${buildHelperNote()}</div>
      <div class="utility-row">
        <button class="copy-btn" onclick="copySummary()">Copy note</button>
        <button class="secondary-btn" onclick="resetToHome()">Start another issue</button>
      </div>
    </section>
  `;
}

function buildHelperNote() {
  const issue = getIssueLabel();
  const attachments = state.attachments.length ? state.attachments.map(f => `- ${f.name}`).join("\\n") : "None";
  const tried = state.tried.length ? state.tried.map((item, i) => `${i + 1}. ${item}`).join("\\n") : "1. No troubleshooting steps recorded yet.";
  return `Hearth support note

Issue:
${issue}

Status:
${state.helperRequested ? "Needs follow-up from a helper" : "Appears resolved"}

Attachments:
${attachments}

What Hearth already tried:
${tried}

Last user message:
${getLastUserMessage()}

Recommended next action:
${state.helperRequested ? "Review the device or app in person and continue from the recorded steps above." : "Keep this note for reference in case the issue returns."}`;
}

function getIssueLabel() {
  if (state.currentFlow && flows[state.currentFlow]) return flows[state.currentFlow].label;
  const detected = detectFlow(getLastUserMessage(), state.attachments);
  return detected ? flows[detected].label : "General tech support issue";
}

function getLastUserMessage() {
  const last = [...state.messages].reverse().find(m => m.role === "user");
  return last ? last.text : "No user message captured.";
}

window.copySummary = async function() {
  try {
    await navigator.clipboard.writeText(buildHelperNote());
    alert("Support note copied.");
  } catch (err) {
    alert("Copy failed. Please try again.");
  }
};

function renderGeneralActions() {
  return `
    <section class="drawer-card">
      <p class="eyebrow">What Hearth can do</p>
      <h3>Tell me what happened, or start with something common.</h3>
      <div class="quick-row">
        <button class="quick-btn" onclick="startFlow('video_call')">
          <strong>Video call help</strong>
          <span>Sound, camera, and call settings</span>
        </button>
        <button class="quick-btn" onclick="startFlow('internet')">
          <strong>Internet help</strong>
          <span>Connection and Wi-Fi problems</span>
        </button>
        <button class="quick-btn" onclick="showUploadNudge()">
          <strong>Photo or screenshot</strong>
          <span>Attach what you are seeing</span>
        </button>
      </div>
    </section>
  `;
}
window.startFlow = startFlow;

function showUploadNudge() {
  addMessage("assistant", "Please upload a photo or screenshot and tell me what looks wrong. In the full version, Hearth would inspect the image directly and respond in simple language.");
}
window.showUploadNudge = showUploadNudge;

function resetToHome() {
  state.messages = [];
  state.attachments = [];
  state.currentFlow = null;
  state.currentStepIndex = null;
  state.tried = [];
  state.helperRequested = false;
  state.currentVisual = null;
  state.summaryVisible = false;
  homeBanner.style.display = "block";
  starterStrip.style.display = "flex";
  renderMessages();
  renderAttachments();
  renderDrawer();
}
window.resetToHome = resetToHome;

function fallbackAssistantResponse(userText) {
  const lower = userText.toLowerCase();
  if (state.attachments.length) {
    state.tried.push(`Attachment provided: ${state.attachments.map(f => f.name).join(", ")}`);
  }

  if (lower.includes("error") || lower.includes("code")) {
    return "I can help with that. Please tell me the exact error message you see, or upload a screenshot. I’ll keep the steps simple and prepare a note in case someone needs to step in.";
  }

  if (lower.includes("slow")) {
    return "That sounds frustrating. Let’s start with one simple thing: please restart the device fully. After it turns back on, tell me whether it still feels slow.";
  }

  if (lower.includes("password") || lower.includes("login") || lower.includes("sign in")) {
    return "We can take this slowly. Please check whether Caps Lock is on, then type the password again carefully. If that does not work, I can help you move to the next step.";
  }

  return "I can help with that. Tell me what device you are using and what changed right before the problem started. If you want, you can also upload a photo or screenshot so the helper note is more complete.";
}

function handleFreeform(text) {
  clearStarter();
  addMessage("user", text);

  const matched = detectFlow(text, state.attachments);
  if (matched) {
    state.tried.push(`Freeform request matched to flow: ${flows[matched].label}`);
    startFlow(matched);
    return;
  }

  state.summaryVisible = false;
  const reply = fallbackAssistantResponse(text);
  state.tried.push(`Handled as natural-language request: ${text}`);
  addMessage("assistant", reply);
  renderDrawer();
}

sendBtn.addEventListener("click", submitMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitMessage();
  }
});

function submitMessage() {
  const text = messageInput.value.trim();
  if (!text && !state.attachments.length) return;

  if (text) {
    handleFreeform(text);
  } else {
    clearStarter();
    addMessage("assistant", "I see your attachment. Please tell me in a sentence what is going wrong, and I’ll guide you from there.");
  }

  messageInput.value = "";
  autoGrow();
}

function renderHelper() {
  const issue = getIssueLabel();
  const attachments = state.attachments.length
    ? `<ul class="helper-list">${state.attachments.map(file => `<li>${file.name}</li>`).join("")}</ul>`
    : `<div class="muted">No uploads yet.</div>`;

  const steps = state.tried.length
    ? `<ul class="helper-list">${state.tried.slice(-6).map(item => `<li>${item}</li>`).join("")}</ul>`
    : `<div class="muted">Nothing has been tried yet.</div>`;

  helperCard.innerHTML = `
    <p class="eyebrow">Live helper view</p>
    <h2>What a caregiver or front desk helper would see</h2>
    <p class="muted">This is what makes Hearth more than a nice chat experience. It keeps context alive while support is happening.</p>

    <div class="helper-stats">
      <div class="helper-box">
        <strong>Current issue</strong>
        <div class="muted">${issue}</div>
      </div>

      <div class="helper-box">
        <strong>Uploads</strong>
        ${attachments}
      </div>

      <div class="helper-box">
        <strong>What has already been tried</strong>
        ${steps}
      </div>

      <div class="helper-box">
        <strong>Current status</strong>
        <div class="muted">${state.helperRequested ? "Waiting for helper follow-up" : state.summaryVisible ? "Conversation summarized" : "Guided support in progress"}</div>
      </div>
    </div>
  `;
}

renderMessages();
renderAttachments();
renderDrawer();
renderHelper();
autoGrow();
