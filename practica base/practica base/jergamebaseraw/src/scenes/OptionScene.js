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
    }

    create() {
        const back_pause=this.add.image(400,300,'pausa');


        const resumeBtn = this.add.image(400, 320,'continuar').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => resumeBtn.setAlpha(0.5))
            .on('pointerout', () => resumeBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.resume('MenuScene');
            });

        const menuBtn = this.add.image(400, 420,'menu').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setAlpha(0.5))
            .on('pointerout', () => menuBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.stop('MenuScene');
                this.scene.start('MenuScene');
            });
    }
}
