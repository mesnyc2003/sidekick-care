const scenarios = {
  video: {
    title: "I can’t hear my grandson on a video call",
    shortTitle: "Video call audio",
    audience: "A person is trying to join or continue a family video call.",
    nextActionDefault: "Willow will start with the simplest audio check first.",
    steps: [
      {
        assistant: {
          complex: "I can help with that. We’ll check one easy thing first so this feels less frustrating.",
          simple: "That’s okay. Let’s check one small thing first."
        },
        prompt: {
          complex: "Do you see a speaker or volume symbol on the screen right now?",
          simple: "Do you see the volume symbol?"
        },
        options: [
          {
            label: "Yes, I see it",
            record: "User sees the volume symbol on screen.",
            userReply: "Yes, I see it.",
            response: {
              complex: "Great. Please tap it once and make sure the sound is turned up, not muted.",
              simple: "Good. Tap it once and make sure the sound is up."
            },
            nextAction: "Have the user raise volume and check mute.",
            followUp: "Did that help you hear the call?"
          },
          {
            label: "No, I don’t see it",
            record: "User does not see the volume symbol.",
            userReply: "No, I don’t see it.",
            response: {
              complex: "No problem. We can still try a simple fix. Please press the volume-up button on the side of your device a few times.",
              simple: "That’s okay. Press the volume-up button a few times."
            },
            nextAction: "Use the hardware volume button as a fallback.",
            followUp: "Did pressing the volume-up button help?"
          },
          {
            label: "I’m not sure",
            record: "User is not sure whether they can find the volume symbol.",
            userReply: "I’m not sure.",
            response: {
              complex: "That’s completely fine. Look for a small speaker shape, usually near the bottom or side of the screen.",
              simple: "That’s okay. Look for a little speaker shape on the screen."
            },
            nextAction: "Explain the icon visually in simpler language.",
            followUp: "Do you see it now?"
          }
        ]
      },
      {
        assistant: {
          complex: "Let’s try one more quick check.",
          simple: "Let’s try one more thing."
        },
        prompt: {
          complex: "When you tap the screen, do you see a microphone icon with a line through it?",
          simple: "Do you see a microphone with a line on it?"
        },
        options: [
          {
            label: "Yes",
            record: "Possible mute setting is visible during the call.",
            userReply: "Yes.",
            response: {
              complex: "Please tap that icon once. A line through it can mean the sound or microphone settings need attention.",
              simple: "Tap that icon once."
            },
            nextAction: "Unmute or refresh the call controls.",
            followUp: "Did that fix the call?"
          },
          {
            label: "No",
            record: "No mute icon is visible.",
            userReply: "No.",
            response: {
              complex: "Okay. Please close the call and open it again. That often resets the audio connection.",
              simple: "Close the call and open it again."
            },
            nextAction: "Restart the call app.",
            followUp: "Did reopening the call help?"
          },
          {
            label: "I need help from someone",
            record: "User requested a helper handoff for the video call issue.",
            userReply: "I need help from someone.",
            handoff: true,
            nextAction: "Create a helper summary immediately."
          }
        ]
      }
    ]
  },
  wifi: {
    title: "The Wi‑Fi stopped working",
    shortTitle: "Wi‑Fi issue",
    audience: "A person cannot get online and may feel disconnected or stuck.",
    nextActionDefault: "Willow will check the easiest connection signal first.",
    steps: [
      {
        assistant: {
          complex: "I’m with you. We’ll keep this simple and only do one thing at a time.",
          simple: "I can help. We’ll do one step at a time."
        },
        prompt: {
          complex: "Do you see a Wi‑Fi symbol on the screen?",
          simple: "Do you see the Wi‑Fi symbol?"
        },
        options: [
          {
            label: "Yes",
            record: "User sees a Wi‑Fi symbol.",
            userReply: "Yes, I see it.",
            response: {
              complex: "Good. Please tap it once and check whether your usual network name appears in the list.",
              simple: "Tap it once and see if your usual Wi‑Fi name is there."
            },
            nextAction: "Check whether the normal Wi‑Fi network appears."
          },
          {
            label: "No",
            record: "User does not see a Wi‑Fi symbol.",
            userReply: "No, I don’t.",
            response: {
              complex: "That’s okay. Please open your device settings and look for Wi‑Fi. We want to make sure it is turned on.",
              simple: "Open settings and find Wi‑Fi. Make sure it is on."
            },
            nextAction: "Guide the user into settings to confirm Wi‑Fi is turned on."
          },
          {
            label: "I’m not sure",
            record: "User is not sure whether they can identify the Wi‑Fi symbol.",
            userReply: "I’m not sure.",
            response: {
              complex: "Look for a fan-shaped symbol made of curved lines. It is often near the top or bottom of the screen.",
              simple: "Look for a fan-shaped symbol with curved lines."
            },
            nextAction: "Describe the Wi‑Fi icon visually."
          }
        ]
      },
      {
        assistant: {
          complex: "We can also try the oldest reliable fix.",
          simple: "We can try a simple fix."
        },
        prompt: {
          complex: "Would you like to restart the device now?",
          simple: "Do you want to restart the device now?"
        },
        options: [
          {
            label: "Yes, let’s do that",
            record: "User agreed to restart the device.",
            userReply: "Yes, let’s do that.",
            response: {
              complex: "Great. Please turn the device all the way off, wait about 15 seconds, and turn it back on.",
              simple: "Turn it off, wait 15 seconds, then turn it back on."
            },
            nextAction: "Have the user restart the device."
          },
          {
            label: "Not right now",
            record: "User declined a restart for now.",
            userReply: "Not right now.",
            response: {
              complex: "No problem. A helper may need to check the network or password if you would rather not restart.",
              simple: "That’s okay. A helper may need to check the Wi‑Fi for you."
            },
            handoff: true,
            nextAction: "Prepare a support handoff because the restart was declined."
          }
        ]
      }
    ]
  },
  password: {
    title: "I forgot my password",
    shortTitle: "Password help",
    audience: "A person may be locked out and worried about making the situation worse.",
    nextActionDefault: "Willow will lower pressure and guide the safest next action.",
    steps: [
      {
        assistant: {
          complex: "That happens all the time. We’ll focus on the safest way back in.",
          simple: "That’s okay. We’ll find the safest way back in."
        },
        prompt: {
          complex: "Do you see a “Forgot password” or “Reset password” option on the sign-in screen?",
          simple: "Do you see “Forgot password”?"
        },
        options: [
          {
            label: "Yes",
            record: "Password reset option is visible.",
            userReply: "Yes, I see it.",
            response: {
              complex: "Please tap that option. It is usually the fastest and safest way to continue.",
              simple: "Tap that option."
            },
            nextAction: "Use the built-in reset flow."
          },
          {
            label: "No",
            record: "No password reset option is visible.",
            userReply: "No, I don’t see it.",
            response: {
              complex: "That’s okay. A helper may need to reset it from their side or guide you through the correct login page.",
              simple: "That’s okay. A helper may need to reset it for you."
            },
            handoff: true,
            nextAction: "Prepare a helper handoff for account access."
          },
          {
            label: "I’m scared to press the wrong thing",
            record: "User expressed anxiety about making a mistake.",
            userReply: "I’m scared to press the wrong thing.",
            response: {
              complex: "You’re doing fine. We won’t do anything risky. I’ll keep the next step as gentle as possible.",
              simple: "You’re okay. We won’t do anything risky."
            },
            nextAction: "Reduce anxiety and continue with the safest option."
          }
        ]
      }
    ]
  },
  print: {
    title: "My printer won’t print my forms",
    shortTitle: "Printer issue",
    audience: "A person may need an important document printed soon.",
    nextActionDefault: "Willow will check power and paper before assuming anything technical.",
    steps: [
      {
        assistant: {
          complex: "Let’s start with the easiest printer checks first.",
          simple: "Let’s start with the easiest printer checks."
        },
        prompt: {
          complex: "Is the printer turned on right now?",
          simple: "Is the printer on?"
        },
        options: [
          {
            label: "Yes",
            record: "Printer power is on.",
            userReply: "Yes, it’s on.",
            response: {
              complex: "Good. Please look for any message or blinking light on the printer itself.",
              simple: "Good. Look for a message or blinking light."
            },
            nextAction: "Check for visible printer errors."
          },
          {
            label: "No",
            record: "Printer is currently off.",
            userReply: "No, it’s off.",
            response: {
              complex: "Please press the power button once and wait for the printer to fully wake up.",
              simple: "Press the power button and wait for it to wake up."
            },
            nextAction: "Power on the printer before anything else."
          },
          {
            label: "I don’t know where the power button is",
            record: "User cannot identify the printer power button.",
            userReply: "I don’t know where the power button is.",
            response: {
              complex: "That’s okay. Look on the front or top edge for a small round button, often marked with a line and circle symbol.",
              simple: "Look on the front or top for a small round power button."
            },
            nextAction: "Describe the button visually."
          }
        ]
      }
    ]
  }
};

