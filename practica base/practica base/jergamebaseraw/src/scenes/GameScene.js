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
        // Hit sound
        this.load.audio('hit', 'assets/audio/hit.mp3');

        // Background music
        this.load.audio('music', 'assets/audio/music.mp3');
    }

    create() {
        // Looping background music
        this.music = this.sound.add('music', { loop: true, volume: 0.3 });
        this.music.play();

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
        this.scoreLeft = this.add.text(200, 50, '0', { fontSize: '48px' }).setOrigin(0.5);
        this.scoreRight = this.add.text(600, 50, '0', { fontSize: '48px' }).setOrigin(0.5);

        // Collisions on all sides 
        this.physics.world.setBoundsCollision(true, true, true, true);

        // Create the box
        this.createBall();

        // Launch the ball
        this.resetBall();

        // Setup players
        this.setUpPlayers();

        this.createBlocks();

        // Setup collisions
        this.players.forEach(paddle => {
            this.physics.add.collider(this.ball, paddle.sprite, () => {
                this.sound.play('hit');
            });
        });

        // Pause with ESC and show the pause menu on top
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    setUpPlayers() {
        const player1 = new Paddle(this, 'player1', 50, 300,'tanque_R',1);
        const player2 = new Paddle(this, 'player2', 750, 300,'tanque_A',2);
        player2.sprite.rotation=Math.PI;
        
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

    createBlocks(){
        const block1= new Block(this,'bloque 1',250,0,100,100,'bloque S',0x25d646);
        const block2= new Block(this,'bloque 2',250,600,100,100,'bloque S',0xff0004);
        const block3= new Block(this,'bloque 3',250,460,100,100,'bloque S',0xff0004);
        const block4= new Block(this,'bloque 4',250,370,100,100,'bloque S',0xffe803);
        const block5= new Block(this,'bloque 5',160,600,100,100,'bloque S',0x75fff8);

        const block6 = new Block(this, 'bloque 6', 550, 0,  100, 100, 'bloque S', 0x0086ff);
        const block7 = new Block(this, 'bloque 7', 550, 140, 100, 100, 'bloque S', 0x0086ff);
        const block8 = new Block(this, 'bloque 8', 550, 230, 100, 100, 'bloque S', 0x25d646);
        const block9 = new Block(this, 'bloque 9', 550, 600, 100, 100, 'bloque S', 0xffe803);
        const block10 = new Block(this, 'bloque 10', 640, 0, 100, 100, 'bloque S', 0xff75ea);
        this.blocks = [block1, block2, block3, block4, block5, block6, block7, block8, block9, block10];
    }

    shoot(paddle) {
        const offset = 35;
        const spawnX = paddle.sprite.x + Math.cos(paddle.sprite.rotation) * offset;
        const spawnY = paddle.sprite.y + Math.sin(paddle.sprite.rotation) * offset;

        const proyectile = new Ball(this, 'proyectile', spawnX, spawnY,paddle.team);
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
            });


        });
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
        this.time.delayedCall(2000, () => this.launchBall());
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

        if (this.leftGoals + this.rightGoals >= 3) {
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

        const winnerText = winnerId === 'player1' ? 'Player 1 Wins!' : 'Player 2 Wins!';
        this.add.text(400, 250, winnerText, { fontSize: '48px' }).setOrigin(0.5);

        const menuBtn = this.add.text(400, 350, 'Menu', { fontSize: '32px', color: '#00ff00' }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setStyle({ color: '#ffff00' }))
            .on('pointerout', () => menuBtn.setStyle({ color: '#00ff00' }))
            .on('pointerdown', () => this.scene.start('MenuScene'));
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
