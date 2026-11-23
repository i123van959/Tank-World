import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Load assets
        this.load.image('fondo_menu','assets/images/boceto_menu_principal fondo.png')
        this.load.image('logo','assets/images/logo tank world.png')
        this.load.image('local','assets/images/juego local.png')
        this.load.image('linea','assets/images/juego en linea.png')
        this.load.image('opciones','assets/images/opciones.png')
        this.load.image('creditos','assets/images/creditos.png')
        this.load.image('salir','assets/images/salir.png')
        // Hit sound

        // Background music
        this.load.audio('music1', 'assets/audio/menu.mp3');
    }

    create() {
        
        const background =this.add.image(400, 300, 'fondo_menu');
        background.setDisplaySize(800,600);
        const title=this.add.image(400, 150, 'logo');
        title.setDisplaySize(532.67,200);

        const localBtn = this.add.image(250, 320, 'local').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => localBtn.setAlpha(0.9))
            .on('pointerout', () => localBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.start('GameScene');
            });
        const globalBtn = this.add.image(550, 320, 'linea').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => globalBtn.setAlpha(0.9))
            .on('pointerout', () => globalBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.start('GameScene');
            });
        const optionsBtn = this.add.image(250, 420, 'opciones').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => optionsBtn.setAlpha(0.9))
            .on('pointerout', () => optionsBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.pause;
                this.scene.launch('OptionScene');
            });
        const creditsBtn = this.add.image(550, 420, 'creditos').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditsBtn.setAlpha(0.9))
            .on('pointerout', () => creditsBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.pause;
                this.scene.launch('CreditsScene');
            });
        const closeBtn = this.add.image(400, 520, 'salir').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => closeBtn.setAlpha(0.9))
            .on('pointerout', () => closeBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.start('GameScene');
            });
        this.music1 = this.sound.add('music1', { loop: true, volume: 0.3 });
        this.music1.play();
    }
}
