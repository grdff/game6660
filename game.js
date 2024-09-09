const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let selectedCharacter = null;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    angle: 0,
    speed: 5,
    color: 'green'
};

const bullets = [];
const bulletSpeed = 10;
const wallSize = 20;
let gameOver = false;
const walls = [];
const king = {
    x: 700,
    y: 500,
    width: 40,
    height: 40
};

// إنشاء متاهة بسيطة
walls.push(
    { x: 100, y: 100, width: 20, height: 400 },
    { x: 100, y: 100, width: 400, height: 20 },
    { x: 500, y: 100, width: 20, height: 400 },
    { x: 100, y: 500, width: 420, height: 20 }
);

// دالة اختيار الشخصية
function selectCharacter(character) {
    selectedCharacter = character;
    console.log("Character selected:", character);  // التحقق من تسجيل اختيار الشخصية
    document.getElementById('characterSelect').style.display = 'none';
    canvas.style.display = 'block';
    initializeCharacter();
}

// تخصيص خصائص الشخصية المختارة
function initializeCharacter() {
    if (selectedCharacter === 'tank') {
        player.speed = 3;
        player.width = 60;
        player.height = 60;
        player.color = 'green';
    } else if (selectedCharacter === 'soldier') {
        player.speed = 7;
        player.width = 30;
        player.height = 30;
        player.color = 'blue';
    }

    console.log("Player initialized:", player);  // التحقق من إعدادات الشخصية
    document.addEventListener('keydown', moveCharacter);
    update();
}

// تحريك الشخصية بناءً على الاختيار
function moveCharacter(e) {
    let prevX = player.x;
    let prevY = player.y;

    switch (e.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case ' ':
            shootBullet();
            break;
    }

    if (checkCollisionWithWalls()) {
        player.x = prevX;
        player.y = prevY;
    }
}

// تحكم بإطلاق النار
function shootBullet() {
    const bullet = {
        x: player.x,
        y: player.y,
        dx: bulletSpeed * Math.cos(player.angle * Math.PI / 180),
        dy: bulletSpeed * Math.sin(player.angle * Math.PI / 180)
    };
    bullets.push(bullet);
}

// رسم اللاعب
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
}

// رسم الجدران
function drawWalls() {
    ctx.fillStyle = 'grey';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

// التحقق من الاصطدام بالجدران
function checkCollisionWithWalls() {
    return walls.some(wall => {
        return player.x + player.width / 2 > wall.x &&
               player.x - player.width / 2 < wall.x + wall.width &&
               player.y + player.height / 2 > wall.y &&
               player.y - player.height / 2 < wall.y + wall.height;
    });
}

// رسم الطلقات
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    });
}

// تحديث الشاشة
function update() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawPlayer();
    drawBullets();
    requestAnimationFrame(update);
}
