class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.isJumping = false;
        this.candycollected = 0;
        this.totalcandy = 0;
        this.lightUses = 0;
        this.maxLightUses = 3;
    }

    create() {

        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);


        this.lantern1 = this.add.image(35, 30, "lantern");
        this.lantern1.setScale(1.25);

        this.lantern2 = this.add.image(85, 30, "lantern");
        this.lantern2.setScale(1.25);

        this.lantern3 = this.add.image(135, 30, "lantern");
        this.lantern3.setScale(1.25);


        this.candybar = this.add.sprite(650, 30, "candybar");
        this.candybar.setScale(1.8);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.positions = this.generateRandomPositions(16, 4, 190, 150);

        this.cards = this.physics.add.group();

        for (let i = 0; i < this.positions.length; i++) {
            const position = this.positions[i];
            const card = this.cards.create(position.x, position.y, "card");
            card.setImmovable(true);
            card.setData("revealed", false);

            if (Math.random() < 0.5) {
                const doce = this.add.image(position.x, position.y, "doce").setVisible(false);
                card.setData("content", doce);
                card.setData("type", "doce");
                this.totalcandy++; // Incrementa o total de doces
            } else {
                const bomba = this.add.image(position.x, position.y, "bomba").setVisible(false);
                card.setData("content", bomba);
                card.setData("type", "bomba");
            }
        }


        this.girl = this.physics.add.sprite(200, 200, "girl");
        this.physics.add.collider(this.girl, this.cards, this.revealCard, null, this);
        this.revealAllCardsTemporarily();

        this.light = this.add.image(100, 250, "light").setVisible(false);
        this.light.setScale(1.2);
        this.light.alpha = 0.5;

        this.musicGame = this.sound.add("musicGame");
        var musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.musicGame.play(musicConfig);

        this.GameOver = this.add.image(400, 300, "GameOver").setVisible(false);
        this.GameOver.alpha = 0.7;
        this.Victory = this.add.image(400, 300, "Victory").setVisible(false);
        this.Victory.alpha = 0.7;

        this.input.keyboard.on('keydown-E', this.jump, this);
        this.input.keyboard.on('keydown-Q', this.highlightRandomCandyCard, this);

        this.explosion = this.add.sprite(0, 0, "explosion").setVisible(false);

        this.menuButton = this.add.image(760, 35, "menuButton").setInteractive();
        this.menuButton.on('pointerdown', this.onButtonClicked, this);

    }


    generateRandomPositions(count, gridSize, xSpacing, ySpacing) {
        const positions = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                positions.push({ x: i * xSpacing + 100, y: j * ySpacing + 100 });
            }
        }
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        return positions.slice(0, count);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.girl.setVelocityY(-200);
            this.time.delayedCall(500, () => {
                this.isJumping = false;
            });
        }
    }

    revealCard(girl, card) {
        if (this.isJumping && !card.getData("revealed")) {
            card.setData("revealed", true);

            const content = card.getData("content");
            const cardType = card.getData("type");

            this.tweens.add({
                targets: card,
                y: card.y - 50,
                duration: 300,
                onComplete: () => {
                    content.setVisible(true);

                    if (cardType === "bomba") {
                        console.log("Bomba revelada! Explosao");
                        this.triggerExplosion(content.x, content.y, () => {
                            this.menuButton.setVisible(false);
                            this.GameOver.setVisible(true);
                            setTimeout(() => {
                                this.scene.start("bootGame");
                                this.musicGame.stop();
                                this.lightUses = 0;
                            }, 2000);
                        });
                    } else {
                        console.log("Doce revelado!");
                        this.candycollected++;
                        this.animateCandybar();
                        this.tweens.add({
                            targets: content,
                            x: this.candybar.x,
                            y: this.candybar.y,
                            duration: 500,
                            scaleX: 0.1,
                            scaleY: 0.1,
                            onComplete: () => {
                                content.destroy();
                                this.animateCandybar();
                                if (this.candycollected === this.totalcandy) {
                                    this.menuButton.setVisible(false);
                                    this.Victory.setVisible(true);
                                    setTimeout(() => {
                                        this.scene.start("bootGame");
                                        this.musicGame.stop();
                                        this.lightUses = 0;
                                    }, 2000);
                                }
                            }
                        });
                    }
                    this.time.delayedCall(200, () => {
                        card.destroy();
                    });
                }
            });
        }
    }

    animateCandybar() {
        const proportion = this.candycollected / this.totalcandy;

        let frameIndex = 0;
        if (proportion <= 0.5) {
            frameIndex = 1;
        } else if (proportion > 0.5 && proportion < 1) {
            frameIndex = 2;
        } else if (proportion == 1) {
            frameIndex = 3;
        }

        frameIndex = Math.min(frameIndex, 3);

        this.candybar.anims.stop();
        this.candybar.anims.play(`fillCandybar_${frameIndex}`, true);

        this.collectcandy = this.sound.add("collectcandy");
        var musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.collectcandy.play(musicConfig);
    }

    triggerExplosion(x, y, onComplete) {
        this.explosion.setPosition(x, y);
        this.explosion.setVisible(true);

        this.explosion.play('explode', true);
        this.explosionsound = this.sound.add("explosionsound");
        var musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.explosionsound.play(musicConfig);

        this.explosion.on('animationcomplete', () => {
            this.explosion.setVisible(false);
            if (onComplete) {
                onComplete();
            }
        }, this);
    }
    highlightRandomCandyCard() {
        if (this.lightUses >= this.maxLightUses) {
            console.log("Já usaste todas as iluminações possíveis.");
            return;
        }
        const candyCards = this.cards.getChildren().filter(card => card.getData("type") === "doce" && !card.getData("revealed"));

        if (candyCards.length === 0) {
            console.log("Não há mais cartas com doces disponíveis.");
            return;
        }
        const randomIndex = Phaser.Math.Between(0, candyCards.length - 1);
        const selectedCard = candyCards[randomIndex];

        this.light.setPosition(selectedCard.x, selectedCard.y);
        this.light.setVisible(true);
        this.time.delayedCall(2000, () => {
            this.light.setVisible(false);
        });

        this.lightUses++;
        this.updateLanternVisibility();
    }

    updateLanternVisibility() {
        if (this.lightUses >= 1) {
            this.lantern3.setVisible(false);
        }
        if (this.lightUses >= 2) {
            this.lantern2.setVisible(false);
        }
        if (this.lightUses >= 3) {
            this.lantern1.setVisible(false);
        }
    }

    revealAllCardsTemporarily() {
        this.cards.getChildren().forEach(card => {
            const originalX = card.x;
            const content = card.getData("content");
            this.tweens.add({
                targets: card,
                x: card.x - 100,
                duration: 500,

                onComplete: () => {
                    content.setVisible(true);

                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: card,
                            x: originalX,
                            duration: 1000
                        });
                        content.setVisible(false);
                    });
                }
            });
        });
    }


    update() {
        if (this.input.keyboard.addKey('A').isDown) {
            this.girl.setFlipX(true);
            this.girl.setVelocityX(-160);
            this.girl.anims.play('walking_x', true);
        } else if (this.input.keyboard.addKey('D').isDown) {
            this.girl.setFlipX(false);
            this.girl.setVelocityX(160);
            this.girl.anims.play('walking_x', true);
        } else {
            this.girl.setFlipX(false);
            this.girl.setVelocityX(0);
        }

        if (this.input.keyboard.addKey('W').isDown) {
            this.girl.setVelocityY(-160);
            this.girl.anims.play('walking_up', true);
        } else if (this.input.keyboard.addKey('S').isDown) {
            this.girl.setVelocityY(160);
            this.girl.anims.play('walking_down', true);
        } else {
            this.girl.setVelocityY(0);
        }

        if (this.girl.body.velocity.x === 0 && this.girl.body.velocity.y === 0) {
            this.girl.anims.play('stopped');
        }
    }

    onButtonClicked() {
        this.scene.start("bootGame");
        this.musicGame.stop();
        this.lightUses = 0;
    }

}
