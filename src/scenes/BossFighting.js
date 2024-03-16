class BossFighting extends Phaser.Scene {
    constructor(){
        super('bossfightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP
        // boolean to check if it is the player's turn (start off with the player going first)
        this.player_turn = true

        this.active_players = 3 // Note: with more scenes turn this into a global variable
        this.active_enemies = 1 // Note: in future scenes it may change the amount
        this.FSM_holder = Array(3).fill(0)
        this.textAdded = false
        // initializing the amt the player will do to the enemy
        this.dmgToEnemy = 0
        this.enemy_dmg = 0

        this.enemyX = leftPos - tileSize
        this.enemyY = floorY + tileSize
        
        this.music_playing = false

        // setting up buttons
        // see: https://blog.ourcade.co/posts/2020/phaser-3-ui-menu-selection-cursor-selector/
        
    }

    create() {
        // initializing a background
        // see: https://www.youtube.com/watch?v=OOo69t_-uok
        this.background = this.add.image(this.scale.width / 2,this.scale.height / 2 - tileSize * 1.55, 'background')
        // adding music
        this.music = this.sound.add('fight_music').setLoop(true).setVolume(0.4)
        
        // adding a character to scene - each character should have their own HP
        this.gumball = new Character(this, rightPos-tileSize, floorY + tileSize /1.5, 'gumball', 0, this.hp, MP, 30, 'GUMBALL', 'MAGIC', 'physical', 0).setOrigin(0,1)
        this.gumball.attackList = [ 'SCRATCH', 'MAGIC']

        this.anais = new Character(this, rightPos, floorY +tileSize / 1.5, 'anais', 0, this.hp, MP, 50, 'ANAIS', 'SCIENCE', 'mage', 1).setOrigin(0,1)
        this.anais.attackList = [ 'PUNCH', 'SCIENCE' ]

        this.darwin = new Character(this, rightPos + tileSize, floorY + tileSize / 1.5, 'darwin', 0, this.hp, MP, 10, 'DARWIN', 'SUPPORT', 'mage', 2).setOrigin(0,1)
        this.darwin.attackList = [ 'SLAP', 'SUPPORT' ]
        // adding each character health
        this.gumball_hp = new HealthBar(this, centerX, floorY + tileSize, this.gumball, 0)
        this.gumball_mp = new ManaBar(this, centerX + tileSize * 3 + 12, floorY + tileSize, this.gumball, 0)
        
        this.anais_hp = new HealthBar(this, centerX,floorY+ tileSize *1.5, this.anais, 0)
        this.anais_mp = new ManaBar(this, centerX + tileSize * 3 + 12, floorY+ tileSize *1.5, this.anais, 1)

        this.darwin_hp = new HealthBar(this, centerX, floorY + tileSize * 2, this.darwin, 2)
        this.darwin_mp = new ManaBar(this, centerX + tileSize * 3 + 12, floorY + tileSize * 2, this.darwin, 1)

        // adding all characters into an array to loop all the characters
        this.characters = [ this.gumball, this.anais, this.darwin ]
        this.characters_hp = [ this.gumball_hp, this.anais_hp, this.darwin_hp ]
        this.characters_mp = [ this.gumball_mp, this.anais_mp, this.darwin_mp ]

        // adding enemy to scene - enemy has their own prefab
        this.enemy = new Enemy(this, leftPos - tileSize, floorY + tileSize / 1.5, 'penny', 0, HP, MP, 152, 'PENNY').setOrigin(0,1).setFlipX(true)
        this.enemy_hp = new HealthBar(this, centerX, tileSize / 4, this.enemy)
        // enemy does not need mana

        this.summon = new Summon(this, rightPos - tileSize * 3, game.config.height + 100, 'nicole', 200).setOrigin(0,1)


        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // this.selectionMenu = new SelectionMenu(this, game.config.width - tileSize - 5, floorY + tileSize + 25, this.characters)
        this.selectionMenu = new SelectionMenu(this, game.config.width - tileSize - 5,  tileSize + 25, this.characters)

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
            // check gameover condition
            if (this.active_enemies == 0){
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'YOU WIN', 20).setOrigin(0.5)
                    this.add.bitmapText(centerX, centerY - tileSize, 'font', 'up for menu right to restart', 8).setOrigin(0.5)
                    this.textAdded = true
                    
                }
            }
            if (this.active_players == 0){
                // use boolean value to ensure that browser does not lag
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'GAME OVER', 20).setOrigin(0.5)
                    this.add.bitmapText(centerX, centerY - tileSize, 'font', 'up for menu right to restart', 8).setOrigin(0.5)

                    this.textAdded = true
                }
            }
            if (up.isDown){
                this.music.stop()
                this.scene.start('menuScene')
            }
            if (right.isDown){
                this.music.stop()
                this.scene.restart()
            }
        }
        if (!this.gameOver){
            // for debugging
            // console.log("enemy attacked=" + this.enemy.hasAttacked +', ' + this.characters[0].name + this.characters[0].state + ' , ' + this.characters[1].name + this.characters[1].state + ' , ' + this.characters[2].name + this.characters[2].state)

            if (!this.music_playing){
                this.music.play()
                this.music_playing = true
            }
            this.FSM_holder[0].step()
            this.FSM_holder[1].step()
            this.FSM_holder[2].step()
            this.enemyFSM.step()
        
            if (Phaser.Input.Keyboard.JustDown(space)){
                this.selectionMenu.select()
            }
            if (this.selectionMenu.current_selection == 0){
                if (Phaser.Input.Keyboard.JustDown(right)){
                    this.selectionMenu.attackChange(1)
                }
                if (Phaser.Input.Keyboard.JustDown(left)){
                    this.selectionMenu.attackChange(-1)
                }
            }
            
            if (this.selectionMenu.current_selection == 2){
                if (Phaser.Input.Keyboard.JustDown(right)){
                    this.selectionMenu.charChange(1)
                }
                if (Phaser.Input.Keyboard.JustDown(left)){
                    this.selectionMenu.charChange(-1)
                }
            }
            
            if (Phaser.Input.Keyboard.JustDown(up)){
                this.selectionMenu.lookChoice(1)
            }
            if (Phaser.Input.Keyboard.JustDown(down)){
                this.selectionMenu.lookChoice(-1)
            }
        } 
    }
    checkActive(){
        let availableChar = Array(0);
        for (let i = 0; i < this.characters.length; i++) {
            if (!this.characters[i].hasAttacked && !this.characters[i].collapsed){
                // if character not collapsed nor attacked put into array 
                availableChar.push(this.characters[i].index) 
            }
        }
        // if availableChar's length == 0 then end turn
        if (availableChar.length == 0){
            this.changeTurn()
            // reset the move amount
            availableChar = this.resetAttacks()
        }
        return availableChar
    }

    resetAttacks() {
        let availableCharacters = Array(0)
        for (let i = 0; i < this.characters.length; i++) {
            // if this character has not attacked
            if (!this.characters[i].collapsed){
                this.characters[i].hasAttacked = false
                availableCharacters.push(this.characters[i].index)
            }
        }
        return availableCharacters
    }

    changeTurn(){
        // when turn is changed reset the count of how many times character can be used
        if (this.player_turn == false){
            this.selectionMenu.moves = 3

            this.player_turn = true
            this.selectionMenu.setVisibility(true)
            // this.selectionMenu.allowSelect = true
        }
        else if (this.player_turn == true){
            this.player_turn = false
            this.selectionMenu.setVisibility(false)
            // this.selectionMenu.allowSelect = true
        }
        
    }

    checkLiving(){
        // function to update living characters
        let livingCharacters = Array(3).fill(-1);

        for (let i = 0; i < this.characters.length; i++) {
            if (!this.characters[i].collapsed){
                // if character not collapsed put into array
                livingCharacters[i] = this.characters[i].index
            }
        }
        return livingCharacters
            
    }


}