class Fighting extends Phaser.Scene {
    constructor(){
        super('fightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP
        // initialize a boolean value to check if player has attacked 
        // Note: might make a global variable
        this.player_attack = false
        // check if it is the player's turn (start off with the player going first)
        this.player_turn = true
        // set the current player at the first one
        this.current_player = 0
        this.active_players = 3 // Note: with more scenes turn this into a global variable
        this.active_enemies = 1 // Note: in future scenes it may change the amount
        this.FSM_holder = Array(3).fill(0)
        this.textAdded = false
        this.temp_dmg = 200
        // initializing the amt the player will do to the enemy
        this.dmgToEnemy = 0
        this.enemy_dmg = 0
    }

    create() {
        // initializing a background
        // see: https://www.youtube.com/watch?v=OOo69t_-uok
        this.background = this.add.image(this.scale.width / 2,this.scale.height / 2, 'background')
        // adding a character to scene - each character should have their own HP
        this.gumball = new Character(this, rightPos, floorY + tileSize, 'gumball', 0, this.hp, MP, this.temp_dmg, 'GUMBALL', 0).setOrigin(0,1)
        this.anais = new Character(this, rightPos + tileSize, floorY +tileSize, 'anais', 0, this.hp, MP, this.temp_dmg, 'ANAIS', 1).setOrigin(0,1)
        this.darwin = new Character(this, rightPos-tileSize, floorY + tileSize, 'darwin', 0, this.hp, MP, this.temp_dmg, 'DARWIN', 2).setOrigin(0,1)
        // adding each character health
            // Note: could probably put all health and items inside of a container...
        this.hp_pos = centerX - tileSize * 2.7
        this.name_pos = centerX - tileSize * 5.5
        this.health_pos = centerX + 54
            // gumball
            this.gumball_hp = this.statsPrints(this.gumball, floorY+ tileSize, this.gumball_health, this.gumball_hp)
            // this.gumball_hp = new HealthBar(this, centerX, floorY + tileSize, this.gumball.health, 0)
            // this.add.bitmapText(this.hp_pos, this.gumball_hp.y, 'font', 'HP', 12)
            // this.add.bitmapText(this.name_pos, this.gumball_hp.y, 'font', this.gumball.name, 12)
            this.gumball_health = this.add.bitmapText(this.health_pos, this.gumball_hp.y, 'font', this.gumball.health, 8)
            // anais
            this.anais_hp = this.statsPrints(this.anais, floorY+ tileSize *1.5, this.anais_health, this.anais_hp)
            // this.add.bitmapText(this.hp_pos, this.anais_hp.y, 'font', 'HP', 12)
            // this.add.bitmapText(this.name_pos, this.anais_hp.y, 'font', this.anais.name, 12)
            this.anais_health = this.add.bitmapText(this.health_pos, this.anais_hp.y, 'font', this.anais.health, 8)
            // darwin
            this.darwin_hp = new HealthBar(this, centerX, floorY + tileSize * 2, this.darwin.health, 2)
            this.add.bitmapText(this.hp_pos, this.darwin_hp.y, 'font', 'HP', 12)
            this.add.bitmapText(this.name_pos, this.darwin_hp.y, 'font', this.darwin.name, 12)
            this.darwin_health = this.add.bitmapText(this.health_pos, this.darwin_hp.y, 'font', this.darwin.health, 8)
        
        // adding all characters into an array to loop all the characters
        this.characters = [ this.gumball, this.darwin, this.anais ]


        // adding enemy to scene - enemy has their own prefab
        this.enemy = new Enemy(this, leftPos - tileSize, floorY + tileSize, 'penny', 0, HP, MP, 152, 'PENNY').setOrigin(0,1).setFlipX(true)
        // creating a temp health for the enemy
        // this.enemy_health = this.add.bitmapText(centerX, centerY - 32, 'font', this.enemy.health, 40).setOrigin(0.5)
        // adding enemy stats
        this.enemy_hp = new HealthBar(this, centerX, tileSize / 4, this.enemy.health)
        this.add.bitmapText(this.hp_pos, this.enemy_hp.y, 'font', 'HP', 12)
        this.add.bitmapText(this.name_pos, this.enemy_hp.y, 'font', this.enemy.name, 12)
        this.enemy_health = this.add.bitmapText(this.health_pos, this.enemy_hp.y, 'font', this.enemy.health, 8)

        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // adding music
        // this.music = this.sound.add('music')
                // const temp_rectangle = this.add.rectangle(0, floorY+tileSize, game.config.width, floorY - game.config.height, 0x6666ff).setOrigin(0,1);
        
        // initializing selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = this.add.image(0,0, 'container')
        const attack = this.add.bitmapText(-24, -20, 'font', "ATTACK", 8)
        const item = this.add.bitmapText(-24, -8, 'font', "ITEM", 8)
        const power = this.add.bitmapText(-24, 4, 'font', "POWER", 8)
        const selection = this.add.container(rightPos, floorY + tileSize + 28 , [ container_bg , attack, item, power]) // .setVisible(false)
        
        // Game OVER flag
        this.gameOver = false
        
    }

    update() {
        const { left, right, up, down, space, shift } = this.keys
        
        // check for game over
        if (this.active_players == 0){
            this.gameOver = true
        }
        if (this.active_enemies == 0){
            if (!this.textAdded){
                this.add.bitmapText(centerX, centerY, 'font', 'YOU WIN', 20).setOrigin(0.5)
                this.textAdded = true
            }
            if (up.isDown){
                this.scene.start('menuScene')
            }
            if (right.isDown){
                this.scene.restart()
            }
        }
        
        // restart game if game over
        if (this.gameOver){
            // use a boolean value to ensure that browser does not lag
            if (!this.textAdded){
                this.add.bitmapText(centerX, centerY, 'font', 'GAME OVER', 20).setOrigin(0.5)
                this.textAdded = true
            }
            if (up.isDown){
                this.scene.start('menuScene')
            }
            if (right.isDown){
                this.scene.restart()
            }
            
        }
        if (!this.gameOver){
            this.FSM_holder[0].step()
            this.FSM_holder[1].step()
            this.FSM_holder[2].step()
            this.enemyFSM.step()
            // match the characters health
            this.healthMatch(this.anais, this.anais_hp, this.anais_health);
            this.healthMatch(this.gumball, this.gumball_hp, this.gumball_health)
            this.healthMatch(this.darwin, this.darwin_hp, this.darwin_health)
            this.healthMatch(this.enemy, this.enemy_hp, this.enemy_health)
            
            // if the enemy is attacking
            if (this.enemy.attack == true) {
                this.anais.health -= this.enemy.attack_dmg
                this.anais.hurt = true
                this.darwin.health -= this.enemy.attack_dmg
                this.darwin.hurt = true
                this.gumball.health -= this.enemy.attack_dmg
                this.gumball.hurt = true
                this.enemy.attack = false;
            }
            else if (this.enemy.attack == false) {
                this.anais.hurt = false
                this.darwin.hurt = false
                this.gumball.hurt = false
            }

            // if any character has attacked
            if (this.gumball.willAttack || this.anais.willAttack || this.darwin.willAttack){
                console.log('someone will attack')
            }
            
            
            if (Phaser.Input.Keyboard.JustDown(left)){ // NOT WORKING
                this.player_attack = true
                // it is no longer the player's turn
                this.player_turn = false
                this.gumball.willAttack = true // here 
                console.log('gumball is attacking' + this.gumball.willAttack)
                
            }
        } 
    }
    healthMatch(char, health_bar, health) {
        // ensure the health is dynamically updating
        health_bar.match(char.health)
        health.text = health_bar.value
    }
    statsPrints(char, y, char_health_txt, char_health_bar){
        // refining the code of making a health bar
        char_health_bar = new HealthBar(this, centerX, y, char.health)
        this.add.bitmapText(this.hp_pos, char_health_bar.y, 'font', 'HP', 12)
        this.add.bitmapText(this.name_pos, char_health_bar.y, 'font', char.name, 12)
        // char_health_txt = this.add.bitmapText(this.health_pos, char_health_bar.y, 'font', char.health, 8)
        return char_health_bar
    }
}