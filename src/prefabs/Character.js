class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, attack_dmg, name, power, index) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        
        // setting character properties
        this.index = index
        this.health = health
        this.name = name // for prints
        this.hurtTimer = 250
        this.power = power
        // setting up fighting damage
        this.attack_dmg = attack_dmg
        // creating a boolean value to check if the current character has attacked
        this.willAttack = false
        this.hurt = false
        this.collapsed = false
        // temporary check
        this.check = ''

        // scene.characterFSM = new StateMachine('idle', {
        scene.FSM_holder[index] = new StateMachine('idle', {
            idle: new IdleState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            collapse: new CollapseState(),
        },[scene, this])
    }
}

class IdleState extends State {
    // in this state the character may only enter the attack and hurt state
    enter (scene, character) {
        // player is not attacking in idle state
        scene.player_attacking = false
        scene.dmgToEnemy = 0

    }
    execute(scene, character) {
        const { left, right, up, down, space, shift } = scene.keys
        // perform idle animation
        // character.anims.play(`${character}_idle`, true)
        // if attack was selected enter the attack animation
        if (character.willAttack == true){
            this.stateMachine.transition('attack')
        }
        // if character was hit enter the hurt animation
        if(character.hurt) { // test one character at a time
            this.stateMachine.transition('hurt')
        }

    }
}

// IN PROGRESS - needs to select if attacking
class AttackState extends State {
    // character will play a temporary attack animation where they throw their character specific attack
    enter (scene, character) {
        // remove the enemies health
        scene.dmgToEnemy = character.attack_dmg 
        // create a delay at the end of this animation to go back into the idle state
        // character.anims.play(`${character}_attack`, true)
        // character.once('animationcomplete', () => {
        //     this.stateMachine.transition('idle')
        // })
        // end player attacking
        scene.player_turn = false
        character.willAttack = false
    }
    execute(scene, character) {
        // reset to idle
        if (character.willAttack == false){
            this.stateMachine.transition('idle')
        }
    }
}

class HurtState extends State {
    enter (scene, character) {
        // character.anims.play(`${character.name}_hurt`, true)
        character.setTint(0xFF0000)
        if (character.health > 0){
            scene.time.delayedCall(character.hurtTimer, () => {
                character.clearTint()
                if (character.health > 0){
                    this.stateMachine.transition('idle')
                }
            })
        }
        
    }
    execute(scene, character) {
        if (character.health <= 0){
            // if health depleted after hurt animation collapse this character
            this.stateMachine.transition('collapse')
            character.once('animationcomplete', () => {
                this.stateMachine.transition('collapse')
            })
        }
        

        
    }
}

class CollapseState extends State {
    // the character will be knocked out in this state
    enter (scene, character) {
        character.collapsed = true
        character.setTint('#A020F0')
        scene.active_players -= 1
        // character.anims.play(`${character}_collapse`, true)
        console.log(character.name + ' COLLAPSED')
        
    }
    execute(scene, character) {
        
    }
}