const roleDescriptions = {
  "older-adult": "Gentle, reassuring language with bigger choices and less pressure.",
  "helper": "Shows enough context for a family member or caregiver to step in smoothly.",
  "staff": "Frames the conversation as a cleaner intake for front desk or support staff."
};

const state = {
  scenarioKey: null,
  role: "older-adult",
  stepIndex: 0,
  history: [],
  summarySteps: [],
  nextAction: "Willow will suggest one calm next step at a time.",
  simpleMode: false,
  voiceMode: false
};

const scenarioList = document.getElementById("scenarioList");
const chatWindow = document.getElementById("chatWindow");
const chatActions = document.getElementById("chatActions");
const restartBtn = document.getElementById("restartBtn");
const confusedBtn = document.getElementById("confusedBtn");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const summaryScenario = document.getElementById("summaryScenario");
const summaryAudience = document.getElementById("summaryAudience");
const summarySteps = document.getElementById("summarySteps");
const summaryNext = document.getElementById("summaryNext");
const summaryNote = document.getElementById("summaryNote");
const presenceText = document.getElementById("presenceText");
const modeDescription = document.getElementById("modeDescription");

const toggleLargeText = document.getElementById("toggleLargeText");
const toggleSimple = document.getElementById("toggleSimple");
const toggleVoice = document.getElementById("toggleVoice");

