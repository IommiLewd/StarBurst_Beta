class Obstacles extends Phaser.Sprite {
    constructor(game, posx, posy, key) {
        super(game, posx, posy, 'player', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
      
 
       
    }

    update() {

    }
}
