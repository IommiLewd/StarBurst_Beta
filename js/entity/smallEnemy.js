class smallEnemy extends Phaser.Sprite {
    constructor(game, posx, posy, key) {
        super(game, posx, posy, 'player', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
        this.body.drag.set(0.5);
        this._addEmitter();
        var randTurn = Math.random() * (2.0 - 1.5) + 1.5;
        var randSpeed = Math.random() * (140 - 120) + 120;
        this.SPEED = randSpeed; // missile speed pixels/second
        this.TURN_RATE = randTurn; // turn rate in degrees/frame
        this.playerX = 100;
        this.playerY = 100;
        this.body.bounce.set(0.4);
        this.body.setSize(this.width - 8, this.width - 8, 8, 8);
        this._addLaser();
        this._initBullets();
        this.fireRate = 420;
        this._nextFire = 0;
        this.alive = true;
        this.health = 100;
        

    }
    
    _damageTaken(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.alive = false;
            this.emitter.on = false;
            this._deathEmitter();
            this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){this.destroy();}, this);
            
        }
    }

    _fireWeapon() {
        this.bullet;
        this._nextFire = this.game.time.now + this.fireRate;
        this.bullet = this.bullets.getFirstDead();
        this.bullet.reset(this.x, this.y);
        this.game.physics.arcade.velocityFromAngle(this.angle, 900, this.bullet.body.velocity);
        this.bullet.angle = this.angle;
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
        this._targetReticule.alpha = 0.0;
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
       // this.deathEmitter.minParticleSpeed.setTo(-100, -100);
       // this.deathEmitter.maxParticleSpeed.setTo(100, 100);
        this.deathEmitter.setRotation(0, 190);
        this.deathEmitter.setAlpha(0.1, 1);
        this.deathEmitter.forEach(function (particle) {
            particle.body.allowGravity = false;
//            particle.animations.add('emit1', [0]);
//            particle.animations.add('emit2', [1]);
//            particle.animations.add('emit3', [2]);
//            var randSpeed = Math.random() * (4 - 0) + 0;
//            var randSpeed = Math.floor(randSpeed);
//            if (randSpeed === 1) {
//                particle.animations.play('emit1', 30, true);
//            } else if (randSpeed === 2) {
//                particle.animations.play('emit2', 30, true);
//            } else {
//                particle.animations.play('emit3', 30, true);
        }, this);
        this.deathEmitter.setScale(0.3, 2.5, 0.3, 2.5, 400);
        //this.deathEmitter.start(false, 800, 100);
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
            if (storedPointerAngle < storedShipAngle + 0.2 && storedPointerAngle > storedShipAngle - 0.2 && this.game.time.now > this._nextFire) {
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