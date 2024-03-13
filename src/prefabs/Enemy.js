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
        // variable to check
        this.hasAttacked = false

        // setting up the character to attack
        this.selectedChar = -1
        // this.damaged = false

        // setting up state machines
        scene.enemyFSM = new StateMachine('default', {
            default: new DefaultState(),
            single_attack: new SingleAttackState(),
            damaged: new DamagedState(),
            defeat: new DefeatState(),
        },[scene, this])
    }

    charAttacking(livingCharacters){
        // function to choose which character to attack
        let select = Math.floor(Math.random() * livingCharacters.length)
            while (livingCharacters[select] == -1){
                select = Math.floor(Math.random() * livingCharacters.length)
            
            }
        return select
    }
}

// enemy specific state classes will be performed for each attack 
class DefaultState extends State {
    // the enemy will be performing idle motion
    // in this state the enemy may only enter the attack and damaged state
    enter (scene, enemy) {
        // scene.choiceMenu.setVisible(true)
        enemy.damaged = false
        // ensure enemy is not attacking in this scene
        enemy.hasAttacked = false
        enemy.dmgToPlayer = 0
        scene.enemy_attacking
        // scene.player_turn = true
        enemy.clearTint()
        enemy.anims.play(`${enemy.name}_default`, true)
        

        // console.log(`${enemy.name} (boss) defaulting, damage = ${enemy.dmgToPlayer}`)
    }
    execute(scene, enemy) {       
        const { left, right, up, down, space, shift } = scene.keys
        // if it is not the player's turn attack
        if(scene.player_turn == false && enemy.hasAttacked == false){
            this.stateMachine.transition('single_attack')
        }

        // if enemy has been damaged
        if ( scene.dmgToEnemy ){
            this.stateMachine.transition('damaged')
        }

    }
}

class SingleAttackState extends State {
    // enemy will randomize their attack on a character
    enter (scene, enemy) {
        // the damage to player becomes the attack power of this enemy
        scene.time.delayedCall(enemy.damagedTimer, () => {
            enemy.dmgToPlayer = enemy.attack_dmg
            enemy.hasAttacked = true
        })
        enemy.selectedChar = enemy.charAttacking(scene.checkLiving())
        scene.characters[enemy.selectedChar].hurt = true
        // enemy.hasAttacked = true
        this.attackText_below = scene.add.bitmapText(centerX, centerY+1, 'font',  `${scene.characters[enemy.selectedChar].name} takes ${enemy.dmgToPlayer} damage`, 12).setOrigin(0.5).setTint(0x1a1200)
        this.attackText = scene.add.bitmapText(centerX, centerY, 'font',  `${scene.characters[enemy.selectedChar].name} takes ${enemy.dmgToPlayer} damage`, 12).setOrigin(0.5)

    }
    execute(scene, enemy) {
        if (enemy.hasAttacked == true) {
            // reset the selected char here (TEMP)
            this.selectedChar = -1
            scene.changeTurn()
            this.attackText_below.setVisible(false)
            this.attackText.setVisible(false)
            this.stateMachine.transition('default')   
        }   
        

    }
}

class DamagedState extends State {
    // animation play after finished character attack
    enter (scene, enemy) { 
        // scene.choiceMenu.setVisible(false)
        enemy.health -= scene.dmgToEnemy
        enemy.setTint(0xFF0000)    
        enemy.anims.play(`${enemy.name}_damaged`, true)
        scene.enemy_hp.match(enemy.health)
        let damage = scene.add.bitmapText(enemy.x, enemy.x + tileSize*1.5, 'font', -scene.dmgToEnemy, 8).setOrigin(0, 0).setTint(0xFF0000)

        
        enemy.once('animationcomplete', () => {
            damage.setVisible(false)
            if (enemy.health > 0){
                this.stateMachine.transition('default')
            }
            if (enemy.health <= 0){
                this.stateMachine.transition('defeat')
            }
        })
        
                
    }

}

class DefeatState extends State {
    // the enemy will be knocked out in this state
    enter (scene, enemy) {
        // maybe increase a variable to check how many players have defeatd
        enemy.anims.play(`${enemy.name}_defeat`, true)
        // enemy.setTint('#A020F0')
        scene.active_enemies -= 1
    }
    execute(scene, enemy) {
        
    }
}