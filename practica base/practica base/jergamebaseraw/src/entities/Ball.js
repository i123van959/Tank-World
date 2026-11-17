export class Ball {

    constructor(scene, id, x, y) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.speed = 300;
        this.direction=0;
        this.rotated=false;


        this.sprite = scene.physics.add.image(50, 50, 'ball');
        this.sprite.setDisplaySize(20, 20);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
    }
}