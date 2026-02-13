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
  constructor() { this.reset(); }
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

for (let i = 0; i < 60; i++) hearts.push(new Heart());

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => { h.update(); h.draw(); });
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

const proposalMusic = new Audio("music/proposal.mp3");
proposalMusic.volume = 0;


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

      gsap.fromTo(next,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      );

      // 🎬 Step 5 Background Mood Change
      if (next === letterPage) {
        gsap.to("body", {
          background: "linear-gradient(135deg, #12000a, #2e0018)",
          duration: 1
        });
      }

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

    // SHOW MUSIC BAR
    musicBar.style.display = "flex";

    // Play proposal music with fade in
    proposalMusic.play();
    gsap.to(proposalMusic, { volume: 0.6, duration: 2 });

    playPause.innerText = "⏸";

  } else {
    errorMsg.innerText = "Wrong Date ❤️";
    gsap.fromTo(lockScreen,
      { x: -10 },
      { x: 10, repeat: 5, yoyo: true, duration: 0.1 }
    );
  }
});


/* =========================
   MUSIC BAR CONTROLS
========================= */

playPause.addEventListener("click", () => {

  // If proposal page is active → control proposalMusic
  if (proposal.classList.contains("active")) {

    if (proposalMusic.paused) {
      proposalMusic.play();
      playPause.innerText = "⏸";
    } else {
      proposalMusic.pause();
      playPause.innerText = "▶";
    }

  } 
  // Otherwise → control romantic bgMusic
  else {

    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        playPause.innerText = "⏸";
      }).catch(err => {
        console.log("Play blocked:", err);
      });
    } else {
      bgMusic.pause();
      playPause.innerText = "▶";
    }

  }

});


/* =========================
   PROPOSAL PAGE
========================= */

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

yesBtn.addEventListener("click", () => {

  // Fade out proposal music
  gsap.to(proposalMusic, {
    volume: 0,
    duration: 2,
    onComplete: () => {
      proposalMusic.pause();
      proposalMusic.currentTime = 0;

      // Start romantic background music
      bgMusic.volume = 0;

      bgMusic.play().then(() => {
        gsap.to(bgMusic, { volume: 0.6, duration: 2 });
        playPause.innerText = "⏸";
      }).catch(err => {
        console.log("Autoplay blocked:", err);
      });

    }
  });

  // Transition to quiz
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
    image: "images/q1.jpg",
    question: "When did we first talk?",
    options: ["Random Day", "Fate Day", "7th November", "Never"],
    answers: [1]
  },
  {
    image: "images/q2.jpg",
    question: "If I disappear for one day, what will you do?",
    options: [
      "Sleep peacefully",
      "Call police",
      "Cry and spam call me",
      "Start missing me in 5 minutes"
    ],
    answers: [0, 2]
  },
  {
    image: "images/q3.jpg",
    question: "What is my biggest weakness?",
    options: ["Anger", "Overthinking", "You", "Laziness"],
    answers: [2]
  }
];



let currentQuestion = 0;

const questionContainer = document.getElementById("questionContainer");
const progressBar = document.querySelector("#progressBar div");

function loadQuestion() {

  const q = questions[currentQuestion];
  questionContainer.innerHTML = "";

  // Change image
  const quizImage = document.getElementById("quizImage");
  quizImage.src = q.image;

  // Animate image
  gsap.fromTo(".quiz-image-frame",
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.8 }
  );

  let questionEl = document.createElement("h2");
  questionEl.innerText = q.question;
  questionContainer.appendChild(questionEl);

  q.options.forEach((option, index) => {
    let btn = document.createElement("button");
    btn.innerText = option;
    btn.classList.add("quiz-option");
    btn.onclick = () => checkAnswer(index);
    questionContainer.appendChild(btn);
  });

  progressBar.style.width =
    ((currentQuestion) / questions.length) * 100 + "%";

  // Animate card
  gsap.fromTo(".quiz-card",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6 }
  );
}


