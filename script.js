
setInterval(updateLoveCounter,1000);

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
const backButton = document.getElementById("backButton");

let w, h;
let mouse = { x: 0, y: 0 };

function resize(){

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX - w / 2) / w;
  mouse.y = (e.clientY - h / 2) / h;
});


// =====================
// 🌟 ESTRELLAS FIJAS
// =====================
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.alpha = Math.random();
this.minAlpha = 0.15 + Math.random() * 0.2;
this.maxAlpha = 0.7 + Math.random() * 0.3;
this.twinkleSpeed = 0.003 + Math.random() * 0.01;
this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    this.z = Math.random(); // profundidad
    this.size = Math.random() * 2.2;
    this.baseX = this.x;
    this.baseY = this.y;
  }

  update() {
    const strength = 160; // 🔥 parallax fuerte

    const parallaxX = mouse.x * (this.z * strength);
    const parallaxY = mouse.y * (this.z * strength);

    this.x += (this.baseX + parallaxX - this.x) * 0.08;
    this.y += (this.baseY + parallaxY - this.y) * 0.08;

    this.alpha += this.twinkleSpeed * this.twinkleDirection;

if (this.alpha >= this.maxAlpha) {
    this.alpha = this.maxAlpha;
    this.twinkleDirection = -1;
}

if (this.alpha <= this.minAlpha) {
    this.alpha = this.minAlpha;
    this.twinkleDirection = 1;
}

    // respawn suave
    if (this.x < -50 || this.x > w + 50 || this.y < -50 || this.y > h + 50) {
      this.reset();
    }
  }

  draw() {
    const alpha = this.alpha;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "white";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


// =====================
// 🌠 ESTRELLAS FUGACES
// =====================
class ShootingStar {
  constructor() {
    this.spawn();
  }

  spawn() {
    this.x = Math.random() * w;
    this.y = Math.random() * h * 0.5;

    const angle = Math.random() * Math.PI / 3 + Math.PI / 6;
    const speed = 8 + Math.random() * 12;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.length = 80 + Math.random() * 220; // largas y cortas
    this.life = 1;
    this.decay = 0.006 + Math.random() * 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.life -= this.decay;

    if (this.life <= 0) this.spawn();
  }

  draw() {
    const tailX = this.x - this.vx * this.length / 12;
    const tailY = this.y - this.vy * this.length / 12;

    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      tailX, tailY
    );

    gradient.addColorStop(0, `rgba(255,255,255,${this.life})`);
    gradient.addColorStop(0.3, `rgba(255,255,255,0.4)`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 + Math.random() * 1.8;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "white";
    ctx.stroke();
  }
}


// =====================
// INIT
// =====================
const stars = Array.from({ length: 220 }, () => new Star());
const shootingStars = Array.from({ length: 6 }, () => new ShootingStar());


// =====================
// LOOP
// =====================
function animate() {
  ctx.clearRect(0, 0, w, h);

  // fondo suave
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  for (let s of stars) {
    s.update();
    s.draw();
  }

  for (let s of shootingStars) {
    s.update();
    s.draw();
  }

  requestAnimationFrame(animate);
}

animate();

const hero = document.querySelector(".hero");
const transition = document.getElementById("transition");
const button = document.getElementById("startButton");

const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const letterIntro = document.getElementById("letterIntro");
const letter = document.getElementById("letter");
const letterText = document.getElementById("letterText");

const music = document.getElementById("music");

let noExploded = false;
let typeTimer = null;
let letterStarted = false;
let currentCharTimeout = null;

button.addEventListener("click", () => {

    hero.style.transition = "opacity 1.2s ease";
    hero.style.opacity = "0";

    canvas.style.transition = "transform 2s ease";
    canvas.style.transform = "scale(1.15)";

    backButton.classList.add("show");

    setTimeout(() => {

        transition.classList.add("show");

        if (letterStarted) {

    letter.classList.remove("hidden");
    letter.classList.add("show");

    currentCharTimeout = setTimeout(writeCharacter, 50);

    return;

}

        setTimeout(() => {

            question.classList.remove("hidden");

            requestAnimationFrame(() => {

                question.classList.add("show");

            });

        },1800);

    },1200);

});

/* ============================
      BOTON NO
============================ */

noBtn.addEventListener("click",()=>{

    if(noExploded) return;

    noExploded=true;

    noBtn.classList.add("creeper");

    setTimeout(()=>{

        explodeButton(noBtn);

    },800);

});

/* ============================
      BOTON SI
============================ */

yesBtn.addEventListener("click",()=>{

    

    question.style.opacity="0";

    question.style.pointerEvents="none";

    setTimeout(()=>{

        question.style.display="none";

        document.querySelector("#transition h2").classList.add("fadeOut");
document.getElementById("chapterText").classList.add("fadeOut");

letterIntro.classList.remove("hidden");

requestAnimationFrame(()=>{

    letterIntro.classList.add("show");

});

startMusic();

       setTimeout(()=>{

    letter.classList.remove("hidden");

    requestAnimationFrame(()=>{

        letter.classList.add("show");

    });

    transition.style.position = "absolute";
    transition.style.minHeight = "100vh";

    document.body.style.overflowY = "auto";

   if(!letterStarted){

    letterStarted = true;
    typeLetter();

   }else{

    writeCharacter();
    if(music.paused){
        music.play();
    }

   }

},2500);

    },900);

});

/* ============================
        EXPLOSION
============================ */

function explodeButton(button){

    const rect = button.getBoundingClientRect();

    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;

    button.classList.add("explode");

    for(let i=0;i<45;i++){

        createParticle(cx,cy);

    }

    setTimeout(()=>{

        button.remove();

        yesBtn.classList.add("center");

    },700);

}

function createParticle(x,y){

    const p=document.createElement("div");

    p.className="particle";

    const angle=Math.random()*Math.PI*2;

    const distance=80+Math.random()*120;

    const dx=Math.cos(angle)*distance;
    const dy=Math.sin(angle)*distance;

    p.style.left=x+"px";
    p.style.top=y+"px";

    p.style.setProperty("--x",dx+"px");
    p.style.setProperty("--y",dy+"px");

    document.body.appendChild(p);

    setTimeout(()=>{

        p.remove();

    },900);

}


function writeCharacter(){

    if(currentChar >= fullLetter.length){

    return;

}

    letterText.innerHTML+=fullLetter[currentChar];

    currentChar++;

    let speed=70;

    if(fullLetter[currentChar]==" "){

        speed=25;
    }

    if(fullLetter[currentChar]=="\n"){

        letterText.innerHTML+="<br>";

        currentChar++;

        speed=800;
    }

   currentCharTimeout = typeTimer = typeTimer = currentCharTimeout = setTimeout(writeCharacter, speed);

}

backButton.addEventListener("click", () => {

    clearTimeout(typeTimer);

    clearTimeout(currentCharTimeout);

    music.pause();
    music.currentTime = 0;

    hero.style.opacity = "1";
    hero.style.pointerEvents = "auto";

    canvas.style.transform = "scale(1)";

    transition.classList.remove("show");

    question.style.display = "block";
    question.style.opacity = "1";
    question.style.pointerEvents = "auto";
    question.classList.add("hidden");
    question.classList.remove("show");

    letter.classList.remove("show");
    letter.classList.add("hidden");

    letterIntro.classList.remove("show");
    letterIntro.classList.add("hidden");

    letterText.innerHTML = "";

    currentChar = 0;
    letterStarted = false;

    noExploded = false;

    hero.style.display = "flex";

    transition.style.position = "fixed";
    document.body.style.overflowY = "hidden";

    backButton.classList.remove("show");

});
