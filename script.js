const canvas = document.getElementById("heartsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 6 + 4;
    this.speed = Math.random() * 1 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y -= this.speed;
    if (this.y < -20) {
      this.y = canvas.height + 20;
      this.x = Math.random() * canvas.width;
    }
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

const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");

const lockScreen = document.getElementById("lock-screen");
const proposal = document.getElementById("proposal");
const quiz = document.getElementById("quiz");
const memory = document.getElementById("memory");

const musicBar = document.getElementById("musicBar");
const bgMusic = document.getElementById("bgMusic");
const playPause = document.getElementById("playPause");

unlockBtn.addEventListener("click", () => {
  const input = passwordInput.value.trim().toUpperCase();
  if (input === "23 JANUARY") {
    gsap.to(lockScreen, {opacity:0, duration:1, onComplete: () => {
      lockScreen.classList.remove("active");
      proposal.classList.add("active");
      musicBar.style.display = "flex";
      bgMusic.play();
    }});
  } else {
    errorMsg.innerText = "Wrong Date ❤️";
    gsap.fromTo(lockScreen, {x:-10}, {x:10, repeat:5, yoyo:true, duration:0.1});
  }
});

playPause.addEventListener("click", () => {
  if(bgMusic.paused){
    bgMusic.play();
    playPause.innerText = "⏸";
  } else {
    bgMusic.pause();
    playPause.innerText = "▶";
  }
});

document.getElementById("yesBtn").addEventListener("click", () => {
  proposal.classList.remove("active");
  quiz.classList.add("active");
});
const noBtn = document.getElementById("noBtn");
let noClicks = 0;

noBtn.addEventListener("click", () => {
  noClicks++;

  if(noClicks === 1) noBtn.innerText = "Why?";
  else if(noClicks === 2) noBtn.innerText = "Mar khabi?";
  else if(noClicks === 3) noBtn.innerText = "Breakup done";
  else {
    noBtn.style.position = "absolute";
    noBtn.style.top = Math.random() * 80 + "%";
    noBtn.style.left = Math.random() * 80 + "%";
  }
});
document.getElementById("yesBtn").addEventListener("click", () => {

  for(let i=0;i<20;i++){
    let burst = document.createElement("div");
    burst.className = "burstHeart";
    document.body.appendChild(burst);

    burst.style.left = Math.random()*100+"%";
    burst.style.top = Math.random()*100+"%";

    gsap.to(burst,{
      y:-200,
      opacity:0,
      duration:1.5,
      onComplete:()=>burst.remove()
    });
  }

  gsap.to("#proposal",{opacity:0,duration:1,onComplete:()=>{
    proposal.classList.remove("active");
    quiz.classList.add("active");
  }});
});
const letterText = "Hey, how are you ❤️\n\nFrom the moment you came into my life, everything became brighter.\nYou are my peace, my chaos, my forever.\n\nI promise to stay, to care, and to love you endlessly.";

function typeLetter() {
  const letter = document.getElementById("letter");
  let i = 0;
  let interval = setInterval(()=>{
    letter.innerHTML += letterText[i];
    i++;
    if(i >= letterText.length) clearInterval(interval);
  },40);
}
function goToPage(current,next){
  gsap.to(current,{opacity:0,blur:10,duration:0.8,onComplete:()=>{
    current.classList.remove("active");
    next.classList.add("active");
    gsap.fromTo(next,{opacity:0},{opacity:1,duration:0.8});
  }});
}