function currentScenario() {
  return scenarios[state.scenarioKey];
}

function currentStep() {
  return currentScenario().steps[state.stepIndex];
}

function getCopy(variant) {
  return state.simpleMode ? variant.simple : variant.complex;
}

function setToolbarState() {
  toggleSimple.classList.toggle("active", state.simpleMode);
  toggleVoice.classList.toggle("active", state.voiceMode);
}

function speak(text) {
  if (!state.voiceMode || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.voice = speechSynthesis.getVoices().find(v => /female|samantha|victoria|karen/i.test(v.name)) || null;
  window.speechSynthesis.speak(utterance);
}

function addMessage(type, html) {
  const el = document.createElement("div");
  el.className = `message ${type}`;
  el.innerHTML = html;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingThen(callback) {
  const typing = document.createElement("div");
  typing.className = "message assistant";
  typing.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  setTimeout(() => {
    typing.remove();
    callback();
  }, 550);
}

function renderScenarioList() {
  scenarioList.innerHTML = Object.entries(scenarios).map(([key, item]) => `
    <button class="scenario-card ${state.scenarioKey === key ? "active" : ""}" data-scenario="${key}">
      <span class="scenario-title">${item.title}</span>
      <span class="scenario-copy">${item.audience}</span>
    </button>
  `).join("");
}

function resetConversation() {
  state.scenarioKey = null;
  state.stepIndex = 0;
  state.history = [];
  state.summarySteps = [];
  state.nextAction = "Willow will suggest one calm next step at a time.";
  renderScenarioList();
  renderIdleState();
  updateSummary();
}

function renderIdleState() {
  chatWindow.innerHTML = "";
  chatActions.innerHTML = "";

  addMessage("assistant", `
    <strong>Hi, I’m Willow.</strong>
    <span class="assistant-copy-complex">I can help with everyday tech problems in a calmer, simpler way. Choose the story that feels closest to what is happening right now.</span>
    <span class="assistant-copy-simple">I can help with tech problems. Pick the one that feels closest to what is happening.</span>
  `);

  addMessage("system", state.role === "older-adult"
    ? "Designed to feel calm and easy to follow"
    : state.role === "helper"
      ? "Helper mode gives you context while you guide someone"
      : "Staff mode frames this like a cleaner intake conversation");

  presenceText.textContent = state.role === "older-adult"
    ? "Calm support companion"
    : state.role === "helper"
      ? "Helping someone else, together"
      : "Support intake companion";
}

function updateSummary() {
  const scenario = state.scenarioKey ? currentScenario() : null;
  summaryScenario.textContent = scenario ? scenario.shortTitle : "Not selected yet";
  summaryAudience.textContent = scenario ? scenario.audience : "Choose a scenario to start the demo.";
  summaryNext.textContent = state.nextAction;

  summarySteps.innerHTML = "";
  const items = state.summarySteps.length ? state.summarySteps : ["Nothing yet"];
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    summarySteps.appendChild(li);
  });

  summaryNote.textContent = buildSupportNote();
}

function buildSupportNote() {
  if (!state.scenarioKey) {
    return "A clean support note will appear here once the conversation starts.";
  }

  const scenario = currentScenario();

  return `Willow Assist — helper handoff

Situation:
${scenario.title}

Audience context:
${scenario.audience}

What was already tried:
${state.summarySteps.length ? state.summarySteps.map((step, index) => `${index + 1}. ${step}`).join("\n") : "No steps captured yet."}

Recommended next action:
${state.nextAction}

Experience mode:
${state.role}`;
}

