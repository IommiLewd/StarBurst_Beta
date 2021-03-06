class Player extends Phaser.Sprite {
    constructor(game, posx, posy, key, type, properties) {
        super(game, posx, posy, 'Starships', 0, properties);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
        this.body.drag.set(10);

        this.shipProperties = properties;
        if (type === undefined) {
            type = Math.random() * (5 - 0) + 0;
            type = Math.floor(type);
            console.log('type is: ' + type + ' - Name: ' + this.shipProperties[type][0] + ' - Speed is: ' + this.shipProperties[type][2]);
        }
        this.animations.add('anim', [type]);
        this.animations.play('anim');
        this.fireRate = this.shipProperties[type][6];
        this._nextFire = 0;
        this._addEmitter();
        if(this.shipProperties[type][5] === 1){
        this._addGun();
            this.turretEnabled = true;
        } else {this.turretEnabled = false;}
        this.SPEED = this.shipProperties[type][2];; // missile speed pixels/second
        this.TURN_RATE = this.shipProperties[type][3];; // turn rate in degrees/frame
        this.body.bounce.set(0.5);
        this.alive = true;
        this._laserPointer();
        this._initBullets();
    }

    _addEmitter() {
        this.emitter = this.game.add.emitter(0, 0, 200);
        this.emitter.width = 0;
        this.emitter.makeParticles('blueFlame');
        this.emitter.maxParticleSpeed = new Phaser.Point(-100, 50);
        this.emitter.minParticleSpeed = new Phaser.Point(-200, -50);
        this.emitter.minParticleScale = 0.5;
        this.emitter.maxParticleScale = 8.9;
        this.emitter.setRotation(0, 360);
         this.emitter.setAlpha(0.1, 0.8);

        this.emitter.setAlpha(1, 0.1, 250);
        this.emitter.forEach(function (particle) {
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
        this.emitter.setScale(0.3, 2, 0.3, 2, 250);
        this.emitter.start(false, 250, 1);
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
        //this.deathEmitter.start(false, 800, 100);
        this.deathEmitter.start(false, 400, 100);
        this.deathEmitter.on = true;
    }


    _addGun() {
        this.gun = this.game.add.image(0, 0, 'gun');
        this.gun.anchor.setTo(0.5);
    }

    _playerDeath() {
        this._deathEmitter();
        this._laserPointer.alpha = 0.0;
        if(this.turretEnabled){
        this.gun.destroy();
        }
        this.emitter.on = false;
    }

    _laserPointer() {

        this._laserPointer = this.game.add.tileSprite(0, 0, 1100, 0.5, 'pointer');
        this._laserPointer.anchor.setTo(0.0, 0.5);
        this._laserPointer.alpha = 0.5;
    }



    _fireWeapon() {
        this.bullet;
        if (this.game.time.now > this._nextFire) {
            this._nextFire = this.game.time.now + this.fireRate;
            this.bullet = this.bullets.getFirstDead();
            this.bullet.reset(this.x, this.y);
            this.game.camera.shake(0.004, 40);
            if(this.turretEnabled){
            this.game.physics.arcade.velocityFromAngle(this._laserPointer.angle, 1100, this.bullet.body.velocity);
                this.bullet.angle = this._laserPointer.angle;
            } else {
                 this.game.physics.arcade.velocityFromAngle(this.angle, 1100, this.bullet.body.velocity); 
                this.bullet.angle = this.angle;
            }
            
            this.bullet.bringToTop();
            this.bullets.add(this.bullet);
        }
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

    update() {
        if (this.alive) {
            this._laserPointer.rotation = this.game.physics.arcade.angleToPointer(this);
            this._laserPointer.x = this.x;
            this._laserPointer.y = this.y;
            if(this.turretEnabled){
            this.gun.x = this.x;
            this.gun.y = this.y;
            this.gun.rotation = this.game.physics.arcade.angleToPointer(this);
            }
            var targetAngle = this.game.math.angleBetween(
                this.x, this.y,
                this.game.input.activePointer.x, this.game.input.activePointer.y
            );

            var delta = targetAngle - this.rotation;
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (this.game.input.activePointer.rightButton.isDown) {
                this.emitter.on = true;
                this.game.physics.arcade.accelerationFromRotation(this.rotation, this.SPEED, this.body.acceleration);

                if (delta > 0) {
                    this.angle += this.TURN_RATE;
                } else {
                    this.angle -= this.TURN_RATE;
                }
            } else {
                this.body.acceleration.set(0);
                this.emitter.on = false;
            }

            if (this.game.input.activePointer.leftButton.isDown) {
                this._fireWeapon();
            }


        } else {
            this.angle += 3;

        }


    }
}