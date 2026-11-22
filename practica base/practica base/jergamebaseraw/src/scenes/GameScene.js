import Phaser from 'phaser';
import { Paddle } from '../entities/Paddle';
import { Ball } from '../entities/Ball';
import { Block } from '../entities/Block';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.players = new Map();
        this.balls = new Set();
        this.inputMappings = [];
    }

    preload() {
        // Load assets
        this.load.image('tanque_R', 'assets/images/tanque rojo.png')
        this.load.image('tanque_A', 'assets/images/tanque azul.png')
        this.load.image('bloque S', 'assets/images/bloque blanco mini.png')
        this.load.image('bloque M', 'assets/images/bloque blanco grande.png')

        this.load.image('puntos_R', 'assets/images/contador rojo.png')
        this.load.image('puntos_A', 'assets/images/contador azul.png')

        this.load.image('victoria_R', 'assets/images/victoria1.png')
        this.load.image('victoria_A', 'assets/images/victoria2.png')

        this.load.image('menu', 'assets/images/menu.png')
        this.load.image('opciones', 'assets/images/opciones.png')

        this.load.image('suelo1', 'assets/images/suelo.png')
        // Hit sound
        this.load.audio('hit', 'assets/audio/hit.mp3');

        // Background music
        this.load.audio('music', 'assets/audio/game.mp3');
        this.load.audio('music2', 'assets/audio/der.mp3');
    }

    create() {
        // Looping background music
        this.music = this.sound.add('music', { loop: true, volume: 0.3 });
        this.music.play();
        this.music2 = this.sound.add('music2', { loop: true, volume: 0.3 });
        const suelo = this.add.tileSprite(400, 300, 800, 600, 'suelo1')
        suelo.setTileScale(0.5, 0.5);
        // Pause/resume the music with the scene and stop it on exit
        this.events.on('pause', () => this.music.pause());
        this.events.on('resume', () => this.music.resume());
        this.events.once('shutdown', () => {
            this.events.off('pause');
            this.events.off('resume');
            this.music.destroy();
        });

        this.leftGoals = 0;
        this.rightGoals = 0;

        // Add mid line
        for (let i = 0; i < 12; i++) {
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0x666666);
        }

        // Scores


        // Collisions on all sides 
        this.physics.world.setBoundsCollision(true, true, true, true);

        // Create the box
        this.createBall();

        // Launch the ball
        this.resetBall();

        // Setup players
        this.setUpPlayers();

        this.createBlocks();

        const scoreCounter1 = this.add.image(100, 550, 'puntos_R')
        scoreCounter1.setAlpha(0.7);
        this.scoreRight = this.add.text(100, 550, '0', { fontSize: '48px' }).setOrigin(0.5);
        const scoreCounter2 = this.add.image(700, 50, 'puntos_A')
        scoreCounter2.setAlpha(0.7);
        this.scoreLeft = this.add.text(700, 50, '0', { fontSize: '48px' }).setOrigin(0.5);

        // Setup collisions
        this.players.forEach(paddle => {
            this.physics.add.collider(this.ball, paddle.sprite, () => {
                this.sound.play('hit');
            });
        });

        for (var i = 0; i < 10; i++) {
            this.players.forEach(paddle => {
                this.physics.add.collider(this.blocks[i].sprite, paddle.sprite, () => {
                    this.sound.play('hit');
                });
            });
        }


        // Pause with ESC and show the pause menu on top
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    setUpPlayers() {
        const player1 = new Paddle(this, 'player1', 50, 300, 'tanque_R', 1);
        const player2 = new Paddle(this, 'player2', 750, 300, 'tanque_A', 2);
        player2.sprite.rotation = Math.PI;

        this.players.set(player1.id, player1);
        this.players.set(player2.id, player2);

        const Keys = Phaser.Input.Keyboard.KeyCodes;
        this.inputMappings = [
            { paddle: player1, up: Keys.W, down: Keys.S, right: Keys.D, left: Keys.A, act: Keys.F },
            { paddle: player2, up: Keys.UP, down: Keys.DOWN, right: Keys.RIGHT, left: Keys.LEFT, act: Keys.SPACE }
        ].map(mapping => ({
            paddle: mapping.paddle,
            upKey: this.input.keyboard.addKey(mapping.up),
            downKey: this.input.keyboard.addKey(mapping.down),
            rightKey: this.input.keyboard.addKey(mapping.right),
            leftKey: this.input.keyboard.addKey(mapping.left),
            actKey: this.input.keyboard.addKey(mapping.act),
            coolDown: 0
        }));
    }

    createBlocks() {
        const block1 = new Block(this, 'bloque 1', 250, 0, 100, 100, 'bloque S', 0x25d646);
        const block2 = new Block(this, 'bloque 2', 250, 600, 100, 100, 'bloque S', 0xff0004);
        const block3 = new Block(this, 'bloque 3', 250, 460, 100, 100, 'bloque S', 0x75fff8);
        const block4 = new Block(this, 'bloque 4', 250, 370, 100, 100, 'bloque S', 0xffe803);
        const block5 = new Block(this, 'bloque 5', 160, 600, 100, 100, 'bloque S', 0x75fff8);

        const block6 = new Block(this, 'bloque 6', 550, 0, 100, 100, 'bloque S', 0x0086ff);
        const block7 = new Block(this, 'bloque 7', 550, 140, 100, 100, 'bloque S', 0xff75ea);
        const block8 = new Block(this, 'bloque 8', 550, 230, 100, 100, 'bloque S', 0x25d646);
        const block9 = new Block(this, 'bloque 9', 550, 600, 100, 100, 'bloque S', 0xffe803);
        const block10 = new Block(this, 'bloque 10', 640, 0, 100, 100, 'bloque S', 0xff75ea);

        this.blocks = [block1, block2, block3, block4, block5, block6, block7, block8, block9, block10];
    }

    shoot(paddle) {
        const offset = 35;
        const spawnX = paddle.sprite.x + Math.cos(paddle.sprite.rotation) * offset;
        const spawnY = paddle.sprite.y + Math.sin(paddle.sprite.rotation) * offset;

        const proyectile = new Ball(this, 'proyectile', spawnX, spawnY, paddle.team);
        this.balls.add(proyectile);
        proyectile.sprite.setVelocity(
            Math.cos(paddle.sprite.rotation) * (paddle.speed + 250),
            Math.sin(paddle.sprite.rotation) * (paddle.speed + 250)
        );

        this.players.forEach(target => {
            if (target.id === paddle.id) return;

            this.physics.add.collider(proyectile.sprite, target.sprite, () => {
                this.sound.play('hit');
                proyectile.sprite.destroy();
                if (proyectile.team == 1) {
                    this.rightGoals += 1;
                    this.goal();
                } else if (proyectile.team == 2) {
                    this.leftGoals += 1;
                    this.goal();
                }
            });


        });
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
        this.time.delayedCall(2000, () => this.launchBall());
        this.players.forEach(paddle => {
            if (paddle.team == 1) {
                paddle.sprite.setPosition(50, 300);
                paddle.sprite.rotation = Math.PI * 2;
            }
            else if (paddle.team == 2) {
                paddle.sprite.setPosition(750, 300);
                paddle.sprite.rotation = Math.PI;
            }
        });

    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 400;
        const direction = Math.random() < 0.5 ? 1 : -1;

        //const speedX = Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction;
        //const speedY = Math.sin(Phaser.Math.DegToRad(angle)) * speed;
        //this.ball.setVelocity(
        //    speedX, speedY
        //);
    }

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.image(400, 300, 'ball').setOrigin(0.5);
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);

    }

    goal() {
        this.scoreRight.setText(this.rightGoals.toString());
        this.scoreLeft.setText(this.leftGoals.toString());

        if (this.rightGoals >= 3 || this.leftGoals >= 3) {
            const winnerId = this.leftGoals > this.rightGoals ? 'player1' : 'player2';
            this.endGame(winnerId);
        } else {
            this.resetBall();
        }
    }

    endGame(winnerId) {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
        this.ball.setVisible(false);
        this.players.forEach(paddle => { paddle.sprite.setVelocity(0, 0); });
        this.physics.pause();
        this.music.stop();
        this.music2.play();

        if (winnerId == 'player2') {
            const win = this.add.image(400, 300, 'victoria_R')
            const menuBtn = this.add.image(650, 500, 'menu').setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => menuBtn.setAlpha(0.9))
                .on('pointerout', () => menuBtn.setAlpha(1))
                .on('pointerdown', () => {
                    this.music2.stop();
                    this.scene.start('MenuScene');
                });
            menuBtn.setDisplaySize(148, 48.67);
        } else if (winnerId == 'player1') {
            const win = this.add.image(400, 300, 'victoria_A')
            const menuBtn = this.add.image(150, 500, 'menu').setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => menuBtn.setAlpha(0.9))
                .on('pointerout', () => menuBtn.setAlpha(1))
                .on('pointerdown', () => {
                    this.music2.stop();
                    this.scene.start('MenuScene');
                });
            menuBtn.setDisplaySize(148, 48.67);
        }
    }

    update(time, delta) {
        const turnSpeed = 3;
        const dt = delta / 1000;

        this.inputMappings.forEach(mapping => {
            const paddle = mapping.paddle;

            if (mapping.coolDown > 0) {
                mapping.coolDown -= delta;
            }

            if (mapping.leftKey.isDown) {
                paddle.sprite.rotation -= turnSpeed * dt;
            } else if (mapping.rightKey.isDown) {
                paddle.sprite.rotation += turnSpeed * dt;
            }
            if (mapping.upKey.isDown) {
                paddle.sprite.setVelocity(
                    Math.cos(paddle.sprite.rotation) * paddle.speed,
                    Math.sin(paddle.sprite.rotation) * paddle.speed
                );

            } else if (mapping.downKey.isDown) {
                paddle.sprite.setVelocity(
                    -Math.cos(paddle.sprite.rotation) * paddle.speed,
                    -Math.sin(paddle.sprite.rotation) * paddle.speed
                );
            } else {
                paddle.sprite.setVelocity(0, 0);
            }

            if (mapping.actKey.isDown && mapping.coolDown <= 0) {
                this.shoot(paddle);
                mapping.coolDown = 1000;
            }
        });

        // Game loop
        if (this.ball.x < 0) {
            this.rightGoals += 1;
            this.goal();
        } else if (this.ball.x > 800) {
            this.leftGoals += 1;
            this.goal();
        }

        for (const ball_i of this.balls) {
            if (ball_i.sprite.x > 800 || ball_i.sprite.x < 0 || ball_i.sprite.y > 600 || ball_i.sprite.y < 0) {
                ball_i.sprite.destroy();
            }
        }


    }
}
