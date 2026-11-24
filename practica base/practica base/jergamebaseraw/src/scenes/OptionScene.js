import Phaser from 'phaser';

export class OptionScene extends Phaser.Scene {
    constructor() {
        super('OptionScene');
    }

    preload(){
        this.load.image('menu', 'assets/images/menu.png')
        this.load.image('pausa', 'assets/images/pausa.png')
        this.load.image('opciones', 'assets/images/opciones.png')
        this.load.image('continuar', 'assets/images/continuar.png')
        this.load.image('mas', 'assets/images/mas.png')
        this.load.image('menos', 'assets/images/menos.png')
        this.load.image('fondoOp', 'assets/images/fondo opciones.png')

        this.load.audio('music1', 'assets/audio/menu.mp3');
    }

    create() {
        const back_options=this.add.image(400,300,'fondoOp');
        this.music1 = this.sound.add('music1', { loop: true, volume: 0.3 });
        this.music1.play();

        const masVolBtn = this.add.image(220, 200,'mas').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => masVolBtn.setAlpha(0.5))
            .on('pointerout', () => masVolBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.sound.volume = Math.min(1, Math.round((this.sound.volume + 0.1) * 10) / 10);
            });

        const menosVolBtn = this.add.image(600, 200,'menos').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menosVolBtn.setAlpha(0.5))
            .on('pointerout', () => menosVolBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.sound.volume = Math.min(1, Math.round((this.sound.volume - 0.1) * 10) / 10);
            });


        const menuBtn = this.add.image(400, 565,'menu').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setAlpha(0.5))
            .on('pointerout', () => menuBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.stop('OptionScene');
                this.scene.start('MenuScene');
            });
        menuBtn.setScale(0.7,0.7);
    }
}
