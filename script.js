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
