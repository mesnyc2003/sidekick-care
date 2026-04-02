const app = document.getElementById("app");

function home() {
  app.innerHTML = `
    <div class="message">Hi, I’m Hearth. I’m here to help you.</div>
    <div class="message">What’s going on?</div>

    <button class="button" onclick="wifi()">My internet stopped working</button>
    <button class="button" onclick="sound()">I can’t hear anything</button>
  `;
}

function wifi() {
  app.innerHTML = `
    <div class="message">That’s okay, we’ll fix it together.</div>
    <div class="message">Let’s try something simple first.</div>

    <button class="button" onclick="step1()">Continue</button>
  `;
}

function step1() {
  app.innerHTML = `
    <div class="message">Can you try restarting your device?</div>

    <button class="button" onclick="fixed()">That worked</button>
    <button class="button" onclick="help()">I still need help</button>
  `;
}

function fixed() {
  app.innerHTML = `
    <div class="message">Great! I’m glad it’s working now.</div>
    <button class="button" onclick="home()">Start over</button>
  `;
}

function help() {
  app.innerHTML = `
    <div class="message">No problem. I’ll prepare a note so someone can help you.</div>
    <div class="message">Issue: Wi-Fi problem<br>Step tried: Restart device</div>
    <button class="button" onclick="home()">Done</button>
  `;
}

function sound() {
  app.innerHTML = `
    <div class="message">Let’s fix the sound together.</div>
    <button class="button" onclick="home()">Back</button>
  `;
}

home();
