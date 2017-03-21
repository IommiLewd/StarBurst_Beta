class UserInterface extends Phaser.Sprite {
    constructor(game) {
        super(game);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
        this.currentWave = 0;
        this.score = 0;
        this._loadElements();
        this.waveComplete = false;
        this.health = 100;
        this.shield = 50;
        this.regenerating = 0;
        //this._gameOverMenu();
    }

    _waveComplete() {
        if (this.waveComplete === false) {
            this.waveComplete = true;
            this.NextWaveText.alpha = 1.0;
            this.NextWaveInText.alpha = 1.0;
            this.TextTimer.alpha = 1.0;
        } else {
            this.waveComplete = false;
            this.NextWaveText.alpha = 0.0;
            this.NextWaveInText.alpha = 0.0;
            this.TextTimer.alpha = 0.0;
        }
    }

    _updateDamage(damage) {
        this.regenerating = 12;
        if (this.shield > 0) {
            this.shield -= damage;
        } else {

            if (this.health > -5) {
                this.health -= damage;
            }
        }
        this.healthBar.width = this.health / 100 * 162;
        this.shieldBar.width = this.shield / 50 * 162;
        if (this.health < 0) {
            console.log('you are dead!!! Bang!!');
            this.healthBar.alpha = 0.0;
            this.shieldBar.alpha = 0.0;
        }
    }
    _updateScore(score) {
        this.score += score;
        this.scoreCounter.setText('Score: ' + this.score);
    }

    _updateWave() {
        this.currentWave++;
        this.waveCounter.setText('Wave: ' + this.currentWave);
    }

    _loadElements() {
        console.log('Load Elements Fired!!!!');
        this.healthBar = this.game.add.tileSprite(10, 8, 162, 10, 'redPixel');
        this.shieldBar = this.game.add.tileSprite(10, 24, 162, 10, 'bluePixel');
        this.statusUi = this.game.add.image(0, 0, 'statusUi');
        this.scoreCounter = this.game.add.text(4, 628, 'Score: ' + this.score);
        this.scoreCounter.font = 'Press Start 2P';
        this.scoreCounter.fontSize = 8;
        this.scoreCounter.addColor("#FFFFFF", 0);

        this.waveCounter = this.game.add.text(4, 618, 'Wave:  ' + this.currentWave, {
            font: "8px Press Start 2P",
            fill: '#ffffff'
        });
        this.NextWaveText = this.game.add.text(350, 80, 'Wave Complete!', {
            font: "16px Press Start 2P",
            fill: '#ffffff'
        });
        this.NextWaveInText = this.game.add.text(350, 100, 'Next Wave In: ', {
            font: "8px Press Start 2P",
            fill: '#ffffff'
        });
        this.TextTimer = this.game.add.text(555, 100, '10', {
            font: "8px Press Start 2P",
            fill: '#ffffff'
        });


        this.NextWaveText.alpha = 0.0;
        this.NextWaveInText.alpha = 0.0;
        this.TextTimer.alpha = 0.0;

    }

    _gameOverMenu() {

        this.gameOverBackground = this.game.add.sprite(300, 80, 'gameOverMenu');
        this.endScore = this.game.add.text(474, 220, this.score, {
            font: "24px Press Start 2P",
            fill: '#f27519',
            boundsAlignH: "center"
        });

        this.endWave = this.game.add.text(474, 294, this.currentWave, {
            font: "24px Press Start 2P",
            fill: '#f27519'
        });
        this.endWave.anchor.setTo(0.5);
        this.endScore.anchor.setTo(0.5);
        //this.restartButton = this.game.add.sprite(306, 352, 'restartUp');
        this.restartButton = this.game.add.button(306, 352, 'restartButton', function () {
            //game.state.start(game.state.current);
            this.game.state.start("SimpleLevel", true, false);
        }, this, 2, 1, 0);
        this.menuButton = this.game.add.button(336, 402, 'menuButton', function () {}, this, 2, 1, 0);
    }


    update() {
        if (this.regenerating > 0) {
            console.log('regenerating is: ' + this.regenerating);
            this.regenerating -= 0.1;
        } else {

            if (this.shield < 50) {
                this.shield += 0.5;
                this.shieldBar.width = this.shield / 50 * 162;

            }
        }

        //                if(this.regenerating && this.shield < 50){
        //            this.shield += 0.5;
        //            this.shieldBar.width = this.shield / 50 * 162;
        //        }

        //        if(this.regenerating && this.shield < 50){
        //            this.shield += 0.5;
        //            this.shieldBar.width = this.shield / 50 * 162;
        //        }
    }
}