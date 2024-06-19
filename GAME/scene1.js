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
        this.load.spritesheet("lanternbar", "assets/lanternbar.png", { frameWidth: 100, frameHeight: 32 });
        this.load.image("light", "assets/light.png");
        this.load.image("menuButton", "assets/menuButton.png");
        this.load.image("playgameButton", "assets/playgameButton.png"); // Corrigido para incluir a extensão .png
        this.load.image("quitButton", "assets/quitButton.png"); // Certifique-se de que este arquivo existe
        //this.load.audio("music", "assets/sounds/music.mp3");
    }

    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.playgameButton = this.add.image(400, 300, "playgameButton").setInteractive();
        this.playgameButton.on('pointerdown', this.onplaygameButtonClicked, this); // Corrigido para usar 'pointerdown'
        this.quitButton = this.add.image(400, 450, "quitButton").setInteractive();
        this.quitButton.on('pointerdown', this.onquitButtonClicked, this); // Corrigido para usar 'pointerdown'

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
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23 }),
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

        this.anims.create({
            key: 'Lanternbar_0',
            frames: this.anims.generateFrameNumbers('lanternbar', { start: 0, end: 0 }), // Corrigido para lanternbar
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'Lanternbar_1',
            frames: this.anims.generateFrameNumbers('lanternbar', { start: 1, end: 1 }), // Corrigido para lanternbar
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'Lanternbar_2',
            frames: this.anims.generateFrameNumbers('lanternbar', { start: 2, end: 2 }), // Corrigido para lanternbar
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'Lanternbar_3',
            frames: this.anims.generateFrameNumbers('lanternbar', { start: 3, end: 3 }), // Corrigido para lanternbar
            frameRate: 10,
            repeat: 0
        });
    }

    onplaygameButtonClicked() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame"); // Corrigido para "playGame" ao invés de "PLayGame"
    }

    onquitButtonClicked(){
        close();
    }
}
