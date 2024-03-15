class SelectionMenu extends Phaser.GameObjects.Graphics{
    constructor(scene, x, y, characters){
        super(scene, x, y)
        this.menu = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.scene = scene

        this.characters = characters
        
        // set the current player at the first one
        this.current_player = 0 // which character player is on
        this.current_attack = 0 // which attack is shown first
        this.current_selection = 2 // what the cursor is pointing at
        
        this.cursor_pos = -20

        this.allowSelect = true // to keep track if the player has attacked
        
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        this.container_bg = scene.add.image(x,y - 4, 'container')
        this.cursorImage = scene.add.image(x + -36, y + this.cursor_pos, 'cursor').setOrigin(0.5, 0)
        this.charDisplay = scene.add.bitmapText(x + -28, y + -20, 'font', this.characters[this.current_player].name, 8)
        this.item = scene.add.bitmapText(x + -28, y + -8, 'font', "PHONE", 8)
        this.powerDisplay = scene.add.bitmapText( x + -28, y + 4, 'font', this.characters[this.current_player].attackList[this.current_attack], 8)
        this.selections = [ this.powerDisplay, this.item, this.charDisplay ]
        this.selections[this.current_selection].setTint(0xDFFF00);
        this.availableChar = this.scene.checkActive()

        this.charCursor = scene.add.image(this.characters[this.current_player].x + 15, this.characters[this.current_player].y - tileSize * 1.5, 'char_cursor')
        this.attackingPlayer  = undefined // initialize an attacking Player
    
        this.summonSelect = false
    }

    updateAvailable() {
        // just to update available Char
        this.availableChar = this.scene.checkActive()
        return this.availableChar
    }

    // CURRENT PROBLEM - if the character we are looking at dies, they do not change characters
    // possible solution have a function updates the display or use charChange()
    select() {
        // only allow select if active
        // console.log('trying to select and the turn is ' + this.scene.player_turn + ' and we are allowed to select? ' + this.allowSelect)
        if (this.scene.player_turn == true && this.allowSelect == true){
            this.availableChar = this.updateAvailable()
            console.log(`THIS ${this.availableChar}\n\n`)
            if (this.current_selection == 0 ){
                // if cursor on the power selection
                // Attack choice
                if ( this.characters[this.availableChar[this.current_player]].collapsed == false && !this.characters[this.availableChar[this.current_player]].hasAttacked){
                    // NOTE: check if character has died
                    this.characters[this.availableChar[this.current_player]].willAttack = true
                    this.attackingPlayer =this.characters[this.availableChar[this.current_player]]
                    this.charChange(0);
                }
            }
            if (this.current_selection == 1 && !this.scene.summon.hasAttacked && this.scene.summon.summonUses && this.availableChar.length == 3){
                // call the summon attack 
                // set the selection to false
                this.allowSelect = false
                this.setVisibility(false)
                this.scene.changeTurn()
                console.log(this.scene.enemy.hasAttacked)
                this.scene.summon.attack()
                this.summonSelect = true

                // if the summon has been selected do not let the enemy attack

            }
        }
    }

    setVisibility(input) {
        // function to hide selection Menu after every attack
        // input is used for a boolean value
        this.container_bg.setVisible(input)
        this.cursorImage.setVisible(input)
        this.charDisplay.setVisible(input)
        this.item.setVisible(input)
        this.powerDisplay.setVisible(input)
    }

    lookChoice(input) {
        // selection menu options
        // if up and down selected then scroll through options
        this.selections[this.current_selection].clearTint()
        this.cursor_pos += -input*12
        
        this.current_selection += input
        if (this.current_selection > 2){
            this.current_selection = 0
            this.cursor_pos = 4
        }
        else if (this.current_selection < 0){
            this.current_selection = 3 - 1
            this.cursor_pos = -20
        }
        this.cursorImage.y = this.y + this.cursor_pos
        this.selections[this.current_selection].setTint(0xDFFF00)
    }

    charChange(input){
        this.availableChar = this.updateAvailable()
        this.current_player += input
        // when character is changed auto set the current attack to 0
        this.current_attack = 0
        
        // console.log(this.availableChar)
        // console.log(this.current_player)
        // console.log(this.characters[this.availableChar[this.current_player]])
        if (this.current_player >= this.availableChar.length){
                this.current_player = 0
        }
        else if (this.current_player < 0){
            this.current_player = this.availableChar.length - 1
        }
        if( this.characters[this.availableChar[this.current_player]].hasAttacked){
            this.charChange(1)
        }
        this.charCursor.x = this.characters[this.availableChar[this.current_player]].x+ 15
        console.log(this.availableChar)
        console.log(this.current_player)
        console.log(this.characters[this.availableChar[this.current_player]])

        this.charDisplay.text = this.characters[this.availableChar[this.current_player]].name
        this.powerDisplay.text = this.characters[this.availableChar[this.current_player]].attackList[this.current_attack]
        
    }

    attackChange(input){
        // using the same logic as charChange()
        // manuever through the selected characters attacks
        console.log(input)
        this.current_attack += input
        if (this.current_attack >= this.characters[this.availableChar[this.current_player]].attackList.length){
                this.current_attack = 0
        }
        else if (this.current_attack < 0){
            this.current_attack = this.characters[this.availableChar[this.current_player]].attackList.length - 1
        }
        console.log('current attack' + this.current_attack)
        this.powerDisplay.text = this.characters[this.availableChar[this.current_player]].attackList[this.current_attack]
    }

}