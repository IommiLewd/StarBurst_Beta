class Preload extends Phaser.State {
    preload() {

        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // Images :
   
        this.load.image('player', 'img/Badger.png');
        this.load.image('bullet', 'img/bullet2.png');
        this.load.image('gun', 'img/gun.png');
        
        
        this.load.image('flame', 'img/flame.png');
        this.load.image('background', 'img/testBackground.png');
        this.load.image('Overlay', 'img/testOverlay.png');
        this.load.spritesheet('blueFlame', 'img/blueFlameSpritesheet.png', 10, 10, 3);
        this.load.spritesheet('redFlame', 'img/blueFlameSpritesheet.png', 10, 10, 3);


        // js scripts :
        this.load.script('player', 'js/entity/player.js');
        this.load.script('simpleLevel', 'js/map/simplelevel.js');
        this.load.script('smallEnemy', 'js/entity/smallEnemy.js');
        this.load.script('UserInterface', 'js/entity/userInterface.js');

        // Pointers :
         this.load.image('pointer', 'img/laserPointer.png');
         this.load.image('redpointer', 'img/redlaserPointer.png');
        
        //Ui stuff
        this.load.image('statusUi', 'img/Ui/statusUi.png');
        this.load.image('redPixel', 'img/Ui/redPixel.png');
        this.load.image('bluePixel', 'img/Ui/bluePixel.png');
        this.load.image('gameOverMenu', 'img/Ui/gameOverMenu.png');
        //this.load.image('restartUp', 'img/Ui/restartGameUp.png');
        this.load.spritesheet('restartButton', 'img/Ui/GOrestart.png', 314, 46, 2);
        this.load.spritesheet('menuButton', 'img/Ui/GOmenu.png', 282, 46, 2);
    }
    create() {
        console.log("Preload.js:  Preload.create-> load_Level");
        this.game.state.add('SimpleLevel', SimpleLevel);
        this.game.state.start('SimpleLevel');
    }

}