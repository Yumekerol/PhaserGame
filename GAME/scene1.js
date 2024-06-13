class Scene1 extends Phaser.Scene{
    constructor(){
        super("bootGame");
    }

    preload(){
        this.load.image("background", "assets/chao.png");
        this.load.image("doce", "assets/doce.png");
        this.load.image("bomba", "assets/bomba.png");
        this.load.image("card", "assets/card.png");
        this.load.spritesheet("girl", "assets/meninarosa.png",{ frameWidth: 64, frameHeight: 64 });
    }
    create(){
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

      this.anims.create({
        key: 'walking_x',
        frames: this.anims.generateFrameNumbers('girl', { start: 1, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'walking_up',
        frames: this.anims.generateFrameNumbers('girl', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'walking_down',
        frames: this.anims.generateFrameNumbers('girl', { start: 8, end: 10 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'stopped',
        frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0
      });
    }
}
