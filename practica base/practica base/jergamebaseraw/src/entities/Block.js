export class Block {

    constructor(scene, id, x, y,w,h, img, color) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.speed = 300;
        // el grande 170 x 88 el pequeño 88x88
        this.width= w;
        this.heigth= h;
        this.sprite = scene.physics.add.sprite(x, y, img);
        this.sprite.setTint(color);
        this.sprite.setDisplaySize(this.width,this.heigth);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
    }
}