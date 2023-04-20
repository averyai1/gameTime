let platforms;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 750 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

function preload() {

    this.load.image('player', 'assets/New Piskel.png');
    this.load.image('block', 'assets/box.png');
}

function create() {

    // Set up single air jump
    this.airJumpUsed = false;

    // Set up backblock color and world bounds
    this.cameras.main.setBackgroundColor('#ADD8E6');
    this.physics.world.setBounds(0, 0, 10000, window.innerHeight);

    // Create platform group
    platforms = this.physics.add.staticGroup();

    // Add platforms
    platforms.create(800, 500, 'block').setScale(1).refreshBody();
    platforms.create(1200, 400, 'block').setScale(1).refreshBody();
    platforms.create(1500, 300, 'block').setScale(1).refreshBody();
    platforms.create(2000, 400, 'block').setScale(1).refreshBody();
    platforms.create(2300, 500, 'block').setScale(1).refreshBody();
    platforms.create(2900, 450, 'block').setScale(1).refreshBody();
    platforms.create(3200, 400, 'block').setScale(1).refreshBody();
    platforms.create(3600, 350, 'block').setScale(1).refreshBody();
    platforms.create(4000, 400, 'block').setScale(1).refreshBody();
    platforms.create(4600, 400, 'block').setScale(1).refreshBody();
    platforms.create(5000, 300, 'block').setScale(1).refreshBody();
    platforms.create(5500, 400, 'block').setScale(1).refreshBody();
    platforms.create(5900, 500, 'block').setScale(1).refreshBody();
    platforms.create(6400, 400, 'block').setScale(1).refreshBody();
    platforms.create(6900, 350, 'block').setScale(1).refreshBody();
    platforms.create(7400, 400, 'block').setScale(1).refreshBody();
    platforms.create(7800, 500, 'block').setScale(1).refreshBody();
    platforms.create(8300, 300, 'block').setScale(1).refreshBody();
    platforms.create(8800, 400, 'block').setScale(1).refreshBody();
    platforms.create(9300, 500, 'block').setScale(1).refreshBody();
    platforms.create(9600, 400, 'block').setScale(1).refreshBody();

    // Add obstacles
    platforms.create(1000, 465, 'block').setScale(1).refreshBody().setImmovable();
    platforms.create(2500, 250, 'block').setScale(1).refreshBody().setImmovable();
    platforms.create(4200, 465, 'block').setScale(1).refreshBody().setImmovable();
    
    // Add player to the scene
    this.player = this.physics.add.sprite(100, 450, 'player');

    // Set player properties
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1);

    // Make player collide with platforms
    this.physics.add.collider(this.player, platforms);

    
    // Set up wall-jumping
    this.wallJump = false;
    this.wallJumpTimer = 0;
    this.wallJumpDuration = 1000;
    this.wallJumpSpeed = 600;

    // Initialize arrow key input and wall-jumping
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', wallJump, this);

    // Set up camera
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05); // Add smooth lerp values
    this.cameras.main.setBounds(0, 0, 10000, window.innerHeight);

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        game.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.physics.world.setBounds(0, 0, 10000, window.innerHeight);
        this.cameras.main.setBounds(0, 0, 10000, window.innerHeight);
    });
}

function update(time, delta) {
    // Handle player movement
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-320);
        this.player.setFlipX(false);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(320);
        this.player.setFlipX(true);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && (this.player.body.onFloor() || this.wallJump)) {
        this.player.setVelocityY(-660);
        if (this.wallJump) {
            this.wallJump = false;
            this.wallJumpTimer = 0;
        }
    }

    if (this.cursors.down.isDown) {
        this.physics.world.gravity.y = 2000;
    } else {
        this.physics.world.gravity.y = 750;
    }

        // Check if player is on the block
        const onblock = this.player.body.onFloor();

        // Reset air jump flag when the player is on the block
        if (onblock) {
            this.airJumpUsed = false;
        }
    
        if (this.cursors.up.isDown && (onblock || !this.airJumpUsed)) {
            this.player.setVelocityY(-660);
    
            if (!onblock) {
                this.airJumpUsed = true;
            }
    
            if (this.wallJump) {
                this.wallJump = false;
                this.wallJumpTimer = 0;
            }
        }

    // Handle wall-jumping
    const touchingLeft = this.player.body.touching.left;
    const touchingRight = this.player.body.touching.right;
    if ((touchingLeft || touchingRight) && this.cursors.up.isDown) {
        this.player.setVelocityY(-660);
        this.player.setVelocityX(touchingLeft ? 660 : -660);
        this.wallJump = true;
        this.wallJumpTimer = 1000;
    } else if (this.wallJump && this.wallJumpTimer > 0) {
        this.player.setVelocityY(-660);
        this.player.setVelocityX(touchingLeft ? 660 : -660);
        this.wallJumpTimer -= delta;
    } else {
        this.wallJump = false;
    }
}



function wallJump() {
    if (this.wallJumpTimer <= 0) {
        // Check if player is touching a wall
        const touchingLeft = this.player.body.touching.left;
        const touchingRight = this.player.body.touching.right;
        if (touchingLeft || touchingRight) {
            // Perform wall-jump
            this.player.setVelocityY(-this.wallJumpSpeed);
            this.player.setVelocityX(touchingLeft ? this.wallJumpSpeed : -this.wallJumpSpeed);
            this.wallJump = true;
            this.wallJumpTimer = this.wallJumpDuration;
        }
    }
}
