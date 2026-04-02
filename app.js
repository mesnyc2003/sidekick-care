const productModes = {
  senior: {
    title: "Older Adult Experience",
    subtitle: "Simple help with clear instructions, one step at a time."
  },
  caregiver: {
    title: "Caregiver Experience",
    subtitle: "Support someone else quickly with visibility into what has already been tried."
  },
  staff: {
    title: "Support Staff Experience",
    subtitle: "See cleaner intake, better issue context, and structured escalation notes."
  }
};

const issues = {
  wifi: {
    icon: "📶",
    label: "Wi‑Fi Connection",
    desc: "Troubleshoot internet connection problems calmly and clearly.",
    urgency: "Medium",
    impact: "The user may not be able to browse, email, or join calls.",
    estimatedTime: "2–4 minutes",
    steps: [
      {
        question: "Do you see the Wi‑Fi symbol on the screen?",
        helper: "Look near the bottom or top of the screen for the Wi‑Fi icon.",
        instructionsForNo: [
          "Open your device settings.",
          "Find Wi‑Fi and turn it on.",
          "Wait 10 seconds and check again."
        ],
        yesNext: 1
      },
      {
        question: "Did restarting the device fix the connection?",
        helper: "A restart often clears a simple connection problem.",
        instructionsForNo: [
          "Turn the device off completely.",
          "Wait 15 seconds.",
          "Turn it back on and try connecting again."
        ],
        yesResolved: true
      },
      {
        question: "Can you see your network name in the Wi‑Fi list?",
        helper: "Your network name is usually the same one you connect to at home or work.",
        instructionsForNo: [
          "Move closer to the router if possible.",
          "Wait 20 seconds, then refresh the Wi‑Fi list.",
          "If it still does not appear, support may need to help."
        ],
        yesNext: 3
      },
      {
        question: "Did entering the password connect successfully?",
        helper: "Please type the password slowly and watch for capital letters.",
        instructionsForNo: [
          "Re-enter the password carefully.",
          "Check for extra spaces or incorrect letters.",
          "If the password is unknown, ask your caregiver or support team."
        ],
        yesResolved: true
      }
    ]
  },
  printer: {
    icon: "🖨️",
    label: "Printer or Scanner",
    desc: "Handle simple printing, paper, and scan setup issues.",
    urgency: "Medium",
    impact: "The user may not be able to print forms, documents, or labels.",
    estimatedTime: "3–5 minutes",
    steps: [
      {
        question: "Is the printer powered on?",
        helper: "Look for a lit screen or power light on the printer.",
        instructionsForNo: [
          "Press the printer power button.",
          "Wait for the printer to finish starting up."
        ],
        yesNext: 1
      },
      {
        question: "Is there paper loaded correctly?",
        helper: "Open the paper tray and make sure the stack is neat and flat.",
        instructionsForNo: [
          "Add paper to the tray.",
          "Make sure it is not bent or jammed."
        ],
        yesNext: 2
      },
      {
        question: "Did restarting the printer help?",
        helper: "Turning it off and back on can clear many simple errors.",
        instructionsForNo: [
          "Turn the printer off.",
          "Wait 15 seconds.",
          "Turn it on again and retry printing or scanning."
        ],
        yesResolved: true
      },
      {
        question: "Do you still see an error on the printer or computer?",
        helper: "If yes, the exact error will help staff resolve it faster.",
        yesEscalate: true,
        noResolved: true
      }
    ]
  },
  login: {
    icon: "🔐",
    label: "Login Access",
    desc: "Support password, username, and sign-in troubleshooting.",
    urgency: "High",
    impact: "The user may be locked out of their account or device.",
    estimatedTime: "2–3 minutes",
    steps: [
      {
        question: "Are you sure the username is entered correctly?",
        helper: "Please check for missing letters or accidental spaces.",
        instructionsForNo: [
          "Delete the username and type it again slowly.",
          "Check for spaces before or after the username."
        ],
        yesNext: 1
      },
      {
        question: "Did checking Caps Lock help with the password?",
        helper: "Passwords often fail when capital letters are turned on by mistake.",
        instructionsForNo: [
          "Turn Caps Lock off.",
          "Type the password slowly and carefully."
        ],
        yesResolved: true
      },
      {
        question: "Do you see a “Forgot Password” or reset option?",
        helper: "If available, that is often the fastest next step.",
        yesNext: 3,
        noEscalate: true
      },
      {
        question: "Did the password reset work?",
        helper: "Try signing in again with the updated password.",
        yesResolved: true,
        noEscalate: true
      }
    ]
  },
  camera: {
    icon: "🎥",
    label: "Camera or Audio",
    desc: "Fix common video call, microphone, or speaker problems.",
    urgency: "Medium",
    impact: "The user may not be able to join appointments, meetings, or family calls.",
    estimatedTime: "3–4 minutes",
    steps: [
      {
        question: "Is another app already using the camera or microphone?",
        helper: "Close any extra video or calling apps before testing again.",
        instructionsForYes: [
          "Close the other app using the camera or microphone.",
          "Return to your meeting app and test again."
        ],
        noNext: 1
      },
      {
        question: "Did restarting the meeting app help?",
        helper: "Please close the app fully, then open it again.",
        instructionsForNo: [
          "Close the meeting app completely.",
          "Reopen it and test the camera and microphone again."
        ],
        yesResolved: true
      },
      {
        question: "Can you see the correct camera and microphone selected in settings?",
        helper: "Most apps have device settings where you can choose the right camera and microphone.",
        instructionsForNo: [
          "Open the meeting app settings.",
          "Choose the correct camera and microphone.",
          "Run the app test if there is one."
        ],
        yesNext: 3
      },
      {
        question: "Do you still need help after trying that?",
        helper: "Support may need to check permissions, hardware, or device settings.",
        yesEscalate: true,
        noResolved: true
      }
    ]
  }
};

