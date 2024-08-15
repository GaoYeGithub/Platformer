var isGameOver;
var score;

var GRAVITY = 0.3;
var JUMP = -7;

var groundSprites;
var elevatedBlocks;
var GROUND_SPRITE_WIDTH = 50;
var GROUND_SPRITE_HEIGHT = 50;
var numGroundSprites;

var player;

var obstacleSprites;
var canJump = true;

function setup() {
    isGameOver = false;
    score = 0;

    createCanvas(400, 300);
    background(150, 200, 250);
    groundSprites = new Group();
    elevatedBlocks = new Group();

    numGroundSprites = width / GROUND_SPRITE_WIDTH + 1;

    for (var n = 0; n < numGroundSprites; n++) {
        var groundSprite = createSprite(n * 50, height - 25, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT);
        groundSprites.add(groundSprite);

        if (random() > 0.7) {
            var elevatedBlock = createSprite(n * 50, height - 100, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT);
            elevatedBlocks.add(elevatedBlock);
        }
    }

    player = createSprite(100, height - 75, 50, 50);

    obstacleSprites = new Group();
}

function draw() {
    if (isGameOver) {
        background(0);
        fill(255);
        textAlign(CENTER);
        text("Your score was: " + score, camera.position.x, camera.position.y - 20);
        text("Game Over! Click anywhere to restart", camera.position.x, camera.position.y);
    } else {
        background(150, 200, 250);

        player.velocity.y = player.velocity.y + GRAVITY;

        if (groundSprites.overlap(player) || elevatedBlocks.overlap(player)) {
            player.velocity.y = 0;
            canJump = true;
        }

        if (keyWentDown(UP_ARROW) && canJump) {
            player.velocity.y = JUMP;
            canJump = false;
            setTimeout(() => canJump = true, 1000);
        }

        player.position.x = player.position.x + 5;
        camera.position.x = player.position.x + (width / 4);

        var firstGroundSprite = groundSprites[0];
        if (firstGroundSprite.position.x <= camera.position.x - (width / 2 + firstGroundSprite.width / 2)) {
            groundSprites.remove(firstGroundSprite);
            firstGroundSprite.position.x = firstGroundSprite.position.x + numGroundSprites * firstGroundSprite.width;
            groundSprites.add(firstGroundSprite);
        }

        elevatedBlocks.forEach(function(block) {
            if (block.position.x <= camera.position.x - (width / 2 + block.width / 2)) {
                block.position.x += numGroundSprites * block.width;
            }
        });

        if (random() > 0.98) {
            var obstacle = createSprite(camera.position.x + width, height - 50 - 15, 30, 30);
            obstacle.draw = function() {
                fill(255, 0, 0);
                triangle(-15, 15, 15, 15, 0, -15);
            };
            obstacleSprites.add(obstacle);
        }

        var firstObstacle = obstacleSprites[0];
        if (obstacleSprites.length > 0 && firstObstacle.position.x <= camera.position.x - (width / 2 + firstObstacle.width / 2)) {
            removeSprite(firstObstacle);
        }

        obstacleSprites.overlap(player, endGame);

        drawSprites();

        score = score + 1;
        textAlign(CENTER);
        text(score, camera.position.x, 10);
    }
}

function endGame() {
    isGameOver = true;
}

function mouseClicked() {
    if (isGameOver) {

        for (var n = 0; n < numGroundSprites; n++) {
            var groundSprite = groundSprites[n];
            groundSprite.position.x = n * 50;
        }

        player.position.x = 100;
        player.position.y = height - 75;

        obstacleSprites.removeSprites();

        score = 0;
        isGameOver = false;
    }
}
