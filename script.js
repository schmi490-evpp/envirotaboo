let questions = [];
let current = null;
let mode = null;
let score = 0;
let timer = 60;
let countdown = null;

const promptEl = document.getElementById("prompt");
const tabooEl = document.getElementById("taboo-words");
const inputEl = document.getElementById("playerInput");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const quitBtn = document.getElementById("quitBtn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const playArea = document.getElementById("play-area");

document.getElementById("mode1").onclick = () => startGame("mode1");
document.getElementById("mode2").onclick = () => startGame("mode2");
document.getElementById("submitBtn").onclick = handleInput;
nextBtn.onclick = nextCard;
quitBtn.onclick = resetGame;

async function startGame(selected) {
  mode = selected;
  questions = await fetch("questions.json").then(r => r.json());
  document.getElementById("menu").classList.add("hidden");
  playArea.classList.remove("hidden");
  score = 0;
  scoreEl.textContent = "Score: " + score;
  nextCard();
  startTimer();
}

function startTimer() {
  clearInterval(countdown);
  timer = 60;
  timerEl.textContent = "⏱ " + timer;
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = "⏱ " + timer;
    if (timer <= 0) {
      clearInterval(countdown);
      feedbackEl.textContent = "⏰ Time's up!";
      inputEl.disabled = true;
    }
  }, 1000);
}

function nextCard() {
  inputEl.disabled = false;
  inputEl.value = "";
  feedbackEl.textContent = "";
  current = questions[Math.floor(Math.random() * questions.length)];

  if (mode === "mode1") {
    promptEl.textContent = `Give clues for: ${current.term}`;
    tabooEl.textContent = "TABOO: " + current.taboo.join(", ");
  } else {
    promptEl.textContent = current.clues[Math.floor(Math.random() * current.clues.length)];
    tabooEl.textContent = "(guess the term)";
  }
}

function handleInput() {
  const txt = inputEl.value.trim().toLowerCase();
  if (!txt) return;

  if (mode === "mode1") {
    // simple "computer guessing" heuristic
    const termKey = current.term.toLowerCase().split(" ")[0];
    const randomGuess = Math.random();

    if (txt.includes(termKey) || randomGuess > 0.7) {
      feedbackEl.textContent = "🤖 Computer guessed your word! ✅";
      score++;
      scoreEl.textContent = "Score: " + score;
      nextCard();
    } else {
      feedbackEl.textContent = "🤖 Computer: 'hmm... still thinking...'";
    }
  } else {
    if (txt === current.term.toLowerCase()) {
      feedbackEl.textContent = "Correct! ✅";
      score++;
      scoreEl.textContent = "Score: " + score;
      nextCard();
    } else {
      feedbackEl.textContent = "Try again ❌";
    }
  }
}
function resetGame() {
  clearInterval(countdown);
  playArea.classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
