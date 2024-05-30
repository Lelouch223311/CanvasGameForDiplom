//Перемённые
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obsticles = [];
let gameSpeed;
let keys = {};

//Ивенты
document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
})

class Player {

    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;
    }

    Animate() {
        //Анимция прыжка (ну или почти))
        if (keys['KeyW'] || keys['ArrowUp']) {
            this.Jump()
        } else {
            this.jumpTimer = 0;
        }

        if (keys['KeyS'] || keys['ArrowDown']) {
            this.h = this.originalHeight / 2;
        } else {
            this.h = this.originalHeight
        }

        this.y += this.dy

        //Попытка сделать гравитацию
        if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
        }

        this.Draw()
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = this.jumpForce
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++
            this.dy = -this.jumpTimer - (this.jumpTimer / 50)
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.closePath();
    }
}

class Obstacle {
    constructor(x, y, w, h, c) {
        this.x = x
        this.y = y
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed
    }

    Update() {
        this.x += this.dx;
        this.Draw()
        this.dx = -gameSpeed;
    }
    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.closePath();
    }
}

class Text {
    constructor(t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw() {
        ctx.beginPath()
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif"
        ctx.textAlign = this.x
        ctx.fillText(this.t, this.x, this.y)
        ctx.closePath();
    }
}
let stopGame = 0;
function Stop() {
    obstacles = 0;
    score = 0;
    spawnTimer = initialSpawnTimer;
    gameSpeed = 0;
    highscore = 0;
    // window.localStorage.setItem('highscore', highscore);
}
function Start() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "20px sans-serif";

    gameSpeed = 4;
    gravity = 1;
    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore')
    }

    player = new Player(25, canvas.height - 150, 50, 50, '#FF5858')
    player.Draw();

    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 155, 25, "right", "#212121", "20")

    requestAnimationFrame(Update);
}

function spawnObstacles() {
    let size = RandomIntInRange(20, 70);
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

    if (type == 1) {
        obstacle.y -= player.originalHeight - 10;
    }

    obsticles.push(obstacle);
}


function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update() {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    spawnTimer--;
    if (spawnTimer <= 0) {
        spawnObstacles();
        console.log(obsticles)
        spawnTimer = initialSpawnTimer - gameSpeed * 8
        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }

    for (let i = 0; i < obsticles.length; i++) {
        let o = obsticles[i];

        if (o.x + o.width < 0) {
            obsticles.splice(i, 1);
        }

        if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
            obstacles = 0;
            score = 0;
            spawnTimer = initialSpawnTimer;
            gameSpeed = 3;
            window.localStorage.setItem('highscore', highscore);
        }

        o.Update();
    }

    player.Animate()

    score++
    scoreText.t = "Score: " + score
    scoreText.Draw();

    if (score > highscore) {
        highscore = score;
        highscoreText.t = "Highscore: " + highscore;
    }

    highscoreText.Draw()

    gameSpeed += 0.009;
}


// Сообщения


// script.js 

let icon = {
    success:
        '<span class="material-symbols-outlined">task_alt</span>',
    danger:
        '<span class="material-symbols-outlined">error</span>',
    warning:
        '<span class="material-symbols-outlined">warning</span>',
    info:
        '<span class="material-symbols-outlined">info</span>',
};

const showToast = (
    message = "Sample Message",
    toastType = "info",
    duration = 5000) => {
    if (
        !Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add(
        "toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper"> 
					<div class="toast-icon"> 
					${icon[toastType]} 
					</div> 
					<div class="toast-message">${message}</div> 
					<div class="toast-progress"></div> 
					</div>`;
    duration = duration || 5000;
    box.querySelector(".toast-progress").style.animationDuration =
        `${duration / 1000}s`;

    let toastAlready =
        document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)
};

// let submit = 
// 	document.querySelector(".custom-toast.success-toast"); 
let information = document.querySelector(".custom-toast.info-toast");
let failed = document.querySelector(".custom-toast.danger-toast"); 
let warn = document.querySelector(".custom-toast.warning-toast"); 
/*
submit.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Кнопка succes,пока не задействована.", "success", 5000);
});
*/
information.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Создатель: Lelouch (@Lelouch18 - TG)", "info", 5000);
});
/*
*/
failed.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Игра запущена !", "danger", 5000);
});

warn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Игра остановлена !", "warning", 5000);
});