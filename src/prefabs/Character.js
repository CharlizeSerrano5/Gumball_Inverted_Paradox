class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, attack_dmg, name, power, index) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.x = x
        this.y = y
        // setting character properties
        this.index = index
        this.health = health
        this.name = name // for prints
        this.hurtTimer = temp_timer
        this.power = power
        // setting up fighting damage
        this.attack_dmg = attack_dmg
        // creating a boolean value to check if the current character has attacked
        this.willAttack = false
        this.hurt = false
        this.collapsed = false
        this.hasAttacked = false
        // temporary check
        this.check = ''
        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height * 1.5, `${this.name}_projectile`, this)

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
        character.clearTint()

        character.hasAttacked = false
        


    }
    execute(scene, character) {
        const { left, right, up, down, space, shift } = scene.keys
        // perform idle animation
        character.anims.play(`${character.name}_idle`, true)
        // if attack was selected enter the attack animation
        if (character.willAttack == true){
            this.stateMachine.transition('attack')
        }
        // if the enemy is attacking
        if(scene.enemy.hasAttacked && scene.enemy.selectedChar == character.index) { // test one character at a time
            this.stateMachine.transition('hurt')
        }

    }
}

// IN PROGRESS - character has to go before boss can go
class AttackState extends State {
    // character will play a temporary attack animation where they throw their character specific attack
    enter (scene, character) {
        // remove the enemies health
        scene.dmgToEnemy = character.attack_dmg 
        
        character.setTint(0xDB91EF)
        while (character.projectile.x > scene.enemyX)
        
            character.projectile.move(scene.enemyX, scene.enemyY)
        scene.time.delayedCall(character.hurtTimer, () => {
            scene.player_attacking = true
            character.willAttack = false

            character.hasAttacked = true
        })
        
    }
    execute(scene, character) {
        // reset to idle
        if (character.willAttack == false){
            // once the player has finished attacking
            // scene.player_turn = false // temporarily placing
            character.projectile.reset(character.x)
            this.stateMachine.transition('idle')
        }

        if (character.hasAttacked = true){
            scene.player_turn = false
            this.stateMachine.transition('idle')
        }
    }
}

class HurtState extends State {
    enter (scene, character) {
        // character.anims.play(`${character.name}_hurt`, true)
        character.setTint(0xFF0000)
        
        // decrease health and update bar
        character.health -= scene.enemy.dmgToPlayer
        scene.characters_hp[scene.enemy.selectedChar].match(character.health)

        if (character.health > 0){
            scene.time.delayedCall(character.hurtTimer, () => {
                character.clearTint()
                if (character.health > 0){
                    this.stateMachine.transition('idle')
                }
            })
        }

        console.log('HURT')
        
    }
    execute(scene, character) {
        // PROBLEM FOREVER IN HURT STATE
        console.log("HURTING")
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
        character.anims.play(`${character.name}_collapse`, true)
        character.collapsed = true
        character.setTint(0xA020F0)
        scene.active_players -= 1
        console.log(character.name + ' COLLAPSED')   
    }
    execute(scene, character) {
        
    }
}