const state = {
  mode: "senior",
  issueKey: null,
  stepIndex: 0,
  tried: [],
  currentInstructions: null,
  speechEnabled: false
};

const modeGrid = document.getElementById("modeGrid");
const issueList = document.getElementById("issueList");
const demoApp = document.getElementById("demoApp");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const modeTitle = document.getElementById("modeTitle");
const modeSubtitle = document.getElementById("modeSubtitle");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const restartDemoBtn = document.getElementById("restartDemoBtn");
const largeTextToggle = document.getElementById("largeTextToggle");
const contrastToggle = document.getElementById("contrastToggle");
const speechToggle = document.getElementById("speechToggle");

function speak(text) {
  if (!state.speechEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function renderIssues() {
  issueList.innerHTML = Object.entries(issues).map(([key, issue]) => `
    <button class="issue-btn ${state.issueKey === key ? "active" : ""}" onclick="selectIssue('${key}')">
      <span class="issue-title">${issue.icon} ${issue.label}</span>
      <span class="issue-desc">${issue.desc}</span>
    </button>
  `).join("");
}

function renderMode() {
  [...modeGrid.querySelectorAll(".mode-btn")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === state.mode);
  });
  modeTitle.textContent = productModes[state.mode].title;
  modeSubtitle.textContent = productModes[state.mode].subtitle;
}

function resetDemo() {
  state.issueKey = null;
  state.stepIndex = 0;
  state.tried = [];
  state.currentInstructions = null;
  renderIssues();
  renderWelcome();
}

function selectIssue(key) {
  state.issueKey = key;
  state.stepIndex = 0;
  state.tried = [];
  state.currentInstructions = null;
  renderIssues();
  renderQuestion();
}

function currentIssue() {
  return issues[state.issueKey];
}

function currentStep() {
  return currentIssue().steps[state.stepIndex];
}

function updateProgress(text, pct) {
  progressLabel.textContent = text;
  progressFill.style.width = `${pct}%`;
}

function renderWelcome() {
  updateProgress("Choose an issue to begin", 0);
  demoApp.innerHTML = `
    <section class="welcome-screen">
      <span class="eyebrow">Product demo</span>
      <h2>A premium accessibility support experience</h2>
      <p class="lead">
        Sidekick Care combines calm guidance, accessibility controls, and better support handoffs.
        This prototype shows how the experience could work for older adults, caregivers, and staff.
      </p>

      <div class="info-grid">
        <article class="highlight-card">
          <strong>What makes it premium</strong>
          <p class="lead">The product is designed like a real service platform: guided support, role-based views, accessibility controls, and structured escalation.</p>
        </article>
        <article class="highlight-card">
          <strong>Where it fits</strong>
          <p class="lead">Senior living communities, healthcare settings, concierge desks, family support environments, and enterprise help desks.</p>
        </article>
      </div>

      <div class="nav-row">
        <button class="primary-btn" onclick="quickStart('wifi')">Start demo with Wi‑Fi issue</button>
        <button class="ghost-btn" onclick="quickStart('printer')">Try printer issue</button>
      </div>
    </section>
  `;
}

