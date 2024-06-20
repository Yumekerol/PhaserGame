class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/chao.png");
        this.load.image("lantern", "assets/lantern.png");
        this.load.image("doce", "assets/doce.png");
        this.load.image("bomba", "assets/bomba.png");
        this.load.image("card", "assets/card.png");
        this.load.spritesheet("candybar", "assets/candybar.png", { frameWidth: 100, frameHeight: 32 });
        this.load.spritesheet("girl", "assets/meninarosa.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("explosion", "assets/explosion.png", { frameWidth: 700, frameHeight: 500 });
        this.load.image("light", "assets/light.png");
        this.load.image("menuButton", "assets/menuButton.png");
        this.load.image("playgameButton", "assets/playgameButton.png");
        this.load.image("quitButton", "assets/quitButton.png");
        this.load.image("tittle", "assets/tittle.png");
        this.load.image("questionButton", "assets/questionButton.png");
        this.load.image("explanation", "assets/explanation.png");
        this.load.spritesheet("idleGirl", "assets/idleGirl.png",{ frameWidth: 64, frameHeight: 64 })
        this.load.image('Victory', "assets/Victory.png");
        this.load.image("GameOver", "assets/GameOver.png");
        this.load.audio("musicGame", "assets/sounds/musicGame.mp3");
        this.load.audio("musicMenu", "assets/sounds/musicMenu.mp3");
    }

    create() {
        this.musicMenu = this.sound.add("musicMenu");
        var musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.musicMenu.play(musicConfig);

        this.background = this.add.image(0, 0, "background").setInteractive();
        this.background.setOrigin(0, 0);
        this.background.on('pointerdown', (pointer) => {
            if (this.explanation.visible) {
                const bounds = this.explanation.getBounds();
                if (!bounds.contains(pointer.x, pointer.y)) {
                    this.explanation.setVisible(false);
                }
            }
        });

        this.idleGirl = this.add.sprite(700, 500, "idleGirl");
        this.idleGirl.setScale(3);
        this.playgameButton = this.add.image(400, 300, "playgameButton").setInteractive();
        this.playgameButton.on('pointerdown', this.onplaygameButtonClicked, this);
        this.quitButton = this.add.image(400, 450, "quitButton").setInteractive();
        this.quitButton.on('pointerdown', this.onquitButtonClicked, this);

        this.questionButton = this.add.image(760, 35, "questionButton").setInteractive();
        this.questionButton.on('pointerdown', this.onquestionButtonClicked, this);

        this.tittle = this.add.image(400, 100, "tittle");
        this.explanation = this.add.image(400, 300, "explanation");
        this.explanation.setVisible(false);

        this.anims.create({
            key:'idle',
            frames:this.anims.generateFrameNumbers('idleGirl', {start:0, end: 7}),
            frameRate: 5,
            repeat: -1
        })
        this.idleGirl.play('idle', true);

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

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'fillCandybar_0',
            frames: this.anims.generateFrameNumbers('candybar', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fillCandybar_1',
            frames: this.anims.generateFrameNumbers('candybar', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fillCandybar_2',
            frames: this.anims.generateFrameNumbers('candybar', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fillCandybar_3',
            frames: this.anims.generateFrameNumbers('candybar', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

    }

    onplaygameButtonClicked() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");
        this.musicMenu.stop();
    }

    onquestionButtonClicked(){
        this.explanation.setVisible(true);
    }
    onquitButtonClicked(){
        close();
    }
}
