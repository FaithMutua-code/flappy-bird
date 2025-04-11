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
 let bird;
 let hasLanded=false;
 let cursors;
function create()
{
  const background = this.add.image(0,0,'background').setOrigin(0,0);
  const roads = this.physics.add.staticGroup();
  

  const topColumns =this.physics.add.staticGroup({
    key:'column',
    repeat:1,
    setXY:{x:200, y:0, stepX:300}
  });

  const bottomColumns=this.physics.add.staticGroup(
    {
      key:'column',
      repeat:1,
      setXY:{x :350,y: 400,stepX:300},
    }
  );
  const road =roads.create(400,568,'road').setScale(2).refreshBody();

  bird=this.physics.add.sprite(0,50, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

   this.physics.add.overlap(bird,road, () =>hasLanded=true,null,this);
  this.physics.add.collider(bird,road);
  
cursors=this.input.keyboard.createCursorKeys(); /*.createCursorKeys() method creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.*/
}

 
function update()
{
  if(cursors.up.isDown &&!hasLanded){
    bird.setVelocityY(-160);
   
  }
  if(!hasLanded){
    bird.body.velocity.x=50;
  }
  if(hasLanded){
    bird.body.velocity.x=0;
  }

}