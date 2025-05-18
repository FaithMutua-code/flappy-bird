let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

// Game variables
let bird;
let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let gameActive = false;
let cursors;
let messagesToPlayer;
let birdSpeed = 100;
let columns;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', {
    frameWidth: 64,
    frameHeight: 96
  });
}

function create() {
  // Background
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

  // Road (ground)
  const roads = this.physics.add.staticGroup();
  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

  // Columns (obstacles)
  const topColumns = this.physics.add.staticGroup({
    key: 'column',
    repeat: 1,
    setXY: { x: 200, y: 0, stepX: 300 }
  });

  const bottomColumns = this.physics.add.staticGroup({
    key: 'column',
    repeat: 1,
    setXY: { x: 350, y: 400, stepX: 300 }
  });

  // Bird setup
  bird = this.physics.add.sprite(100, 300, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  // Collision detection
  this.physics.add.collider(bird, road, () => {
    hasLanded = true;
    if (gameActive) gameOver(this);
  }, null, this);

  this.physics.add.collider(bird, topColumns, () => {
    hasBumped = true;
    if (gameActive) gameOver(this);
  }, null, this);

  this.physics.add.collider(bird, bottomColumns, () => {
    hasBumped = true;
    if (gameActive) gameOver(this);
  }, null, this);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-UP', () => {
    if (!gameActive && !hasLanded && !hasBumped) {
      startGame(this);
    }
    
    if (gameActive) {
      bird.setVelocityY(-160);
    }
  });

  // UI Text
  messagesToPlayer = this.add.text(0, 0, 'Press UP ARROW to start', {
    fontFamily: '"Comic Sans MS", times, serif',
    fontSize: "20px",
    color: "white",
    backgroundColor: "black",
    padding: { x: 10, y: 5 }
  });

  Phaser.Display.Align.In.BottomCenter(messagesToPlayer, background, 0, 50);
}

function update() {
  if (gameActive && !hasLanded && !hasBumped) {
    // Constant forward movement
    bird.setVelocityX(birdSpeed);
    
    // Check for win condition (reached right side)
    if (bird.x > 750) {
      gameActive = false;
      bird.setVelocityX(0);
      messagesToPlayer.text = 'Congratulations! You won!';
    }
  }
}

function startGame(scene) {
  gameActive = true;
  isGameStarted = true;
  bird.setVelocityX(birdSpeed);
  messagesToPlayer.text = 'Press UP to fly!\nAvoid the columns!';
}

function gameOver(scene) {
  gameActive = false;
  bird.setVelocityX(0);
  messagesToPlayer.text = 'Game Over!\nPress UP to try again';
  
  // Reset game state after a delay
  scene.time.delayedCall(1000, () => {
    hasLanded = false;
    hasBumped = false;
  });
}