function renderStep(step) {
  const intro = getCopy(step.assistant);
  const prompt = getCopy(step.prompt);

  showTypingThen(() => {
    addMessage("assistant", `
      <span class="assistant-copy-complex">${intro}</span>
      <span class="assistant-copy-simple">${intro}</span>
    `);

    addMessage("assistant", `
      <strong>${prompt}</strong>
    `);

    renderOptions(step.options);
    speak(`${intro}. ${prompt}`);
  });
}

function renderOptions(options) {
  chatActions.innerHTML = "";
  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = `option-chip ${index === 0 ? "primary" : ""}`;
    btn.textContent = option.label;
    btn.addEventListener("click", () => chooseOption(option));
    chatActions.appendChild(btn);
  });
}

function chooseOption(option) {
  addMessage("user", option.userReply || option.label);
  state.summarySteps.push(option.record);
  state.nextAction = option.nextAction || state.nextAction;
  updateSummary();

  chatActions.innerHTML = "";

  if (option.handoff) {
    showTypingThen(() => {
      addMessage("assistant", `
        <strong>I’m going to make this easier.</strong>
        <span class="assistant-copy-complex">I’ve prepared a clean note so a helper or staff member can step in without starting from zero.</span>
        <span class="assistant-copy-simple">I made a clear note so someone can help you faster.</span>
      `);
      addMessage("system", "Helper handoff is ready in the panel on the right");
      state.nextAction = "Use the helper handoff note and involve a family member or staff member.";
      updateSummary();
      renderAfterHandoffOptions();
      speak("I made a clear note so someone can help you faster.");
    });
    return;
  }

  showTypingThen(() => {
    addMessage("assistant", `
      <span class="assistant-copy-complex">${getCopy(option.response)}</span>
      <span class="assistant-copy-simple">${getCopy(option.response)}</span>
    `);
    if (option.followUp) {
      addMessage("assistant", `<strong>${option.followUp}</strong>`);
      renderSimpleNextChoices(option.followUp);
      speak(`${getCopy(option.response)} ${option.followUp}`);
    } else {
      state.stepIndex += 1;
      const scenario = currentScenario();
      if (state.stepIndex < scenario.steps.length) {
        renderStep(currentStep());
      } else {
        renderResolution();
      }
    }
    updateSummary();
  });
}

function renderSimpleNextChoices(question) {
  chatActions.innerHTML = "";

  const yesBtn = document.createElement("button");
  yesBtn.className = "option-chip primary";
  yesBtn.textContent = "Yes, that helped";
  yesBtn.addEventListener("click", () => {
    addMessage("user", "Yes, that helped.");
    state.summarySteps.push("The last step appears to have helped.");
    state.nextAction = "The issue may be resolved, but the helper note is still available if needed.";
    updateSummary();
    renderResolution();
  });

  const noBtn = document.createElement("button");
  noBtn.className = "option-chip";
  noBtn.textContent = "No, I still need help";
  noBtn.addEventListener("click", () => {
    addMessage("user", "No, I still need help.");
    state.summarySteps.push("The last step did not resolve the issue.");
    const scenario = currentScenario();
    state.stepIndex += 1;
    updateSummary();
    if (state.stepIndex < scenario.steps.length) {
      renderStep(currentStep());
    } else {
      renderHandoffPrompt();
    }
  });

  const helperBtn = document.createElement("button");
  helperBtn.className = "option-chip";
  helperBtn.textContent = "Send this to a helper";
  helperBtn.addEventListener("click", () => {
    addMessage("user", "Please send this to a helper.");
    state.summarySteps.push("User requested helper involvement.");
    renderHandoffPrompt();
  });

  chatActions.append(yesBtn, noBtn, helperBtn);
}

function renderHandoffPrompt() {
  chatActions.innerHTML = "";
  state.nextAction = "A helper or staff member should continue with the support note.";
  updateSummary();

  showTypingThen(() => {
    addMessage("assistant", `
      <strong>We’ve done enough for now.</strong>
      <span class="assistant-copy-complex">I’ve gathered the important context. A helper can pick this up from here without asking you to repeat everything.</span>
      <span class="assistant-copy-simple">I’ve gathered the important details. Someone can help you from here.</span>
    `);
    addMessage("system", "Support note is ready to copy");
    renderAfterHandoffOptions();
    speak("I have gathered the important details. Someone can help you from here.");
  });
}

