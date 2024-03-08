class Fighting extends Phaser.Scene {
    constructor(){
        super('fightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP
        // initialize a boolean value to check if player has attacked 
        // Note: might make a global variable
        this.player_attacking = false
        this.enemy_attacking = false
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

        this.hp_pos = centerX - tileSize * 2.7
        this.name_pos = centerX - tileSize * 5.5
        this.health_pos = centerX + 54

        // setting up buttons
        // see: https://blog.ourcade.co/posts/2020/phaser-3-ui-menu-selection-cursor-selector/
        
    }

    create() {
        // initializing a background
        // see: https://www.youtube.com/watch?v=OOo69t_-uok
        this.background = this.add.image(this.scale.width / 2,this.scale.height / 2, 'background')
        // adding a character to scene - each character should have their own HP
        this.gumball = new Character(this, rightPos-tileSize, floorY + tileSize, 'gumball', 0, this.hp, MP, 100, 'GUMBALL', 'MAGIC', 0).setOrigin(0,1)
        this.anais = new Character(this, rightPos, floorY +tileSize, 'anais', 0, this.hp, MP, 400, 'ANAIS', 'SCIENCE', 1).setOrigin(0,1)
        this.darwin = new Character(this, rightPos + tileSize, floorY + tileSize, 'darwin', 0, this.hp, MP, 10, 'DARWIN', 'HEALING', 2).setOrigin(0,1)
        // adding each character health
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
        this.characters = [ this.gumball, this.anais, this.darwin ]

        // adding enemy to scene - enemy has their own prefab
        this.enemy = new Enemy(this, leftPos - tileSize, floorY + tileSize, 'penny', 0, HP, MP, 152, 'PENNY').setOrigin(0,1).setFlipX(true)
        // adding enemy stats
        this.enemy_hp = new HealthBar(this, centerX, tileSize / 4, this.enemy.health)
        this.add.bitmapText(this.hp_pos, this.enemy_hp.y, 'font', 'HP', 12)
        this.add.bitmapText(this.name_pos, this.enemy_hp.y, 'font', this.enemy.name, 12)
        this.enemy_health = this.add.bitmapText(this.health_pos, this.enemy_hp.y, 'font', this.enemy.health, 8)

        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // initializing temporary selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = this.add.image(0,0, 'container')
        const cursorSelect = this.add.image(-24,-20, 'cursor')
        const attack = this.add.bitmapText(-24, -8, 'font', "ATTACK", 8)
        this.charDisplay = this.add.bitmapText(-24, -20, 'font', this.characters[this.current_player].name, 8)
        // const item = this.add.bitmapText(-24, -8, 'font', "ITEM", 8)
        this.powerDisplay = this.add.bitmapText(-24, 4, 'font', this.characters[this.current_player].power, 8)
        const selection = this.add.container(rightPos, floorY + tileSize + 28 , [ container_bg , attack, this.charDisplay, this.powerDisplay, cursorSelect]) // .setVisible(false)


        // Game OVER flag
        this.gameOver = false
        
    }

    update() {
        const { left, right, up, down, space, shift } = this.keys
        // check for game over
        if (this.active_players == 0 || this.active_enemies == 0){
            this.gameOver = true
        }
        // restart game if game over
        if (this.gameOver){
            if (this.active_enemies == 0){
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'YOU WIN', 20).setOrigin(0.5)
                    this.textAdded = true
                }
            }
            // use boolean value to ensure that browser does not lag
            if (this.active_players == 0){
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'GAME OVER', 20).setOrigin(0.5)
                    this.textAdded = true
                }
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
            if (this.enemy.attacking == true) {
                this.enemyAttacking()
            }
            else if (this.enemy.attacking == false) {
                this.anais.hurt = false
                this.darwin.hurt = false
                this.gumball.hurt = false
            }
            
            if (Phaser.Input.Keyboard.JustDown(left)){ 
                // temporarily setting gumball to attack
                if (this.characters[this.current_player].collapsed == false){
                    this.player_attacking = true
                    // it is no longer the player's turn
                    this.player_turn = false
                    this.characters[this.current_player].willAttack = true
                }
            }

            if (Phaser.Input.Keyboard.JustDown(up)){
                this.charChange(1)
            }
            if (Phaser.Input.Keyboard.JustDown(down)){
                this.charChange(-1)
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

    enemyAttacking(){
        let livingCharacters = Array(3).fill(-1);
        for (let i = 0; i < this.characters.length; i++) {
            if (!this.characters[i].collapsed){
                // if character not collapsed put into array
                livingCharacters[i] = this.characters[i].index
            }
        }
        let select = Math.floor(Math.random() * livingCharacters.length)
        while (livingCharacters[select] == -1){
            select = Math.floor(Math.random() * livingCharacters.length)
        
        }
        this.characters[select].health -= this.enemy.attack_dmg
        this.characters[select].hurt = true
        this.enemy.attacking = false;
        // console.log(livingCharacters)
    }

    selectChoice(choice) {
        // selection menu options

        // if left and right button were clicked scroll through the characters
    }
    
    charChange(input){
        // allow the character to move through the character options
        
        // probably make an active characters array to ensure that only those who have a turn can go
        this.current_player += input
        if (this.current_player >= this.characters.length){
            this.current_player = 0
        }
        else if (this.current_player < 0){
            this.current_player = this.characters.length - 1
        }
        this.charDisplay.text = this.characters[this.current_player].name
        this.powerDisplay.text = this.characters[this.current_player].power
    }
    charAttack(){

    }
}