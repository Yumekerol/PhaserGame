class Scene2 extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    create(){
        this.background = this.add.image(0, 0,"background");
        this.background.setOrigin(0,0);

        this.lantern = this.add.image(35, 35, "lantern");
        this.lantern.setScale(1.2);
        //this.doce = this.add.image(100,100,"doce");

        this.cursors = this.input.keyboard.createCursorKeys();

        //this.doce.setScale(2);
        /*this.add.text(20,20,
                  "Playing Game")*/;

        this.positions = this.generateRandomPositions(16, 4, 190, 148);

        for (let i = 0; i < this.positions.length; i++) {
            const position = this.positions[i];
            if (Math.random() < 0.5) {  // 50% de chance para cada um
                this.add.image(position.x, position.y, "doce").setDepth(0);
            } else {
                this.add.image(position.x, position.y, "bomba").setDepth(0);
            }
        }

        for(let i = 0; i < 4; i++) {
          for(let j = 0; j<4; j++) {
            this.add.image(i*190 + 110, j*148 + 110, "card");
          }
        }

        this.girl = this.physics.add.sprite(200, 200, "girl");
    }

    generateRandomPositions(count, gridSize, xSpacing, ySpacing) {
        const positions = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                positions.push({ x: i * xSpacing + 100, y: j * ySpacing + 100 });
            }
        }
        // Embaralha as posições
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        return positions.slice(0, count);
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