function quickStart(key) {
  selectIssue(key);
}

function renderQuestion() {
  const issue = currentIssue();
  const step = currentStep();
  updateProgress(`${issue.label} • Step ${state.stepIndex + 1} of ${issue.steps.length}`, ((state.stepIndex + 1) / issue.steps.length) * 100);

  const roleNote = state.mode === "senior"
    ? "This view keeps instructions calm, simple, and one step at a time."
    : state.mode === "caregiver"
      ? "This view helps someone support another person and understand what has already been tried."
      : "This view highlights triage value and escalation context for the support team.";

  demoApp.innerHTML = `
    <section class="question-screen">
      <div class="question-meta">
        <span class="meta-chip">${issue.icon} ${issue.label}</span>
        <span class="meta-chip">Urgency: ${issue.urgency}</span>
        <span class="meta-chip">Estimated time: ${issue.estimatedTime}</span>
      </div>

      <h2>${step.question}</h2>
      <p class="lead">${step.helper}</p>

      <div class="info-grid">
        <article class="mode-card">
          <strong>Experience note</strong>
          <p class="lead">${roleNote}</p>
        </article>
        <article class="mode-card">
          <strong>Why this matters</strong>
          <p class="lead">${issue.impact}</p>
        </article>
      </div>

      <div class="answer-grid">
        <button class="answer-btn" onclick="handleAnswer('yes')">Yes</button>
        <button class="answer-btn" onclick="handleAnswer('no')">No</button>
        <button class="answer-btn secondary" onclick="handleAnswer('not_sure')">Not sure</button>
      </div>
    </section>
  `;

  speak(step.question);
}

function handleAnswer(answer) {
  const issue = currentIssue();
  const step = currentStep();
  state.tried.push(`${step.question} — Answer: ${answer === "not_sure" ? "Not sure" : answer === "yes" ? "Yes" : "No"}`);

  if (answer === "yes") {
    if (step.yesResolved) return renderResolved();
    if (step.yesEscalate) return renderSummary();
    if (step.instructionsForYes) {
      state.currentInstructions = step.instructionsForYes;
      return renderInstructions();
    }
    if (typeof step.yesNext === "number") {
      state.stepIndex = step.yesNext;
      return renderQuestion();
    }
  }

  if (answer === "no" || answer === "not_sure") {
    if (step.noResolved) return renderResolved();
    if (step.noEscalate) return renderSummary();
    if (step.instructionsForNo) {
      state.currentInstructions = step.instructionsForNo;
      return renderInstructions();
    }
    if (typeof step.noNext === "number") {
      state.stepIndex = step.noNext;
      return renderQuestion();
    }
  }

  renderSummary();
}

function renderInstructions() {
  const issue = currentIssue();
  updateProgress(`${issue.label} • Guided help`, Math.max(20, ((state.stepIndex + 1) / issue.steps.length) * 100));

  demoApp.innerHTML = `
    <section class="question-screen">
      <div class="question-meta">
        <span class="meta-chip">${issue.icon} ${issue.label}</span>
        <span class="meta-chip">Guided support step</span>
      </div>

      <h2>Try this next</h2>
      <div class="instruction-card">
        <ol>
          ${state.currentInstructions.map(step => `<li>${step}</li>`).join("")}
        </ol>
      </div>

      <div class="nav-row">
        <button class="primary-btn" onclick="completeInstruction(true)">That helped</button>
        <button class="ghost-btn" onclick="completeInstruction(false)">I still need help</button>
      </div>
    </section>
  `;

  speak("Try this next.");
}

function completeInstruction(worked) {
  state.tried.push(`Guided action shown: ${state.currentInstructions.join(" | ")}`);
  if (worked) return renderResolved();

  const issue = currentIssue();
  state.stepIndex = Math.min(state.stepIndex + 1, issue.steps.length - 1);
  renderQuestion();
}

