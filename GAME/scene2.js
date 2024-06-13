class Scene2 extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    create(){
        this.background = this.add.image(0, 0,"background");
        this.background.setOrigin(0,0);

        this.doce = this.add.image(100,100,"doce");

        this.cursors = this.input.keyboard.createCursorKeys();

        //this.doce.setScale(2);
        this.add.text(20,20,
                  "Playing Game");

        for(let i = 0; i < 4; i++) {
          for(let j = 0; j<4; j++) {
            this.add.rectangle(i*144 + 40, j*144 + 55, 80, 80, 0xff0000)
          }
        }

        this.girl = this.physics.add.sprite(200, 200, "girl");
    }

    update() {
      if (this.cursors.left.isDown)
      {
        this.girl.setFlipX(true);
        this.girl.setVelocityX(-160);

        this.girl.anims.play('walking_x', true);
      }
      else if (this.cursors.right.isDown)
      {
        this.girl.setFlipX(false);

        this.girl.setVelocityX(160);

        this.girl.anims.play('walking_x', true);
      }
      else
      {
        this.girl.setFlipX(false);
        this.girl.setVelocityX(0);
      }

      if (this.cursors.up.isDown)
      {
        this.girl.setVelocityY(-160);

        this.girl.anims.play('walking_up', true);
      }
      else if (this.cursors.down.isDown)
      {
        this.girl.setVelocityY(160);

        this.girl.anims.play('walking_down', true);
      }
      else
      {
        this.girl.setVelocityY(0);

      }

      if(this.girl.body.velocity.x === 0 && this.girl.body.velocity.y === 0) {
        this.girl.anims.play('stopped');
      }
    }
}
