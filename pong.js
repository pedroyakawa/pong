const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Propriedades das barras
const player = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: 'pink', // Cor da raquete do jogador alterada para rosa
    dy: 0, // velocidade em Y
    speed: 6,
    score: 0 // Placar do jogador à esquerda
};

const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: 'pink', // Cor da raquete do computador alterada para rosa
    dy: 0, // velocidade em Y
    speed: 6,
    score: 0 // Placar do jogador à direita
};

// Propriedades da bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4,
    color: 'pink' // Cor da bola alterada para rosa
};

// Função para desenhar o placar
function drawScore() {
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(player.score, canvas.width / 4, 50); // Placar jogador 1
    ctx.fillText(computer.score, (canvas.width / 4) * 3, 50); // Placar jogador 2
}

// Desenhar um retângulo (barra)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Desenhar um círculo (bola)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Atualizar a posição dos jogadores com movimento suave
function updatePlayer() {
    player.y += player.dy;
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function updateComputer() {
    computer.y += computer.dy;
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Atualizar a posição da bola
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisão com as bordas superiores/inferiores
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Colisão com o jogador
    if (ball.x - ball.radius < player.x + player.width && 
        ball.y > player.y && 
        ball.y < player.y + player.height) {
        ball.dx *= -1;
    }

    // Colisão com o computador
    if (ball.x + ball.radius > computer.x && 
        ball.y > computer.y && 
        ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    // Se a bola sair da tela, atualiza o placar
    if (ball.x + ball.radius < 0) {
        computer.score++; // Ponto do computador
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) {
        player.score++; // Ponto do jogador
        resetBall();
    }
}

// Reiniciar a posição da bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

// Limpar a tela
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Desenhar os elementos na tela
function draw() {
    clearCanvas();
    drawScore(); // Desenhar o placar
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Atualizar a tela e o jogo
function update() {
    updatePlayer();
    updateComputer();
    updateBall();
    draw();
}

// Gerenciar teclas pressionadas e soltas
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            player.dy = -player.speed;
            break;
        case 's':
            player.dy = player.speed;
            break;
        case 'ArrowUp':
            computer.dy = -computer.speed;
            break;
        case 'ArrowDown':
            computer.dy = computer.speed;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 's':
            player.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            computer.dy = 0;
            break;
    }
});

// Executar o loop do jogo
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
