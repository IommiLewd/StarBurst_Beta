class MainMenu extends Phaser.State {
    constructor() {
        super();
        this.textTimer = 0;
        this.startTextAlive = false;
        this.selectedShip = 1;
        this.nameArray = ['Badger', 'Orsus', 'Raven', 'SwiftWind', 'Brick'];
        this.descriptionArray = [
            'Heavy Armor - Slow Movement',
            'Best rate of fire.',
            'Best Speed and maneuverability',
            'Speedy and equipped with a turret',
            'Slow with a powerful turret.'
        ];
    }


    _loadMenuItems() {
        this.titleBackground = this.game.add.image(0, 0, 'titleBackground');
        this.titleBackground.alpha = 0.0;
        this.tween = game.add.tween(this.titleBackground);
        this.tween.to({
            y: -90,
            alpha: 1.0
        }, 5000, 'Linear', true, 0);
        this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
            this._addTitleText();
        }, this);
    }


    _loadGameOptions() {
        this.settingsMenu = this.game.add.image(460, 300, 'gameSettings');
        this.settingsMenu.anchor.setTo(0.5);
        this.instructions = this.game.add.button(280, 172, 'easyDifficulty', function () {}, this, 1, 2, 0);
        this.instructions = this.game.add.button(410, 172, 'normalDifficulty', function () {}, this, 1, 2, 0);
        this.instructions = this.game.add.button(560, 172, 'hardDifficulty', function () {}, this, 1, 2, 0);
        this.shipPlacementX = 222;
        this.placementX = 210;
        for (var i = 0; i <= 4; i++) {
            this.placementX += 74;
            this.shipPlacementX += 74;
            let buttonNumber = i;
            this.ship = this.game.add.button(this.placementX, 272, 'checkButton', function () {
                this._shipHandler(buttonNumber);
            }, this, 1, 2, 2, 2);

            this.shipPreview = this.game.add.sprite(this.shipPlacementX, 284, 'UiShips');
            this.shipPreview.frame = i;
        }
        
        
        
        this.shipName = this.game.add.text(460, 360, this.nameArray[this.selectedShip], {
            font: "16px Press Start 2P",
            fill: '#ffffff',
            boundsAlignH: "center"
        });
        this.shipName.anchor.setTo(0.5);
        
        
            this.shipDescription = this.game.add.text(460, 420, this.descriptionArray[this.selectedShip], {
            font: "12px Press Start 2P",
            fill: '#ffffff',
            boundsAlignH: "center"
        });
        this.shipDescription.visible = false;
        this.shipDescription.anchor.setTo(0.5);
        
        this.beginButton = this.game.add.button(340, 540, 'begin', function () {}, this, 1, 2, 0);
       


    }

    _shipHandler(input) {
        this.shipDescription.visible = true;
        console.log(input);
        this.selectedShip = input;
        this.shipName.setText(this.nameArray[input]);
        this.shipDescription.setText(this.descriptionArray[input]);
        
    }

    _loadMainMenu() {
        this.startTextAlive = false;
        this.startText.destroy();
        this.startMenuImage = this.game.add.image(460, 360, 'titleMenuImage');
        this.startMenuImage.anchor.setTo(0.5);
        this.startNewGame = this.game.add.button(460, 346, 'startNewGame', function () {
            //this.game.state.start('SimpleLevel');
            this._loadGameOptions();
        }, this, 1, 2, 0);
        this.startNewGame.anchor.setTo(0.5);
        this.copyright = this.game.add.text(830, 620, '2017 Tommy Nielsen', {
            font: "8px Press Start 2P",
            fill: '#ffffff',
            boundsAlignW: "right"
        });
        this.copyright.anchor.setTo(0.5, 0.0);
        this.versionText = this.game.add.text(460, 410, 'Beta 0.6', {
            font: "8px Press Start 2P",
            fill: '#ffffff',
            boundsAlignH: "center"
        });
        this.versionText.anchor.setTo(0.5);
        this.instructions = this.game.add.button(460, 374, 'instructions', function () {}, this, 1, 2, 0);
        this.instructions.anchor.setTo(0.5);
        
    
        
        
    }

    _addTitleText() {
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
        if (this.textTimer >= 1000 && this.startTextAlive) {

            this.textTimer -= 1000;
            this.startText.visible = !this.startText.visible;
        }

        if (this.game.input.activePointer.leftButton.isDown && this.startTextAlive) {

            this._loadMainMenu();
            //this._loadGameOptions();
        }



    }

}