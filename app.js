let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false // Change to true to visualize hitboxes
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
let gameActive = false;
let cursors;
let messagesToPlayer;
let birdSpeed = 100;
let topColumns;
let bottomColumns;
const COLUMN_SPACING = 300;
const GAP_SIZE = 150;

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

  // Ground (road)
  const roads = this.physics.add.staticGroup();
  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

  // Columns (obstacles)
  topColumns = this.physics.add.staticGroup();
  bottomColumns = this.physics.add.staticGroup();

  // Generate column pairs with vertical gaps
  for (let i = 0; i < 3; i++) {
    let x = 400 + i * COLUMN_SPACING;
    let gapY = Phaser.Math.Between(150, 400); // vertical center of gap

    // Create top column just above the gap
    let top = topColumns.create(x, gapY - GAP_SIZE / 2, 'column');
    top.setOrigin(0.5, 1); // bottom aligned
    top.refreshBody();

    // Create bottom column just below the gap
    let bottom = bottomColumns.create(x, gapY + GAP_SIZE / 2, 'column');
    bottom.setOrigin(0.5, 0); // top aligned
    bottom.refreshBody();
  }

  // Bird setup
  bird = this.physics.add.sprite(100, 300, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  // Collisions
  this.physics.add.collider(bird, road, () => {
    hasLanded = true;
    if (gameActive) gameOver(this);
  });

  this.physics.add.collider(bird, topColumns, () => {
    hasBumped = true;
    if (gameActive) gameOver(this);
  });

  this.physics.add.collider(bird, bottomColumns, () => {
    hasBumped = true;
    if (gameActive) gameOver(this);
  });

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-UP', () => {
    if (!gameActive && (hasLanded || hasBumped)) {
      resetGame(this);
      return;
    }

    if (!gameActive && !hasLanded && !hasBumped) {
      startGame(this);
    }

    if (gameActive) {
      bird.setVelocityY(-160);
    }
  });

  // UI message
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
    bird.setVelocityX(birdSpeed);

    // Win condition
    if (bird.x > 400 + (COLUMN_SPACING * 3)) {
      gameActive = false;
      bird.setVelocityX(0);
      messagesToPlayer.text = '🎉 Congratulations! You won! 🎉';
    }
  }
}

function startGame(scene) {
  gameActive = true;
  bird.setVelocityX(birdSpeed);
  messagesToPlayer.text = 'Press UP to fly!\nAvoid the columns!';
}

function gameOver(scene) {
  gameActive = false;
  bird.setVelocityX(0);
  messagesToPlayer.text = '💥 Game Over!\nPress UP to try again';
}

function resetGame(scene) {
  bird.setPosition(100, 300);
  bird.setVelocity(0);
  hasLanded = false;
  hasBumped = false;
  startGame(scene);
}
// Reset columns
  topColumns.clear(true, true);
  bottomColumns.clear(true, true);

  // Regenerate columns
  for (let i = 0; i < 3; i++) {
    let x = 400 + i * COLUMN_SPACING;
    let gapY = Phaser.Math.Between(150, 400); // vertical center of gap

    let top = topColumns.create(x, gapY - GAP_SIZE / 2, 'column');
    top.setOrigin(0.5, 1);
    top.refreshBody();

    let bottom = bottomColumns.create(x, gapY + GAP_SIZE / 2, 'column');
    bottom.setOrigin(0.5, 0);
    bottom.refreshBody();
  }
