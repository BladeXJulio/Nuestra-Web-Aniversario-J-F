const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
const fireCanvas = document.getElementById("fireworks");
const fireCtx = fireCanvas.getContext("2d");

let w, h;
let mouse = { x: 0, y: 0 };

function resize(){

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    fireCanvas.width = w;
    fireCanvas.height = h;

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

button.addEventListener("click", () => {

    hero.style.transition = "opacity 1.2s ease";
    hero.style.opacity = "0";

    canvas.style.transition = "transform 2s ease";
    canvas.style.transform = "scale(1.15)";

    setTimeout(() => {

        transition.classList.add("show");

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

    if(!noExploded) return;

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

    typeLetter();

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

/* ============================
        MUSICA
============================ */

function startMusic(){

    music.volume=0;

    music.currentTime=0;

    music.play();

    fadeIn();

}

function fadeIn(){

    const interval=setInterval(()=>{

        if(music.volume<0.98){

            music.volume+=0.02;

        }else{

            music.volume=1;

            clearInterval(interval);

        }

    },60);

}

music.addEventListener("ended",()=>{

    fadeOut();

});

function fadeOut(){

    music.volume=1;

    const interval=setInterval(()=>{

        if(music.volume>0.02){

            music.volume-=0.02;

        }else{

            music.volume=0;

            clearInterval(interval);

            setTimeout(()=>{

                music.currentTime=0;

                music.play();

                fadeIn();

            },5000);

        }

    },40);

}

/* ============================
        CARTA
============================ */

const fullLetter = `

Querida Fresley, 

Hace un año comenzamos está historia de amor que aún seguimos escribiendo, 
y está de más decirte lo mucho que me importas y cuánto te amo, pero te lo digo aún...


Has sido parte de cada momento bueno, malo, triste, y feliz a lo largo de este año, y 
solo puedo agradecerte por ser una novia tan maravillosa. Con solo recordar tu sonrisa me pongo a sonreír, 
eres la única para mi.


Cada vez que pienso en ti, una melodía como esta atraviesa mi mente...
La compuse especialmente para ti para que sepas lo especial que eres tú en mi vida. 
Llevamos un año juntos, 366 días y hoy por fin puedo decirte...


Feliz aniversario, Amor de mi vida.

De Julio.

`;

let currentChar = 0;

function typeLetter(){

    letterText.innerHTML="";

    currentChar=0;

    writeCharacter();

}

/* ============================
      FUEGOS ARTIFICIALES
============================ */

let fireworks = [];
let fireworksRunning = false;

class Firework {

    constructor() {

        this.x = Math.random() * w;
        this.y = h + 20;

        this.targetY = 80 + Math.random() * (h * 0.45);

        this.speed = 8 + Math.random() * 3;

        this.exploded = false;

        this.particles = [];

        this.color = `hsl(${Math.random() * 360},100%,60%)`;

    }

    update() {

        if (!this.exploded) {

            this.y -= this.speed;

            fireCtx.globalAlpha = p.life;

fireCtx.beginPath();

if (p.flash) {

    fireCtx.fillStyle = "white";
    fireCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);

} else {

    fireCtx.fillStyle = this.color;
    fireCtx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);

}

fireCtx.shadowBlur = 15;
fireCtx.shadowColor = this.color;

fireCtx.fill();

fireCtx.shadowBlur = 0;

            if (this.y <= this.targetY) {

                this.explode();

            }

        } else {
            
           for (let i = 0; i < 25; i++) {

    this.particles.push({

        x: this.x,
        y: this.y,

        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,

        life: 0.35,
        flash: true

    });

}

            for (let p of this.particles) {

                p.x += p.vx;
                p.y += p.vy;

                p.vy += 0.04;

                p.life -= 0.015;

                if (p.life <= 0) continue;

                fireCtx.globalAlpha = p.life;

                fireCtx.beginPath();
                fireCtx.fillStyle = this.color;
                fireCtx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
                fireCtx.fill();

            }

            fireCtx.globalAlpha = 1;

            this.particles = this.particles.filter(p => p.life > 0);

        }

    }

    explode() {

        this.exploded = true;

        for (let i = 0; i < 120; i++) {

            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;

            this.particles.push({

                x: this.x,
                y: this.y,

                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,

                life: 1

            });

        }

    }

    finished() {

        return this.exploded && this.particles.length === 0;

    }

}/* ============================
      ANIMACIÓN FUEGOS
============================ */

function animateFireworks() {

    fireCtx.clearRect(0, 0, w, h);

    for (let fw of fireworks) {

        fw.update();

    }

    fireworks = fireworks.filter(fw => !fw.finished());

    requestAnimationFrame(animateFireworks);

}

animateFireworks();


/* ============================
      INICIAR FUEGOS
============================ */

function startFireworks() {

    if (fireworksRunning) return;

    fireworksRunning = true;

    setInterval(() => {

        fireworks.push(new Firework());

    }, 350);

}

function writeCharacter(){

    if(currentChar >= fullLetter.length){

    startFireworks();

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

    setTimeout(writeCharacter,speed);

}