function renderAfterHandoffOptions() {
  chatActions.innerHTML = "";

  const copyBtn = document.createElement("button");
  copyBtn.className = "option-chip primary";
  copyBtn.textContent = "Copy support note";
  copyBtn.addEventListener("click", copySummary);

  const restart = document.createElement("button");
  restart.className = "option-chip";
  restart.textContent = "Start over";
  restart.addEventListener("click", resetConversation);

  chatActions.append(copyBtn, restart);
}

function renderResolution() {
  chatActions.innerHTML = "";

  showTypingThen(() => {
    addMessage("assistant", `
      <strong>That looks better.</strong>
      <span class="assistant-copy-complex">I’m glad we found a next step that helped. I’ll keep the support note ready just in case the problem comes back.</span>
      <span class="assistant-copy-simple">I’m glad that helped. I’ll keep the note ready in case you need more help.</span>
    `);
    addMessage("system", "Conversation complete");
    state.nextAction = "Issue appears improved. Keep the helper note available if the problem returns.";
    updateSummary();

    const noteBtn = document.createElement("button");
    noteBtn.className = "option-chip primary";
    noteBtn.textContent = "Copy support note anyway";
    noteBtn.addEventListener("click", copySummary);

    const newIssueBtn = document.createElement("button");
    newIssueBtn.className = "option-chip";
    newIssueBtn.textContent = "Choose another story";
    newIssueBtn.addEventListener("click", resetConversation);

    chatActions.append(noteBtn, newIssueBtn);
    speak("I’m glad that helped.");
  });
}

function explainMoreSimply() {
  if (!state.scenarioKey) return;

  showTypingThen(() => {
    addMessage("assistant", `
      <strong>Here’s the simpler version.</strong>
      <span class="assistant-copy-complex">Don’t worry about the technical terms. We only need to find one small button or setting at a time.</span>
      <span class="assistant-copy-simple">That’s okay. We only need one small step at a time.</span>
    `);
    state.summarySteps.push("User asked for a simpler explanation.");
    state.nextAction = "Continue using simpler wording and smaller steps.";
    updateSummary();
    speak("That’s okay. We only need one small step at a time.");
  });
}

function startScenario(key) {
  state.scenarioKey = key;
  state.stepIndex = 0;
  state.summarySteps = [];
  const scenario = currentScenario();
  state.nextAction = scenario.nextActionDefault;
  renderScenarioList();
  chatWindow.innerHTML = "";
  chatActions.innerHTML = "";

  addMessage("system", state.role === "older-adult"
    ? "Willow is focusing on comfort and clarity"
    : state.role === "helper"
      ? "Helper mode is keeping track of what has already been tried"
      : "Staff mode is building a cleaner intake summary");

  addMessage("assistant", `
    <strong>${scenario.title}</strong>
    <span class="assistant-copy-complex">${scenario.audience}</span>
    <span class="assistant-copy-simple">${scenario.audience}</span>
  `);

  updateSummary();
  renderStep(currentStep());
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(buildSupportNote());
    copySummaryBtn.textContent = "Copied";
    setTimeout(() => {
      copySummaryBtn.textContent = "Copy support note";
    }, 1400);
  } catch (error) {
    copySummaryBtn.textContent = "Copy failed";
    setTimeout(() => {
      copySummaryBtn.textContent = "Copy support note";
    }, 1400);
  }
}

scenarioList.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-scenario]");
  if (!btn) return;
  startScenario(btn.dataset.scenario);
});

document.querySelectorAll(".mode-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".mode-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    state.role = pill.dataset.role;
    modeDescription.textContent = roleDescriptions[state.role];
    renderIdleState();
    if (state.scenarioKey) {
      startScenario(state.scenarioKey);
    } else {
      updateSummary();
    }
  });
});

restartBtn.addEventListener("click", resetConversation);
confusedBtn.addEventListener("click", explainMoreSimply);
copySummaryBtn.addEventListener("click", copySummary);

toggleLargeText.addEventListener("click", () => {
  document.body.classList.toggle("large-text");
  toggleLargeText.classList.toggle("active");
});

toggleSimple.addEventListener("click", () => {
  state.simpleMode = !state.simpleMode;
  document.body.classList.toggle("simple-mode", state.simpleMode);
  setToolbarState();
  if (state.scenarioKey) {
    startScenario(state.scenarioKey);
  } else {
    renderIdleState();
  }
});

toggleVoice.addEventListener("click", () => {
  state.voiceMode = !state.voiceMode;
  setToolbarState();
  if (!state.voiceMode && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

renderScenarioList();
renderIdleState();
updateSummary();
setToolbarState();
