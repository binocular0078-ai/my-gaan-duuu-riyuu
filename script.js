

/* =========================
   FLOATING HEART PARTICLES
========================= */

const canvas = document.getElementById("heartsCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let hearts = [];

class Heart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 6 + 4;
    this.speed = Math.random() * 1 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y -= this.speed;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#ff4da6";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) {
  hearts.push(new Heart());
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();


/* =========================
   PAGE REFERENCES
========================= */

const lockScreen = document.getElementById("lock-screen");
const proposal = document.getElementById("proposal");
const quiz = document.getElementById("quiz");
const letterPage = document.getElementById("letterPage");
const memory = document.getElementById("memory");

const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");

const musicBar = document.getElementById("musicBar");
const bgMusic = document.getElementById("bgMusic");
const playPause = document.getElementById("playPause");


/* =========================
   PAGE TRANSITION FUNCTION
========================= */

function goToPage(current, next) {
  gsap.to(current, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      current.classList.remove("active");
      next.classList.add("active");
      gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.8 });
    }
  });
}


/* =========================
   PASSWORD LOCK
========================= */

unlockBtn.addEventListener("click", () => {
  const input = passwordInput.value.trim().toUpperCase();

  if (input === "23 JANUARY") {

    goToPage(lockScreen, proposal);

    // STOP old background music if playing
    bgMusic.pause();
    bgMusic.currentTime = 0;

    // Play proposal music with fade in
    proposalMusic.play();
    gsap.to(proposalMusic, { volume: 1, duration: 3 });

  } else {
    errorMsg.innerText = "Wrong Date ❤️";
    gsap.fromTo(lockScreen, 
      { x: -10 }, 
      { x: 10, repeat: 5, yoyo: true, duration: 0.1 }
    );
  }
});


/* =========================
   MUSIC BAR
========================= */

playPause.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    playPause.innerText = "⏸";
  } else {
    bgMusic.pause();
    playPause.innerText = "▶";
  }
});


/* =========================
   PROPOSAL PAGE
========================= */

const proposalMusic = new Audio("music/proposal.mp3");
proposalMusic.volume = 0;

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let noClicks = 0;

noBtn.addEventListener("click", () => {
  noClicks++;

  if (noClicks === 1) noBtn.innerText = "Why?";
  else if (noClicks === 2) noBtn.innerText = "Mar khabi?";
  else if (noClicks === 3) noBtn.innerText = "Breakup done";
  else {
    noBtn.style.position = "absolute";
    noBtn.style.top = Math.random() * 80 + "%";
    noBtn.style.left = Math.random() * 80 + "%";
  }
});

document.body.style.background = "#ff4da6";
setTimeout(() => {
  document.body.style.background = "";
}, 200);

yesBtn.addEventListener("click", () => {

  // Fade out proposal music smoothly
  gsap.to(proposalMusic, {
    volume: 0,
    duration: 2,
    onComplete: () => {
      proposalMusic.pause();
      proposalMusic.currentTime = 0;
    }
  });

  

  // Wait 1 second before changing page (for emotion)
  setTimeout(() => {
    goToPage(proposal, quiz);
    loadQuestion();
  }, 1000);

});

/* =========================
   QUIZ SECTION
========================= */

const questions = [
  {
    question: "When did we first talk?",
    options: ["Random Day", "Fate Day", "23 January", "Never"],
    answer: 2
  },
  {
    question: "What are we?",
    options: ["Friends", "Enemies", "Soulmates", "Neighbors"],
    answer: 2
  },
  {
    question: "Forever means?",
    options: ["Until bored", "Temporary", "Endless", "Few days"],
    answer: 2
  }
];

let currentQuestion = 0;

const questionContainer = document.getElementById("questionContainer");
const progressBar = document.querySelector("#progressBar div");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionContainer.innerHTML = "";

  let questionEl = document.createElement("h2");
  questionEl.innerText = q.question;
  questionContainer.appendChild(questionEl);

  q.options.forEach((option, index) => {
    let btn = document.createElement("button");
    btn.innerText = option;
    btn.style.margin = "10px";
    btn.onclick = () => checkAnswer(index);
    questionContainer.appendChild(btn);
  });

  progressBar.style.width = ((currentQuestion) / questions.length) * 100 + "%";
}

function checkAnswer(selected) {
  if (selected === questions[currentQuestion].answer) {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      progressBar.style.width = "100%";
      setTimeout(() => {
        goToPage(quiz, letterPage);
        openLetter();
      }, 800);
    }
  } else {
    gsap.fromTo(questionContainer, 
      { x: -10 }, 
      { x: 10, repeat: 4, yoyo: true, duration: 0.1 }
    );
  }
}


/* =========================
   LOVE LETTER
========================= */

const letterText = `Hey, how are you ❤️

From the moment you entered my life, everything changed.
You became my peace in chaos, my smile in sadness,
and my forever in a temporary world.

I promise to stay.
I promise to care.
I promise to love you endlessly.`;

function openLetter() {
  typeLetter();
}

function typeLetter() {
  const letter = document.getElementById("letter");
  letter.innerHTML = "";
  let i = 0;

  let interval = setInterval(() => {
    letter.innerHTML += letterText[i];
    i++;
    if (i >= letterText.length) clearInterval(interval);
  }, 40);
}

document.getElementById("continueBtn").addEventListener("click", () => {
  goToPage(letterPage, memory);
});
