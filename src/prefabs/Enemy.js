class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, name) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        
        // setting enemy properties
        this.health = health // Note: enemy will not have health bar
        this.name = name
        this.damagedTimer = 250
        // set up an attack
        this.attack = false
        this.attack_dmg = 0

        // adding attack
        console.log(this.health)
        console.log(this.name) // HAS A VALUE
        scene.enemyFSM = new StateMachine('default', {
            default: new DefaultState(),
            single_attack: new SingleAttackState(),
            damaged: new DamagedState(),
            defeat: new DefeatState(),
        },[scene, this])
    }
}

// enemy specific state classes will be performed for each attack 
class DefaultState extends State {
    // the enemy will be performing idle motion
    // in this state the enemy may only enter the attack and damaged state
    enter (scene, enemy) {
        // ensure enemy is not attacking in this scene
        enemy.attack_dmg = 0
        enemy.attack = false
        console.log("Current Enemy Dmg: " + enemy.attack_dmg)
        // console.log(`${enemy.name}`)
    }
    execute(scene, enemy) {       
        const { left, right, up, down, space, shift } = scene.keys
        // if player has attacked and it is not the player's turn
        if (scene.player_attack == true && scene.player_turn == false){
            this.stateMachine.transition('single_attack')
        }  

        //test 
        if (down.isDown){
            this.stateMachine.transition('single_attack')
        }
        
        
        
    }
}

class SingleAttackState extends State {
    // enemy will play a temporary attack animation where they throw their enemy specific attack
    enter (scene, enemy) {
        // set attack to true
        enemy.attack = true
        // play animation and delay till end of animation to go back into the idle state
        enemy.anims.play(`${enemy}_attack`, true)
        enemy.once('animationcomplete', () => {
            // at end of animation decrease health of player
            enemy.attack_dmg = 152 // NOTE: temp value
            console.log("Current Enemy Dmg: " + enemy.attack_dmg)
            // reset to the default state
            // this.stateMachine.transition('default')
        })

        // testing
        enemy.attack_dmg = 152
        console.log("Current Enemy Dmg: " + enemy.attack_dmg)
        scene.damage = enemy.attack_dmg
        this.stateMachine.transition('default')
    }
    execute(scene, enemy) {
        
    }
}

class DamagedState extends State {
    // enemy should be taking hits
    enter (scene, enemy) {
        console.log('damaged')
        // enemy.anims.play(`${enemy.name}_damaged`, true)
        enemy.setTint(0xFF0000)
        scene.time.delayedCall(enemy.damagedTimer, () => {
            enemy.clearTint()
            this.stateMachine.transition('default')
        })
    }
    execute(scene, enemy) {
        if (enemy.health == 0){
            // if health depleted after damaged animation defeat this enemy
            enemy.once('animationcomplete', () => {
                this.stateMachine.transition('defeat')
            })
        }
        
    }
}

class DefeatState extends State {
    // the enemy will be knocked out in this state
    enter (scene, enemy) {
        // maybe increase a variable to check how many players have defeatd
        console.log('defeat')
        console.log(enemy.health)
        enemy.anims.play(`${enemy}_defeat`, true)
    }
    execute(scene, enemy) {
        
    }
}