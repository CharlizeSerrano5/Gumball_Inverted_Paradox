class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene")
    }

    init() {
        // dialog constants
        this.DBOX_X = centerX			        // dialog box x-position
        this.DBOX_Y = 170			    // dialog box y-position
        this.DBOX_FONT = 'font'	    // dialog box font key

        this.TEXT_X = 20			    // text w/in dialog box x-position
        this.TEXT_Y = 180			    // text w/in dialog box y-position
        this.TEXT_SIZE = 8		        // text font size (in pixels)
        this.TEXT_MAX_WIDTH = 300	    // max width of text within box

        this.NEXT_TEXT = '*SPACE*'	    // text to display for next prompt
        this.NEXT_X = centerX			    // next text prompt x-position
        this.NEXT_Y = 170			    // next text prompt y-position

        this.LETTER_TIMER = 10		    // # ms each letter takes to "type" onscreen

        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogSpeaker = null		// current speaker
        this.dialogLastSpeaker = null	// last speaker
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typing

        // character variables
        this.tweenDuration = 500        // character in/out tween duration

        this.OFFSCREEN_X = -500         // x,y coordinates used to place characters offscreen
        this.OFFSCREEN_Y = 1000

        this.hp = HP
        this.mp = MP
        this.placement = 2
        this.FSM_holder = Array(3).fill(0)
        
        this.music_playing = false

    }

    create() {
        this.background = this.add.image(this.scale.width / 1.5,this.scale.height / 2.5 , 'livingroom').setScale(0.4)

        this.music = this.sound.add('music').setLoop(true).setVolume(0.4)

        // parse dialog from JSON file
        this.dialog = this.cache.json.get('dialog')
        //console.log(this.dialog)

        // add dialog box sprite
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0.5, 0)

        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)

        // ready the character dialog images offscreen
        this.gumball = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'gumball_talk').setOrigin(0, 1)
        this.anais = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'anais_talk').setOrigin(0, 1)
        this.darwin = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'darwin_talk').setOrigin(0, 1)
        
        this.gumball_char = new Character(this, centerX  + tileSize, floorY + tileSize /1.5, 'gumball', 0, this.hp, MP, 30, 'GUMBALL', 'MAGIC', 'physical', 0).setOrigin(0,1)
        this.gumball_char.addAttack("SCRATCH", 120, 0);
        this.gumball_char.addAttack("MAGIC", 50, 10, 1);
        this.anais_char = new Character(this, leftPos +tileSize, floorY +tileSize / 1.5, 'anais', 0, this.hp, MP, 50, 'ANAIS', 'SCIENCE', 'mage', 1).setOrigin(0,1).setFlipX(true)
        this.anais_char.addAttack("PUNCH", 25, 0);
        this.anais_char.addAttack("SCIENCE", 200, 25, 1);
        this.darwin_char = new Character(this, leftPos + tileSize * 2, floorY + tileSize / 1.5, 'darwin', 0, this.hp, MP, 10, 'DARWIN', 'SUPPORT', 'mage', 2).setOrigin(0,1).setFlipX(true)
        this.darwin_char.addAttack("SLAP", 40, 0);
        this.darwin_char.addAttack("SUPPORT", 40, 15, 1);

        this.gumball_hp = new HealthBar(this, centerX,  tileSize - this.placement, this.gumball_char, 0)
        this.gumball_mp = new ManaBar(this, centerX + tileSize * 3 + 12, tileSize - this.placement , this.gumball_char, 0)
        
        // this.anais_hp = new HealthBar(this, centerX, tileSize *1.5 -this.placement *1.5, this.anais_char, 0)
        // this.anais_mp = new ManaBar(this, centerX + tileSize * 3 + 12, tileSize *1.5 - this.placement *1.5, this.anais_char, 1)

        // this.darwin_hp = new HealthBar(this, centerX,  tileSize * 2 - this.placement *2, this.darwin_char, 2)
        // this.darwin_mp = new ManaBar(this, centerX + tileSize * 3 + 12,  tileSize * 2 - this.placement *2, this.darwin_char, 1)
        this.characters = [ this.gumball_char, this.anais_char, this.darwin_char ]
        // this.characters_hp = [ this.gumball_hp, this.anais_hp, this.darwin_hp ]
        // this.characters_mp = [ this.gumball_mp, this.anais_mp, this.darwin_mp ]


        
        // place a hidden enemy
        this.enemy = new Enemy(this, centerX, -1000, 'penny', 0, HP, MP, 152, 'PENNY').setOrigin(0,1).setFlipX(true)

        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()
        this.selectionMenu = new SelectionMenu(this, centerX + tileSize * 2,  floorY - tileSize * 2, this.characters)
        this.selectionMenu.setVisibility(false)
        this.selectionMenu.allowSelect = false
        this.tutorial = this.add.bitmapText(centerX , 10 , 'font', "Note: Navigate with Arrow Keys", 8).setOrigin(0.5)
        

        this.cursor_demo = this.add.image(rightPos, floorY + tileSize *2, 'cursor').setVisible(false)
        // this.char_cursor_demo = this.add.image(rightPos + tileSize, floorY +tileSize *2, 'char_cursor')

        // start first dialog conversation
        this.typeText()
        
        // setting up convo sound
        this.talking_sound = this.sound.add('talking').setVolume(2)


    }

    update() {
        if (!this.music_playing){
            this.music.play()
            this.music_playing = true
        }


        // check for spacebar press
        const { left, right, up, down, space, shift } = this.keys
        if (Phaser.Input.Keyboard.JustDown(shift)){
            this.music.stop()
            this.scene.start('menuScene')
        }
        this.FSM_holder[0].step()
        this.FSM_holder[1].step()
        this.FSM_holder[2].step()
        if(!this.dialogTyping) {
            this.cursor_demo.setVisible(false)
            if (this.dialogConvo == 1 && this.dialogLine == 3){
                // console.log('we are now discussing the tutorial')
                this.selectionMenu.allowSelect = true
                this.selectionMenu.setVisibility(true)
                this.tutorial.setVisible(true)
                this.cursor_demo.setVisible(true)
                // add pngs and gifs describing tutorial
            }
            if (this.dialogConvo == 1 && this.dialogLine == 5){
                // tutorial
                if (this.selectionMenu.current_selection == 2){
                    this.cursor_demo.setVisible(true)
                        if (Phaser.Input.Keyboard.JustDown(right)){
                            this.selectionMenu.charChange(1)
                            this.typeText()

                        }
                        if (Phaser.Input.Keyboard.JustDown(left)){
                            this.selectionMenu.charChange(-1)
                            this.typeText()
                        }
                    
                }
            }
            else if (this.dialogConvo == 1 && this.dialogLine == 7){
                // tutorial
                if (this.selectionMenu.current_selection == 0){
                        
                        if (Phaser.Input.Keyboard.JustDown(right)){
                            this.selectionMenu.attackChange(1)
                            this.typeText()

                        }
                        if (Phaser.Input.Keyboard.JustDown(left)){
                            this.selectionMenu.attackChange(-1)
                            this.typeText()
                        }
                    
                }
            }
            else if (Phaser.Input.Keyboard.JustDown(space)){
                this.typeText() // trigger dialog
            }
            
        
        }
        


        if (this.selectionMenu.allowSelect) {
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

    typeText() {
        // this.talking_sound.play()
        console.log('typing')
        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''

        /* JSON dialog structure: 
            - each array within the main JSON array is a "conversation"
            - each object within a "conversation" is a "line"
            - each "line" can have 3 properties: 
                1. a speaker (required)
                2. the dialog text (required)
                3. an (optional) flag indicating if this speaker is new
        */

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
            this.dialogLine = 0
            // I increment the conversation count here...
            // ..but you could create logic to exit if each conversation was self-contained
            this.dialogConvo++
        }
        
        // make sure we haven't run out of conversations...
        if(this.dialogConvo >= this.dialog.length) {
            // here I'm exiting the final conversation to return to the title...
            // ...but you could add alternate logic if needed
            console.log('End of Conversations')
            // tween out prior speaker's image
            if(this.dialogLastSpeaker) {
                this.tweens.add({
                    targets: this[this.dialogLastSpeaker],
                    x: this.OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear',
                    onComplete: () => {
                        this.music.stop()
                        this.scene.start('fightingScene')
                    }
                })
            }
            // make text box invisible
            this.dialogbox.visible = false

        } else {
            // if not, set current speaker
            this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
            // check if there's a new speaker (for exit/enter animations)
            if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
                // tween out prior speaker's image
                if(this.dialogLastSpeaker) {
                    this.tweens.add({
                        targets: this[this.dialogLastSpeaker],
                        x: this.OFFSCREEN_X,
                        duration: this.tweenDuration,
                        ease: 'Linear'
                    })
                }
                // tween in new speaker's image
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: 30,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                })
            }

            // build dialog (concatenate speaker + colon + line of text)
            this.combinedDialog = 
                this.dialog[this.dialogConvo][this.dialogLine]['speaker'].toUpperCase() 
                + ': ' 
                + this.dialog[this.dialogConvo][this.dialogLine]['dialog']

            // create a timer to iterate through each letter in the dialog text
            let currentChar = 0
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.combinedDialog.length - 1,
                callback: () => { 
                    // concatenate next letter from dialogLines
                    this.dialogText.text += this.combinedDialog[currentChar]
                    // advance character position
                    currentChar++
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1)
                        this.dialogTyping = false   // un-lock input
                        this.textTimer.destroy()    // destroy timer
                    }
                },
                callbackScope: this // keep Scene context
            })
            
            // final cleanup before next iteration
            this.dialogText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialog
            this.dialogLine++                               // increment dialog line
            this.dialogLastSpeaker = this.dialogSpeaker     // set past speaker
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