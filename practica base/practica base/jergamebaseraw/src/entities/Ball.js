export class Ball {

    constructor(scene, id, x, y,color) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.speed = 300;
        this.direction=0;
        this.rotated=false;
        this.team=color

        this.sprite = scene.physics.add.image(x, y, 'ball');
        if(this.team==1){
            this.sprite.setTint(0xff0000);
        }else{
            this.sprite.setTint(0x1883ff);
        }
        
        this.sprite.setDisplaySize(20, 20);
        this.sprite.setImmovable(true);
        //this.sprite.setCollideWorldBounds(true);
    }
}