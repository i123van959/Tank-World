export class Powerup {

    constructor(scene, id, x, y,w,h, img, power) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.speed = 300;
        this.width= w;
        this.heigth= h;
        this.power = power;
        this.sprite = scene.physics.add.sprite(x, y, img);
        this.sprite.setDisplaySize(this.width,this.heigth);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
    }
}