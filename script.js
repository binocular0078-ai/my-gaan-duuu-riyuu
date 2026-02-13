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

const letterText = `Hey Balo, Gandu; Riya

kemon achis ? 😒 okay... tor tareef korte toh chai na but 
ajke korte hobe lagche, agei bole dilam vao khabi na 😒.
on a random day in the college 7th november that kc suv ke jodi 
admin banin rakhtam thole hoi to tor moto gandu petam na.
seeing you in the class you saying your number to me to be added in the group.


i remember your tired, boring and daring face which was giving me death threat.
but somehow i happen to message you and got to know you and that day also your ex still
playing with you. YOUR EX KI BOLBO ER BAPARE; you choose me or picked me still i am in doubt,
will he again come and you will go with him, you will patch up with him, you will cheat on me with him
or any other guy who is better than me of course you will get better guy than me, i will not tell you to choose me 
yet you have that power to choose who you love kintu tao kharap lagbe and again FIRSE KATGAYA. well i am dont know i 
i am doing all this with because of insecurities or what is truly but jokhon bar bar kat te thake and that feeling of 
(YOU ARE CURSED YOU WILL NOT GET LOVE, YOU ARE PANUTI, NO ONE LOVES YOU, EVERYONE IS TEMPORARY) comes i doubt and 
feel that you will also gonna go someday and this all will be memory. how long can i bear this i dont know. and all this 
makes me to doubt and get the truth from you. well i know you have done so much efforts for me but since you had already first
and very possessive mind for him and also have done so much for him i somewhow thinks that you loved him more than me 
and did much efforts for him. well afterall i also think you have moved on from him even though this thing is only known
to you. BHAI BHAI love letter eo EX vore dilam gal dis na abar 🥲.


DEKHHH how much i love(hate) youR ex 😁 but i love(definetly not opposite) you more than him. i dont know abou future but i 
definetly want to know(hypocrisy). baal you look good honestly your EYES like a pacific where if i cant swim perfectly i will
die for sure. your CUTENESS i adore it how that dumbasss said that you dont look good i still cant belive. your VOICE speaks of 
that child who lost her from the start of this world. tu deserve koris everything you desired but somehow thisc ruel world not let 
you get that, i have seen your honesty and purity you did to get loved but you put that in wrong place with wrong actions. i dont 
know about me that you feel something with me BUT this love thing always ended very bad for me thats why i try my best and dont hurt
anyone and eventually i end up being alone thats why i am this possessive cause this casual game never for me. YOU just care for me 
listen to me and tolerate my anger although you dont have to do this. i dont want this to go another failure because of not trying and 
not fighting for it.
i see you say about unconditional love i dont know how long this would go for but at the very end when the real
fight comes we need that condition to get married well if i dont get there where i have to to get married and after all this if i have
nothing you choose me i will love you but if you somehow have to let me go i will still love you there would be no regret for me cause 
i failed you by not reaching there where i have to. i will still love you miss you then move on but this is not so easy 
i will accept the reality since i have loved you i i will be happy if your happy.


BHAI BHAI besi emotional hoye gelam ebar closing kori , dekh tu gandu botis thik ache rag dekhabi but bole dichi block korbi na
bole dilam 😐 ar tor pakamo bondo kore dibo jodi cheat korechis ba vatalcho kaoke. AMI RAG DEKHABO , AMI BLOCK KORBO, ar ektu ektu
ex ke niye khuchabo 😁😁(joking) 


VALENTIINE BOTE AJKE TOH BESI BOLLAM NA
ei website to ami 7 feb theke vabchi ar banachi tu vabis na reel dekhe banalchi
hmm chat gpt er help niye banalchi but puro manually banalchi.


yet i hereby decide to fall for you
you my gandu there would not be time 
you trigger my senses and my heart.
you my darling gandu remembering brings
wealth in my heart, then i scron to 
then i scron to change my state with kings.
                              ---khumbokorno`;

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
