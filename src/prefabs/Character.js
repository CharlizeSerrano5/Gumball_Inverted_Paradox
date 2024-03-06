class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y , texture, frame, health, mana) {
        super(scene, x, y, texture, frame, health, mana)
        scene.add.existing(this)
        //setting physics body
        scene.physics.add.existing(this)
        
        // adding health
        // each character should have their own health bar that shows on the bottom of the screen
        this.hp = new HealthBar(scene, x, y - 110);

        // adding attack
        

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
    // the character is will just be performing a dance
    enter (scene, character) {
        
    }
    execute(scene, character) {
        character.anims.play('idle', true)
    }
}

class AttackState extends State {
    // character will play a temporary attack animation where they throw their character specific attack
    enter (scene, character) {
        // create a delay at the end of this animation to go back into the idle state
        
        character.anims.play('attack', true)
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

        character.anims.play('hurt', true)
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

        // use an assert to check if their health is depleted
        assert(character.health == 0);
        character.anims.play('collapse', true)
    }
    execute(scene, character) {

    }
}