export class Paddle {

    constructor(scene, id, x, y, img, color) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.speed = 300;
        this.direction=0;
        this.rotated=false;
        this.team=color;
        this.power = 0; //0 normal, 1 barrera, 2 disparo triple, 3 rebote y 4 más cadencia

        this.sprite = scene.physics.add.sprite(x, y, img);
        this.sprite.setDisplaySize(166.5 , 119 );
        this.sprite.setImmovable(false);
        this.sprite.setCollideWorldBounds(true);
    }
}