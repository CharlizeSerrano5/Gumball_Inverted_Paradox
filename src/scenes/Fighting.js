class Fighting extends Phaser.Scene {
    constructor(){
        super('fightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP

    }

    create() {
        // create an HP amount of 999 for each of the characters
        // ground fills up to the half point and the foreground is up to the 1/3 point
        

        // initializing a background
        // see: https://www.youtube.com/watch?v=OOo69t_-uok
        this.background = this.add.image(this.scale.width / 2,this.scale.height / 2, 'background')
        // adding a character to scene - each character should have their own HP
        this.gumball = new Character(this, rightPos, floorY + tileSize, 'gumball', 0, this.hp, MP, 'gumball').setOrigin(0,1)
        this.anais = new Character(this, rightPos + tileSize, floorY +tileSize, 'anais', 0, this.hp, MP, 'anais').setOrigin(0,1)
        this.darwin = new Character(this, rightPos-tileSize, floorY + tileSize, 'darwin', 0, this.hp, MP, 'darwin').setOrigin(0,1)
        // adding each character health
            // Note: could probably put all health and items inside of a container...
        this.hp_pos = centerX - tileSize * 2.7
        this.name_pos = centerX - tileSize * 5.5
        this.health_pos = centerX + 54
            // gumball
            this.gumball_hp = new HealthBar(this, centerX, floorY + tileSize, this.gumball.health)
            this.add.bitmapText(this.hp_pos, this.gumball_hp.y, 'font', 'HP', 12)
            this.add.bitmapText(this.name_pos, this.gumball_hp.y, 'font', this.gumball.name, 12)
            this.gumball_health = this.add.bitmapText(this.health_pos, this.gumball_hp.y, 'font', this.gumball.health, 8)
            // anais
            this.anais_hp = new HealthBar(this, centerX, floorY + tileSize * 1.5 , this.anais.health)
            this.add.bitmapText(this.hp_pos, this.anais_hp.y, 'font', 'HP', 12)
            this.add.bitmapText(this.name_pos, this.anais_hp.y, 'font', this.anais.name, 12)
            this.anais_health = this.add.bitmapText(this.health_pos, this.anais_hp.y, 'font', this.anais.health, 8)
            // // darwin
            this.darwin_hp = new HealthBar(this, centerX, floorY + tileSize * 2, this.darwin.health)
            this.add.bitmapText(this.hp_pos, this.darwin_hp.y, 'font', 'HP', 12)
            this.add.bitmapText(this.name_pos, this.darwin_hp.y, 'font', this.darwin.name, 12)
            this.darwin_health = this.add.bitmapText(this.health_pos, this.darwin_hp.y, 'font', this.darwin.health, 8)


        // adding enemy to scene - enemy has the same states as the character therefore they will use their character specific animations
        this.enemy = new Character(this, leftPos - tileSize, floorY +tileSize, 'boss_temp', 0, HP, MP, 'boss_temp').setOrigin(0,1)

        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // adding music
        // this.music = this.sound.add('music')
                    // const temp_rectangle = this.add.rectangle(0, floorY+tileSize, game.config.width, floorY - game.config.height, 0x6666ff).setOrigin(0,1);
        
        // initializing selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = this.add.image(0,0, 'container')
        const attack = this.add.bitmapText(-24, -20, 'font', "ATTACK ", 8).setInteractive({useHandCursor: true})
        attack.on('pointerover', () => {
            attack.setTint('#ffffff')
        })

        attack.on('pointerout', () => {
            attack.clearTint()
        })
        attack.on('pointerup', function() {
            // clicking the attack
            console.log('attacking')
        })

        const selection = this.add.container(rightPos, floorY + tileSize + 28 , [ container_bg , attack]) // .setVisible(false)
        
        // Game OVER flag
        this.gameOver = false
        
    }

    update() {
        const { left, right, up, down, space, shift } = this.keys
        if (this.gameOver){
               

        }
        
        this.characterFSM.step()

        if (down.isDown){
            this.anais_hp.decrease(12)
        }
        
        this.anais_health.text = this.anais_hp.value
        
    }

    // MOST IMPORTANT FINISH FIRST

}