const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create ball props
const ball = 
{
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

// Create paddle props
const paddle = 
{
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// Create brick props
const brickInfo = 
{
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

const brickRowCount = 9;
const brickColumnCount = 8;

const bricks = [];
for (let i = 0; i < brickRowCount; i++) 
{
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) 
    {
        if (i !== Math.floor(brickRowCount / 2)) 
        {
            const x = j * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
            const y = i * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
            bricks[i][j] = { x, y, ...brickInfo };
        }
    }
}

let score = 0;
let ballSpeed = 1;
let isMessageShown = false;

// Draw score on canvas
function drawScore() 
{
    ctx.font = "20px Arial";
    if (!isMessageShown) 
    {
        ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    } 
    else 
    {
        ctx.fillText("ІПЗ Найкращі!!", canvas.width - 135, 30);
    }
}

// Draw ball on canvas
function drawBall() 
{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks on canvas
function drawBricks() 
{
    bricks.forEach(column => 
        {
        column.forEach(brick => 
            {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });

}

// Move paddle
function movePaddle() 
{
    paddle.x += paddle.dx;

    // Wall collision detection
    if (paddle.x + paddle.w > canvas.width) 
    {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) 
    {
        paddle.x = 0;
    }
}

// Move ball
function moveBall() 
{
    ball.x += ball.dx * ballSpeed;
    ball.y += ball.dy * ballSpeed;

    // Wall collision detection (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) 
    {
        ball.dx *= -1; // Reverse ball direction
    }

    // Wall collision detection (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) 
    {
        ball.dy *= -1; // Reverse ball direction
    }

    // Paddle collision detection
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed; // Reverse ball direction
    }

    // Brick collision detection
    bricks.forEach(column => 
        {
        column.forEach(brick => 
            {
            if (brick.visible) 
            {
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    ball.dy *= -1; // Reverse ball direction
                    brick.visible = false; // Hide the brick

                    increaseScore(); // Increase score
                }
            }
        });
    });

    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) 
    {
        showAllBricks(); // Reset bricks
        score = 0; // Reset score
        ballSpeed = 1; // Reset ball speed
    }
}

// Increase score and ball speed
function increaseScore() {
    score++;

    if (score == 25 && !isMessageShown) 
    {
        isMessageShown = true;
    }

    if (score % 10 === 0) 
    {
        ballSpeed += 0.5; // Increase ball speed by 1 or desired value
    }

    if (score % (brickRowCount * brickColumnCount) == 0) 
    {
        showAllBricks(); // Reset bricks
    }
}

// Draw everything
function draw() 
{
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBall();
    drawPaddle();
    drawBricks();
}

// Update canvas drawing and animation
function update() 
{
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Keydown event
function keyDown(e) 
{
    if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event
function keyUp(e)
{
    if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
    ) {
        paddle.dx = 0;
    }
}


update();