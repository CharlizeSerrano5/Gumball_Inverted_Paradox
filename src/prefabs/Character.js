class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, name) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        //setting physics body
        // scene.physics.add.existing(this)
        
        // setting character properties
        this.health = health
        this.name = name
        this.hurtTimer = 250

        // adding health
        // each character should have their own health bar that shows on the bottom of the screen
            // this.hp = new HealthBar(scene, x-tileSize, y - 110);

        // adding attack
        console.log(this.health)
        console.log(this.name) // HAS A VALUE
        scene.characterFSM = new StateMachine('idle', {
            idle: new IdleState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            collapse: new CollapseState(),
        })
    }
}

// FOCUS ON SETTING UP CHARACTER CLASSES

// character specific state classes will only be performed for animations!
class IdleState extends State {
    // the character will be performing idle motion
    // in this state the character may only enter the attack and hurt state
    enter (scene, character) {
        
        // console.log(character.name)
        // console.log(`${character.name}`)
    }
    execute(scene, character) {
        // const { left, right, up, down, space, shift } = scene.keys
        // character.anims.play(`${character}_idle`, true)

        // if attack was selected enter the attack animation
        // if(Phaser.Input.Keyboard.JustDown(down)) {
        //     this.stateMachine.transition('hurt')
        //     return
        // }
        // if character was hit enter the hurt animation
        
        
        
    }
}

class AttackState extends State {
    // character will play a temporary attack animation where they throw their character specific attack
    enter (scene, character) {
        // create a delay at the end of this animation to go back into the idle state
        
        character.anims.play(`${character}_attack`, true)
        character.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, character) {

    }
}

class HurtState extends State {
    // character should be taking hits
    enter (scene, character) {
        console.log('hurt')
        // character.anims.play(`${character.name}_hurt`, true)
        character.setTint(0xFF0000)
        scene.time.delayedCall(character.hurtTimer, () => {
            character.clearTint()
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, character) {
        if (character.health == 0){
            // if health depleted after hurt animation collapse this character
            character.once('animationcomplete', () => {
                this.stateMachine.transition('collapse')
            })
        }
        
    }
}

class CollapseState extends State {
    // the character will be knocked out in this state
    enter (scene, character) {
        // maybe increase a variable to check how many players have collapsed
        console.log('collapsed')

        // use an assert to check if their health is depleted
        // assert(character.health == 0);
        console.log(character.health)
        character.anims.play(`${character}_collapse`, true)
    }
    execute(scene, character) {
        
    }
}