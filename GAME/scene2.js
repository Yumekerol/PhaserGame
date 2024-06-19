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


        this.lantern = this.add.image(35, 30, "lantern");
        this.lantern.setScale(1.25);

        this.lanternbar = this.add.sprite(120, 35, "lanternbar");
        this.lanternbar.setScale(1.2);

        this.candybar = this.add.sprite(650, 30, "candybar");
        this.candybar.setScale(1.8);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.positions = this.generateRandomPositions(16, 4, 190, 148);

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

        this.light = this.add.image(100, 250, "light");
        this.light.setScale(1.2);
        this.light.alpha = 0.5;
        this.light.setVisible(false);

        this.input.keyboard.on('keydown-SPACE', this.jump, this);
        this.input.keyboard.on('keydown-L', this.highlightRandomCandyCard, this);

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
                            this.scene.start("bootGame");
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
                            }
                        });
                    }

                    this.time.delayedCall(200, () => {
                        card.destroy(); // Remove a carta
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
    }

    triggerExplosion(x, y, onComplete) {
        this.explosion.setPosition(x, y);
        this.explosion.setVisible(true);

        this.explosion.play('explode', true);

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
        this.updateLanternbar();
    }
    updateLanternbar() {
        const frame = Math.min(this.lightUses, 3); // Garante que o frame nunca passa de 3
        this.lanternbar.setFrame(frame);
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
                            duration: 500
                        });
                        content.setVisible(false);
                    });
                }
            });
        });
    }


    update() {
        if (this.cursors.left.isDown) {
            this.girl.setFlipX(true);
            this.girl.setVelocityX(-160);
            this.girl.anims.play('walking_x', true);
        } else if (this.cursors.right.isDown) {
            this.girl.setFlipX(false);
            this.girl.setVelocityX(160);
            this.girl.anims.play('walking_x', true);
        } else {
            this.girl.setFlipX(false);
            this.girl.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.girl.setVelocityY(-160);
            this.girl.anims.play('walking_up', true);
        } else if (this.cursors.down.isDown) {
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
        console.log('Botão clicado!');
        this.scene.start("bootGame");
    }

}
