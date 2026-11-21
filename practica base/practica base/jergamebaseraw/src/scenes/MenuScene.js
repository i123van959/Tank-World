import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
    // Load assets
    // Hit sound

    // Background music
    this.load.audio('music1', 'assets/audio/menu.mp3');
    }

    create() {
        this.add.text(400, 150, 'PONG', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 320, 'Local Play', {
            fontSize: '32px',
            color: '#00ff00'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => localBtn.setStyle({ color: '#ffff00' }))
            .on('pointerout', () => localBtn.setStyle({ color: '#00ff00' }))
            .on('pointerdown', () => {
                this.music1.stop();
                this.scene.start('GameScene');
            });
        
        this.music1 = this.sound.add('music1', { loop: true, volume: 0.3 });
        this.music1.play();
    }
}