function renderResolved() {
  const issue = currentIssue();
  updateProgress(`${issue.label} • Resolved`, 100);

  demoApp.innerHTML = `
    <section class="success-screen">
      <span class="eyebrow">Resolution path</span>
      <h2>The issue may be resolved</h2>
      <p class="lead">
        This is where the product reinforces confidence, closes the loop, and still offers an easy handoff if the issue returns.
      </p>

      <div class="summary-grid">
        <article>
          <strong>User impact</strong>
          <p class="lead">The person gets a calm confirmation instead of being left unsure about what to do next.</p>
        </article>
        <article>
          <strong>Support impact</strong>
          <p class="lead">Support teams avoid unnecessary tickets while still preserving a clear fallback path.</p>
        </article>
      </div>

      <div class="nav-row">
        <button class="primary-btn" onclick="renderSummary()">Create support summary anyway</button>
        <button class="ghost-btn" onclick="resetDemo()">Back to issue list</button>
      </div>
    </section>
  `;

  speak("The issue may be resolved.");
}

function buildSummaryText() {
  const issue = currentIssue();
  const modeName = productModes[state.mode].title;

  return `Sidekick Care — Support Summary

Experience Mode:
${modeName}

Issue Type:
${issue.label}

User Impact:
${issue.impact}

Urgency:
${issue.urgency}

What was already tried:
${state.tried.map((item, i) => `${i + 1}. ${item}`).join("\n") || "No steps were captured."}

Recommended Next Action:
Review the device or account directly, confirm the exact error if one appears, and continue support using the recorded steps above.

Why this summary matters:
It reduces repetitive intake and gives support staff cleaner context before they step in.`;
}

function renderSummary() {
  const issue = currentIssue();
  const summaryText = buildSummaryText();
  window.summaryText = summaryText;
  updateProgress(`${issue.label} • Structured handoff`, 100);

  demoApp.innerHTML = `
    <section class="summary-screen">
      <span class="eyebrow">Structured handoff</span>
      <h2>Support-ready escalation summary</h2>
      <p class="lead">
        Instead of a vague “it’s not working,” the product creates a cleaner support handoff that saves time for caregivers and IT.
      </p>

      <div class="summary-grid">
        <article>
          <strong>Issue</strong>
          <p class="lead">${issue.label}</p>
        </article>
        <article>
          <strong>Urgency</strong>
          <p class="lead">${issue.urgency}</p>
        </article>
        <article>
          <strong>Estimated self-service time</strong>
          <p class="lead">${issue.estimatedTime}</p>
        </article>
        <article>
          <strong>Mode used</strong>
          <p class="lead">${productModes[state.mode].title}</p>
        </article>
      </div>

      <div class="summary-card">
        <strong>Recorded actions</strong>
        <ul>
          ${state.tried.map(item => `<li>${item}</li>`).join("") || "<li>No steps recorded yet.</li>"}
        </ul>
      </div>

      <div class="summary-card">
        <strong>Copy-ready support note</strong>
        <div class="summary-note">${summaryText}</div>
      </div>

      <div class="nav-row">
        <button class="copy-btn" onclick="copySummary()">Copy support summary</button>
        <button class="ghost-btn" onclick="resetDemo()">Start another issue</button>
      </div>

      <p class="footer-note">
        In a production version, this summary could be sent directly to a help desk, concierge desk, or caregiver dashboard.
      </p>
    </section>
  `;

  speak("Support-ready escalation summary.");
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(window.summaryText || "");
    alert("Support summary copied.");
  } catch (err) {
    alert("Copy failed. Please try again.");
  }
}

modeGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".mode-btn");
  if (!button) return;
  state.mode = button.dataset.mode;
  renderMode();
  if (!state.issueKey) renderWelcome();
  else renderQuestion();
});

settingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
closeSettingsBtn.addEventListener("click", () => settingsModal.classList.add("hidden"));
settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) settingsModal.classList.add("hidden");
});

restartDemoBtn.addEventListener("click", resetDemo);

largeTextToggle.addEventListener("change", () => {
  document.body.style.setProperty("--font-scale", largeTextToggle.checked ? "1.14" : "1");
});

contrastToggle.addEventListener("change", () => {
  document.body.classList.toggle("high-contrast", contrastToggle.checked);
});

speechToggle.addEventListener("change", () => {
  state.speechEnabled = speechToggle.checked;
  if (!state.speechEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

window.selectIssue = selectIssue;
window.handleAnswer = handleAnswer;
window.completeInstruction = completeInstruction;
window.copySummary = copySummary;
window.quickStart = quickStart;

renderIssues();
renderMode();
renderWelcome();
