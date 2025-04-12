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

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', {
    frameWidth: 64,
    frameHeight: 96
  });
}

let bird;
let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let cursors;
let messagesToPlayer;

function create() {
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

  const roads = this.physics.add.staticGroup();
  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

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

  bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  this.physics.add.collider(bird, road, () => hasLanded = true, null, this);
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);
  this.physics.add.overlap(bird, topColumns, () => hasBumped = true, null, this);
  this.physics.add.overlap(bird, bottomColumns, () => hasBumped = true, null, this);

  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-UP', () => {
    if (!isGameStarted) {
      isGameStarted = true;
      messagesToPlayer.text = 'Instructions: Press ↑ to stay up\nAvoid columns!';
    }
    if (!hasLanded && !hasBumped) {
      bird.setVelocityY(-160);
    }
  });

  messagesToPlayer = this.add.text(0, 0, 'Instructions: Press ↑ to start', {
    fontFamily: '"Comic Sans MS", times, serif',
    fontSize: "20px",
    color: "white",
    backgroundColor: "black"
  });

  Phaser.Display.Align.In.BottomCenter(messagesToPlayer, background, 0, 50);
}

function update() {
  if (isGameStarted && !hasLanded && !hasBumped) {
    bird.setVelocityX(50);
  } else {
    bird.setVelocityX(0);
  }

  if (hasLanded || hasBumped) {
    messagesToPlayer.text = 'Oh no! You crashed!';
  }

  if (bird.x > 750 && !hasBumped && !hasLanded) {
    bird.setVelocityY(40);
    messagesToPlayer.text = 'Congrats! You won!';
  }
}