export class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super('HowToPlayScene');
    }

    preload(){
        this.load.image('menu', 'assets/images/menu.png')
        this.load.image('pausa', 'assets/images/pausa.png')
        this.load.image('opciones', 'assets/images/opciones.png')
        this.load.image('continuar', 'assets/images/continuar.png')
        this.load.image('fondo como jugar', 'assets/images/como jugar.png')

        this.load.audio('music1', 'assets/audio/menu.mp3');
    }

    create() {
        const back_htplay=this.add.image(400,300,'fondo como jugar');
        this.music1 = this.sound.add('music1', { loop: true, volume: 0.3 });
        this.music1.play();

        const menuBtn = this.add.image(400, 565,'menu').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setAlpha(0.5))
            .on('pointerout', () => menuBtn.setAlpha(1))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.stop('HowToPlayScene');
                this.scene.start('MenuScene');
            });
        menuBtn.setScale(0.7,0.7);
    }
}