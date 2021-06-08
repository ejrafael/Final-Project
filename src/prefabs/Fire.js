class Fire extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, direction){
        super(scene, x, y, 'EnvironmentAtlas');
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world

        this.body.setSize(this.width/4, this.height/4, false);
        // this.body.setOffset(0,0);

        scene.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Fire',
                start: 1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,

        });
        scene.anims.create({
            key: 'flameside',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Fire_Side',
                start:1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,
        });
        switch(direction){
            case 'left':
                this.play('flameside');
                this.setFlip(true, false);
                break;
            case 'right':
                this.play('flameside');
                break;
            case 'up':
                this.play('flame');
                break;
            case 'down':
                this.setFlip(false, true);
                this.play('flame');
                break;
        }
        // this.play('flame');

        scene.physics.add.collider(scene.player, this, () => {
            if(scene.playerFSM.state != "hurt") {
                console.log("Hurt player");
                scene.playerFSM.transition('hurt');
            }
        })
    }
}