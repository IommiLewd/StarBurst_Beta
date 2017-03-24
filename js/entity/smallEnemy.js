class smallEnemy extends Phaser.Sprite {
    constructor(game, posx, posy, key, type, properties, difficulty) {
        super(game, posx, posy, 'Starships', 0, type, properties, difficulty);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
        this.body.drag.set(0.5);
        this.enemyShipProperties = properties;
        if (type === undefined) {
            type = Math.random() * (5 - 0) + 0;
            type = Math.floor(type);
        }
        console.log('Enemy ship spawned! type is: ' + type + ' - Name: ' + this.enemyShipProperties[type][0] + ' - Speed is: ' + this.enemyShipProperties[type][2]);
        this.animations.add('enemyAnim', [type]);
        this.animations.play('enemyAnim');
        this.difficulty = difficulty;

        if (this.enemyShipProperties[type][5] === 1) {
            this.turretEnabled = true;
            this._addenemyGun();
        } else {
            this.turretEnabled = false;
        }
        this._addEmitter();
        this.SPEED = this.enemyShipProperties[type][2] / this.difficulty; // missile speed pixels/second
        this.TURN_RATE = this.enemyShipProperties[type][3] / this.difficulty; // turn rate in degrees/frame
        this.playerX = 100;
        this.playerY = 100;
        this.body.bounce.set(0.4);
        this.body.setSize(this.width - 8, this.width - 8, 8, 8);
        this._addLaser();
        this._initBullets();
        this.fireRate = this.enemyShipProperties[type][6] * this.difficulty;
        this._nextFire = 0;
        this.alive = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
            if (this.health > 0) {
                this.alive = true;
            }
        }, this);
        this.health = this.enemyShipProperties[type][4] / this.difficulty;
    }

    _damageTaken(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.alive = false;
            this.emitter.on = false;
            this._deathEmitter();
            this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                this._targetReticule.destroy();
                this.destroy();
            }, this);
        }
    }

    _addenemyGun() {
        this.enemyGun = this.game.add.image(0, 0, 'gun');
        this.enemyGun.anchor.setTo(0.5);
    }

    _fireWeapon() {
        this.bullet;
        this._nextFire = this.game.time.now + this.fireRate;
        this.bullet = this.bullets.getFirstDead();
        this.bullet.reset(this.x, this.y);
        if (this.turretEnabled) {
            this.game.physics.arcade.velocityFromAngle(this._targetReticule.angle, 900, this.bullet.body.velocity);
            this.bullet.rotation = this._targetReticule.rotation;
        } else {
            this.game.physics.arcade.velocityFromAngle(this.angle, 900, this.bullet.body.velocity);
            this.bullet.angle = this.angle;
        }
        this.bullet.bringToTop();
        this.bullets.add(this.bullet);

    }

    _initBullets() {
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(500, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        //  --- Disable Gravity for Each Bullet
        this.bullets.forEach(function (L) {
            L.body.allowGravity = false;
        })
    }

    _addLaser() {
        this._targetReticule = this.game.add.tileSprite(0, 0, 800, 0.5, 'redpointer');
        this._targetReticule.anchor.setTo(0.0, 0.5);
        this._targetReticule.visible = false;
    }
    _addEmitter() {
        this.emitter = this.game.add.emitter(0, 0, 200);
        this.emitter.width = 0;
        this.emitter.makeParticles('flame');
        this.emitter.maxParticleSpeed = new Phaser.Point(-100, 50);
        this.emitter.minParticleSpeed = new Phaser.Point(-200, -50);
        this.emitter.minParticleScale = 0.5;
        this.emitter.maxParticleScale = 8.9;
        this.emitter.setRotation(0, 190);
        this.emitter.setAlpha(0.1, 0.6);
        this.emitter.forEach(function (particle) {
            particle.body.allowGravity = false;

        }, this);
        this.emitter.setScale(0.3, 2, 0.3, 2, 200);
        this.emitter.start(false, 200, 1);
        this.addChild(this.emitter);
        this.emitter.on = false;
        this.emitter.y = 0;
        this.emitter.x = -6;
    }

    _deathEmitter() {
        this.deathEmitter = this.game.add.emitter(0, 0, 0);
        this.addChild(this.deathEmitter);
        this.deathEmitter.width = 0;
        this.deathEmitter.makeParticles('flame');
        this.deathEmitter.setRotation(0, 190);
        this.deathEmitter.setAlpha(0.1, 1);
        this.deathEmitter.forEach(function (particle) {
            particle.body.allowGravity = false;
        }, this);
        this.deathEmitter.setScale(0.3, 2.5, 0.3, 2.5, 400);
        this.deathEmitter.start(false, 400, 200);
        this.deathEmitter.on = true;
    }

    update() {
        if (this.alive) {
            this._targetReticule.x = this.x;
            this._targetReticule.y = this.y;
            var storedAngle = this.game.physics.arcade.angleToXY(this._targetReticule, this.playerX, this.playerY);
            this._targetReticule.rotation = storedAngle;
            var storedShipAngle = Math.abs(this.rotation);
            var storedPointerAngle = Math.abs(this._targetReticule.rotation);
            if (this.game.time.now > this._nextFire) {
                this._fireWeapon();
            }

            this.targetDistance = this.game.math.distance(this.x, this.y, this.playerX, this.playerY);
            var targetAngle = this.game.math.angleBetween(
                this.x, this.y,
                this.playerX, this.playerY
            );

            var delta = targetAngle - this.rotation;
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (this.targetDistance > 120) {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, this.SPEED, this.body.acceleration);
                this.emitter.on = true;
            } else {
                this.emitter.on = false;
            }

            if (delta > 0) {
                this.angle += this.TURN_RATE;
            } else {
                this.angle -= this.TURN_RATE;
            }

        } else {
            this.angle += 2;

        }

    }


}