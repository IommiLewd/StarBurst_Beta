class MainMenu extends Phaser.State {
    constructor() {
        super();
        this.textTimer = 0;
        this.startTextAlive = false;
    }
    
    
    _loadMenuItems(){
        this.titleBackground = this.game.add.image(0,0, 'titleBackground');
        this.titleBackground.alpha = 0.0;
        this.tween = game.add.tween(this.titleBackground);
        this.tween.to({ y: -90, alpha: 1.0 }, 5000, 'Linear', true, 0);
            this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
                this._addTitleText();
            }, this);
    }
    
    _loadMainMenu(){
        this.startTextAlive = false;
        this.startText.destroy();
       this.startMenuImage = this.game.add.image(460,360, 'titleMenuImage');
        this.startMenuImage.anchor.setTo(0.5);
        this.startNewGame = this.game.add.button(460, 346, 'startNewGame', function () {this.game.state.start('SimpleLevel');}, this, 1, 2, 0);
        this.startNewGame.anchor.setTo(0.5);
        
        
     
        this.copyright = this.game.add.text(830, 620, '2017 Tommy Nielsen', {
            font: "8px Press Start 2P",
            fill: '#ffffff',
            boundsAlignW: "right"
        }); 
        this.copyright.anchor.setTo(0.5, 0.0);
        
       // this.Instructions = this.game.add.button(336, 402, 'menuButton', function () {}, this, 2, 1, 0);
    }
    
    _addTitleText(){
        this.startTextAlive = true;
        this.starBurstText = this.game.add.text(460, 240, 'STARBURST', {
            font: "36px Press Start 2P",
            fill: '#ffffff',
            boundsAlignH: "center"
        }); 
        
        this.startText = this.game.add.text(460, 340, '... Press To Begin ...', {
            font: "16px Press Start 2P",
            fill: '#ffffff',
            boundsAlignH: "center"
        }); 
        this.startText.visible = false;
        
        this.starBurstText.anchor.setTo(0.5);
        this.startText.anchor.setTo(0.5);
    }
    preload() {}

    create() {
        this._loadMenuItems();

    }

    update() {
        this.textTimer += this.game.time.elapsed;
        if(this.textTimer >= 1000 && this.startTextAlive){
  
            this.textTimer -= 1000;        
            this.startText.visible = !this.startText.visible;
        }

               if (this.game.input.activePointer.leftButton.isDown && this.startTextAlive) {
  
                this._loadMainMenu();
            }

        

    }

}