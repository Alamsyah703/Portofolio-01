//board
var board;
var boardWidth = 1400;
var boardHeight = 600;

//sounds
var sound_point = new Audio("sounds effect/sounds effect_point.mp3");
var sound_die = new Audio("sounds effect/sounds effect_die.mp3");

//bird
var birdWidth = 60; 
var birdHeight = 50;
var birdX = boardWidth / 8;
var birdY = boardHeight / 2;
var birdImg;

var bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
var pipeArray = [];
var pipeWidth = 64; 
var pipeHeight = 512;
var pipeX = boardWidth;
var pipeY = 0;

var topPipeImg;
var bottomPipeImg;

// membuat objek gambar baru
var gameOverImage;

//physics
var velocityX = -7; 
var velocityY = 0; 
var gravity = 0.4;


var gameOver;
var score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //load images
  birdImg = new Image();
  birdImg.src = "./Bird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  gameOverImage = new Image();
  gameOverImage.src = "gameover.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 800); //0,8 s
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); 
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
    sound_die.play();
  }

  //pipes
  for (var i = 0; i < pipeArray.length; i++) {
    var pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; 
      pipe.passed = true;
      sound_point.play();
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
      sound_die.play();
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); 
  }

  //score

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 700, 50);

  if (gameOver) {
    context.drawImage(gameOverImage, 650, 225, 150, 150);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  var randomPipeX = pipeX = boardWidth+Math.random()*(boardWidth/2-pipeWidth);
  var randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  var openingSpace = board.height / 4;

  var topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  var bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY+pipeHeight+openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && 
    a.x + a.width > b.x && 
    a.y < b.y + b.height && 
    a.y + a.height > b.y
  ); 
}
