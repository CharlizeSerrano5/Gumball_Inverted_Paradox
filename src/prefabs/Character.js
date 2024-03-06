class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y , texture, frame, health, mana) {
        super(scene, x, y, texture, frame, health, mana)
        scene.add.existing(this)
        //setting physics body
        scene.physics.add.existing(this)
        

        scene.characterFSM = newStateMachine('idle', {
            idle: new IdleState(),
            attack: new AttackState()
        })
    }
}

// FOCUS ON SETTING UP CHARACTER CLASSES

// character specific state classes
class IdleState extends State {
    enter (scene, character) {
        
    }
    execute(scene, character) {
        character.anims.play('idle', true)
    }
}

class AttackState extends State {
    enter (scene, character) {
        character.anims.play('attack', true)
    }
    execute(scene, character) {

    }
}