function checkAnswer(selected) {

  const q = questions[currentQuestion];

  // If question has multiple answers
  let correctAnswers;

  if (q.answers) {
    correctAnswers = q.answers;
  } else {
    correctAnswers = [q.answer]; // convert single answer into array
  }

  if (correctAnswers.includes(selected)) {

    currentQuestion++;

    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      progressBar.style.width = "100%";
      setTimeout(() => {
      goToPage(quiz, letterPage);

setTimeout(() => {
  cinematicLetterEntrance();
}, 600);

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

const letterText = `Hey Balo, Gandu; Riya

Kemon achis? 😒 Okay... tor tareef korte toh chai na but 
ajke korte hobe lagche, agei bole dilam vao khabi na 😒.
On a random day in the college, 7th November, that KC SUV ke jodi 
admin baniye rakhtam, tahole hoyto tor moto gandu petam na.
Seeing you in the class, you saying your number to me to be added in the group.

I remember your tired, boring, and daring face which was giving me death threats.
But somehow I happened to message you and got to know you, and that day also your ex was still
playing with you. YOUR EX KI BOLBO ER BAPARE; you chose me or picked me, still I am in doubt,
will he again come and you will go with him, you will patch up with him, you will cheat on me with him
or any other guy who is better than me — of course you will get a better guy than me. I will not tell you to choose me, 
yet you have that power to choose who you love, kintu tao kharap lagbe and again FIRSE KATGAYA.
Well, I don’t know if I am doing all this because of insecurities or what is true, but jokhon bar bar katte thake and that feeling of 
(YOU ARE CURSED, YOU WILL NOT GET LOVE, YOU ARE PANUTI, NO ONE LOVES YOU, EVERYONE IS TEMPORARY) comes, I doubt and 
feel that you will also gonna go someday and this all will be memory.
How long can I bear this, I don’t know. And all this makes me doubt and get the truth from you.
Well, I know you have done so much effort for me, but since you had already a first and very possessive mind for him and also have done so much for him, 
I somehow think that you loved him more than me and did more efforts for him.
Well, after all, I also think you have moved on from him even though this thing is only known to you.
BHAI BHAI love letter eo EX bhore dilam, gal dis na abar 🥲.

DEKHHH how much I love (hate) your ex 😁 but I love (definitely not opposite) you more than him.
I don’t know about future but I definitely want to know (hypocrisy).
Baal, you look good honestly. Your EYES are like a Pacific where if I can’t swim perfectly, I will die for sure.
Your CUTENESS — I adore it. How that dumbass said that you don’t look good, I still can’t believe.
Your VOICE speaks of that child who lost her from the start of this world.
Tu deserve koris everything you desired but somehow this cruel world does not let you get that.
I have seen your honesty and purity you did to get loved, but you put that in the wrong place with wrong actions.
I don’t know about me that you feel something with me, BUT this love thing always ended very bad for me.
That’s why I try my best and don’t hurt anyone, and eventually I end up being alone.
That’s why I am this possessive, because this casual game is never for me.
YOU just care for me, listen to me, and tolerate my anger although you don’t have to do this.
I don’t want this to go another failure because of not trying and not fighting for it.

I see you say about unconditional love. I don’t know how long this would go for, but at the very end when the real
fight comes, we need that condition to get married.
Well, if I don’t get there where I have to to get married, and after all this if I have nothing and you choose me, I will love you.
But if you somehow have to let me go, I will still love you. There would be no regret for me because 
I failed you by not reaching there where I have to.
I will still love you, miss you, then move on — but this is not so easy.
I will accept the reality since I have loved you.
I will be happy if you're happy.

BHAI BHAI besi emotional hoye gelam, ebar closing kori.
Dekh, tu gandu botis thik ache, rag dekhabi but bole dichi block korbi na,
bole dilam 😐 ar tor pakamo bondo kore dibo jodi cheat korechis ba vatalcho kaoke.
AMI RAG DEKHABO, AMI BLOCK KORBO, ar ektu ektu ex ke niye khuchabo 😁😁 (joking)

VALENTINE BOTE, AJKE TOH BESI BOLLAM NA.
Ei website to ami 7 Feb theke vabchi ar banachi, tu vabis na reel dekhe banalchi.
Hmm, ChatGPT er help niye banalchi but puro manually banalchi.

Yet I hereby decide to fall for you.
You my gandu, there would not be time.
You trigger my senses and my heart.
You my darling gandu, remembering brings
wealth in my heart, then I scorn to
then I scorn to change my state with kings.
                              ---khumbokorno`;

function cinematicLetterEntrance() {

  const envelope = document.getElementById("envelope");

  gsap.fromTo(envelope,
    { opacity: 0, scale: 0.8, rotateX: -15 },
    {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        typeLetterCinematic();
      }
    }
  );

}

function openLetter() {
  cinematicLetterEntrance();
}

function cinematicLetterEntrance() {

  const envelope = document.getElementById("envelope");

  gsap.fromTo(envelope,
    { opacity: 0, scale: 0.8, rotateX: -15 },
    {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        typeLetterCinematic();
      }
    }
  );
}

function typeLetterCinematic() {

  const letter = document.getElementById("letter");
  letter.innerHTML = "";

  let i = 0;

  function type() {

    if (i < letterText.length) {

      letter.innerHTML += letterText[i];

      // small dramatic pauses
      if (
        letterText[i] === "." ||
        letterText[i] === "!" ||
        letterText[i] === "?" ||
        letterText[i] === "\n"
      ) {
        i++;
        setTimeout(type, 200);
      } else {
        i++;
        setTimeout(type, 35);
      }

      letter.scrollTop = letter.scrollHeight;

    } else {

      // soft glow effect at end
      gsap.fromTo(letter,
        { boxShadow: "0 0 0px rgba(255,0,120,0)" },
        { boxShadow: "0 0 35px rgba(255,0,120,0.6)", duration: 1 }
      );

    }

  }

  type();
}


document.getElementById("continueBtn").addEventListener("click", () => {
  goToPage(letterPage, memory);
});
