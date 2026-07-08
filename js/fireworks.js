/* ============================
      FUEGOS ARTIFICIALES
============================ */

let fireworks = [];
let fireworksRunning = false;

class Firework {

    constructor() {

        this.x = Math.random() * w;
        this.y = h + 30;

        this.targetY = 80 + Math.random() * (h * 0.45);

        this.speed = 7 + Math.random() * 3;

        this.color = `hsl(${Math.random() * 360},100%,60%)`;

        this.exploded = false;

        this.flash = 0;

        this.particles = [];

    }

    update() {

        if (!this.exploded) {

            // Subida
            this.y -= this.speed;

            // Estela
            fireCtx.beginPath();
            fireCtx.strokeStyle = this.color;
            fireCtx.lineWidth = 2;
            fireCtx.shadowBlur = 10;
            fireCtx.shadowColor = this.color;

            fireCtx.moveTo(this.x, this.y + 20);
            fireCtx.lineTo(this.x, this.y);

            fireCtx.stroke();

            // Cohete
            fireCtx.beginPath();
            fireCtx.fillStyle = "white";
            fireCtx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            fireCtx.fill();

            fireCtx.shadowBlur = 0;

            if (this.y <= this.targetY) {

                this.explode();

            }

        } else {

            // Destello inicial
            if (this.flash > 0) {

                fireCtx.globalAlpha = this.flash;

                fireCtx.beginPath();
                fireCtx.fillStyle = "white";
                fireCtx.arc(this.x, this.y, 18, 0, Math.PI * 2);
                fireCtx.fill();

                fireCtx.globalAlpha = 1;

                this.flash -= 0.08;

            }

            // Partículas
            for (let p of this.particles) {

                p.x += p.vx;
                p.y += p.vy;

                p.vy += 0.045;

                p.life -= 0.012;

                if (p.life <= 0) continue;

                fireCtx.globalAlpha = p.life;

                fireCtx.beginPath();

                fireCtx.fillStyle = this.color;

                fireCtx.shadowBlur = 12;
                fireCtx.shadowColor = this.color;

                fireCtx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);

                fireCtx.fill();

            }

            fireCtx.shadowBlur = 0;
            fireCtx.globalAlpha = 1;

            this.particles = this.particles.filter(p => p.life > 0);

        }

    }

    explode() {

        this.exploded = true;

        this.flash = 1;

        for (let i = 0; i < 140; i++) {

            const angle = Math.random() * Math.PI * 2;

            const speed = 2 + Math.random() * 4.5;

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

}

/* ============================
      ANIMACIÓN
============================ */

function animateFireworks() {

    fireCtx.clearRect(0, 0, w, h);

    for (const fw of fireworks) {

        fw.update();

    }

    fireworks = fireworks.filter(fw => !fw.finished());

    requestAnimationFrame(animateFireworks);

}

animateFireworks();

/* ============================
      INICIAR
============================ */

function startFireworks() {

    if (fireworksRunning) return;

    fireworksRunning = true;

    setInterval(() => {

        fireworks.push(new Firework());

    }, 500);

}