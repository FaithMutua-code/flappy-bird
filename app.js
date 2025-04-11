let config = {
  renderer: Phaser.AUTO,//phaser--2D game framework
  width: 800,
  height: 600,//game screen
  physics: {
    default:'arcade',//engine
    arcade:{
      gravity: {y:300},
      debug: false
    }
},
scene: {
  preload:preload,//load assets
  create:create,//setup
  update:update//game loop
}

};
let game = new Phaser.Game(config);

function preload(){
  this.load.image('background','assets/background.png');
  this.load.image('road','assets/road.png');
  this.load.image('column','assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', {
    frameWidth: 64,
    frameHeight: 96
  });
  //sprite can be animated
  
}
 
function create()
{
  const background = this.add.image(0,0,'background').setOrigin(0,0);
  const roads = this.physics.add.staticGroup();
  const road =roads.create(400,568,'road').setScale(2).refreshBody();

}
 
function update()
{
  
}