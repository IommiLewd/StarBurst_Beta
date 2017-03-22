class SimpleLevel extends Phaser.State {
    constructor() {
        super();
    }

    _loadLevel() {
        console.log('simplelevel.js: -> _LoadLevel fired');
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.game.world.setBounds(0, 0, 920, 640);
        this.background = game.add.tileSprite(0, 0, 920, 640, 'background');
        this.overlay = game.add.tileSprite(-300, -300, 1020, 740, 'Overlay');
        this.overlay2 = game.add.tileSprite(-300, -300, 1020, 740, 'Overlay2');
    }

    _addPlayer(x, y) {
        //this.player = new Player(this.game, x, y, 'starships');
        this.player = new Player(this.game, this.game.width / 2, this.game.height / 2, 'starships', undefined, this.shipProperties);
        this.player.shipProperties = this.shipProperties;
        this.game.camera.follow(this.player);
    }

    _loadUi() {
        this.userInterface = new UserInterface(this.game);

    }

    _enemy_hit(bullet, enemy) {

        bullet.kill();
        enemy._damageTaken(16);
        enemy.body.velocity.x = bullet.body.velocity.x / 8;
        enemy.body.velocity.y = bullet.body.velocity.y / 8;
        this.explosion.x = enemy.x;
        this.explosion.y = enemy.y;
        this.explosion.on = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.3, this._endExplosion, this);
        if (enemy.health < 15 && enemy.alive) {
            this.userInterface._updateScore(20);
        }
    }

    _player_hit(player, bullet) {
        bullet.kill();
        player.body.velocity.x = bullet.body.velocity.x / 8;
        player.body.velocity.y = bullet.body.velocity.y / 8;
//        
//            player.body.velocity.x = 10;
//        player.body.velocity.y = 10;

//        player.body.velocity.x - bullet.body.velocity.x/10;
//        player.body.velocity.y - bullet.body.velocity.y/10;

        
        this.explosion.x = player.x;
        this.explosion.y = player.y;
        this.explosion.on = true;
        this.game.camera.shake(0.06, 20);
        this.userInterface._updateDamage(10);
        this.game.time.events.add(Phaser.Timer.SECOND * 0.3, this._endExplosion, this);

        if (this.userInterface.health < 0 && this.player.alive) {
            this.player.alive = false;
            var deathTimer = Math.random() * (9 - 5) + 5;
            this.player._playerDeath(deathTimer);
            this.game.time.events.add(Phaser.Timer.SECOND * deathTimer, this._gameOver, this);
        }
    }

    _gameOver() {
        this.userInterface._gameOverMenu();
    }

    _endExplosion() {
        this.explosion.on = false;
    }

    _addExplosion() {
        this.explosion = this.game.add.emitter(0, 0, 200);
        this.explosion.width = 0;
        this.explosion.makeParticles('blueFlame');
        this.explosion.minParticleSpeed.setTo(-200, -200);
        this.explosion.maxParticleSpeed.setTo(200, 200);
        this.explosion.setRotation(0, 190);
        this.explosion.setAlpha(0.1, 1);
        this.explosion.forEach(function (particle) {
            particle.body.allowGravity = false;
            particle.animations.add('emit1', [0]);
            particle.animations.add('emit2', [1]);
            particle.animations.add('emit3', [2]);
            var randSpeed = Math.random() * (4 - 0) + 0;
            var randSpeed = Math.floor(randSpeed);
            if (randSpeed === 1) {
                particle.animations.play('emit1', 30, true);
            } else if (randSpeed === 2) {
                particle.animations.play('emit2', 30, true);
            } else {
                particle.animations.play('emit3', 30, true);
            }

        }, this);
        this.explosion.setScale(0.3, 1, 0.3, 1, 160);
        this.explosion.start(false, 160, 1);
        this.explosion.on = false;
    }


    _checkCollision() {
        this.game.physics.arcade.collide(this.player, this.enemies);
        this.game.physics.arcade.collide(this.player.bullets, this.enemies, this._enemy_hit, null, this);
        if (this.enemies.length > 0) {
            this.game.physics.arcade.collide(this.enemy.bullets, this.player, this._player_hit, null, this);
        }
    }

    _aiUpdater() {
        var storedX = this.player.x;
        var storedY = this.player.y;
        this.enemies.forEach(function (enemy) {
            enemy.playerX = storedX;
            enemy.playerY = storedY;
        }, this)
    }

    _nextWave() {
        this.enemies = this.game.add.group();
        this.roundTimerRunning = true;
        this.currentWave++;
        if (this.currentWave % 3 === 0) {
            this.enemyWaveMultiplier++;
        }
        this.userInterface._waveComplete();
        this.game.time.events.add(Phaser.Timer.SECOND * 10, function () {
            for (this.i = 0; this.i < this.enemyWaveMultiplier; this.i++) {
                var randomX = Math.random() * (900 - 20) + 20;
                var randomY = Math.random() * (620 - 20) + 20;
                this.enemy = new smallEnemy(this.game, randomX, randomY, 'player', /*undefined*/ undefined, this.shipProperties, this._difficulty);

                this.enemies.add(this.enemy);
            }
            this.roundTimerRunning = false;
            this.userInterface._waveComplete();
            this.userInterface._updateWave();
        }, this);
    }

    _scoreUpdate() {}
    preload() {}

    create() {
        this._difficulty = 2;
        this.enemyWaveMultiplier = 1;
        this.shipProperties = [
  //[0'name', 1'key', 2'speed', 3'handling', 4'health', 5'turret', 6'rateOfFire', ],
      ['Badger', 0, 200, 2.5, 160, 0, 160],
      ['Orsus', 1, 180, 2.5, 100, 0, 120],
      ['Raven', 2, 280, 4, 140, 0, 180],
  ['ShiftWind', 3, 220, 2.2, 120, 1, 400],
      ['Brick', 4, 160, 2, 180, 1, 250]

];
        this.game.stage.smoothed = false;
        this.enemies = this.game.add.group();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.currentWave = 0;
        this.roundTimerRunning = false;
        this._loadLevel();
        this._addPlayer(100, 100);
        this._addExplosion();
        this._loadUi();


    }

    update() {
        this._aiUpdater();
        if (this.player.alive) {
            this.overlay.x = this.player.x * 0.16 - 100;
            this.overlay.y = this.player.y * 0.16 - 100;
            this.overlay2.x = this.player.x * 0.22 - 100;
            this.overlay2.y = this.player.y * 0.22 - 100;
            this._checkCollision();

            if (this.enemies.length <= 0 && this.roundTimerRunning === false) {

                this._nextWave();
            }
        }
    }

}