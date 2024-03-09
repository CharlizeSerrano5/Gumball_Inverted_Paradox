class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, power, name) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        
        // setting enemy properties
        this.health = health // Note: enemy will not have health bar
        this.name = name
        this.damagedTimer = temp_timer
        // set up an attack
        this.attacking = false
        this.dmgToPlayer = 0
        this.attack_dmg = power

        // setting up state machines
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
        enemy.dmgToPlayer = 0
        enemy.attacking = false
        scene.enemy_attacking
        scene.player_turn = true
        enemy.clearTint()
        enemy.anims.play(`${enemy.name}_default`, true)


        // console.log(`${enemy.name} (boss) defaulting, damage = ${enemy.dmgToPlayer}`)
    }
    execute(scene, enemy) {       
        const { left, right, up, down, space, shift } = scene.keys
        // if player has attacked and it is not the player's turn
        // temporarily commenting out
        // if (scene.player_attack == true && scene.player_turn == false){
        //     this.stateMachine.transition('single_attack')
        // }  

        if (scene.player_turn == false){
            this.stateMachine.transition('single_attack')
        }

        // if player has attacked enter hurt state and decrease health
        if (scene.player_attacking == true){
            // console.log('reached')
            this.stateMachine.transition('damaged')
        }

    }
}

// Note: create an attack where it only attacks one person using the array and randomizing it
// and create an attack where it attacks every character
// the attacks should be randomized after each character hits
class SingleAttackState extends State {
    // enemy will play a temporary attack animation where they throw their enemy specific attack
    enter (scene, enemy) {
        // the damage to player becomes the attack power of this enemy
        scene.time.delayedCall(enemy.damagedTimer, () => {
            // scene.player_attacking = true
            enemy.attacking = true
            enemy.dmgToPlayer = enemy.attack_dmg
        })
        
        
    }
    execute(scene, enemy) {
        if (enemy.attacking == false) {
            this.stateMachine.transition('default')   
        }
    }
}

class DamagedState extends State {
    // animation play after finished character attack
    enter (scene, enemy) { 
        enemy.health -= scene.dmgToEnemy
        // enemy.setTint(0xFF0000)    
        enemy.anims.play(`${enemy.name}_damaged`, true)

        if (enemy.health > 0){
            scene.time.delayedCall(enemy.damagedTimer * 2, () => {
                this.stateMachine.transition('default')
            })
        }
        
    }
    execute(scene, enemy) {
        if (enemy.health <= 0){
            // if health depleted after damaged animation defeat this enemy
            enemy.once('animationcomplete', () => {
                this.stateMachine.transition('defeat')
            })
            this.stateMachine.transition('defeat')
        }
        
    }
}

class DefeatState extends State {
    // the enemy will be knocked out in this state
    enter (scene, enemy) {
        // maybe increase a variable to check how many players have defeatd
        enemy.anims.play(`${enemy.name}_defeat`, true)
        // enemy.setTint('#A020F0')
        // console.log('ENEMY DEFEATED')
        scene.active_enemies -= 1
    }
    execute(scene, enemy) {
        
    }
}