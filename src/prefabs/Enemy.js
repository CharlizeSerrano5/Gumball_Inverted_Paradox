class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, power, name) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setImmovable(true)
        // setting enemy properties
        this.health = health 
        this.name = name
        this.damagedTimer = temp_timer
        // set up an attack
        this.attacking = false
        this.dmgToPlayer = 0
        this.attack_dmg = power
        // variable to check
        this.hasAttacked = false

        // setting up the character to attack
        // this.selectedChar = -1

        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height * 1.5, `${this.name}_projectile`, this)
        this.startY = y

        // setting up state machines
        scene.enemyFSM = new StateMachine('default', {
            default: new DefaultState(),
            single_attack: new SingleAttackState(),
            damaged: new DamagedState(),
            defeat: new DefeatState(),
            reset: new ResetState(),
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
    enter (scene, enemy) {
        console.log("ENEMY ENTERING DEFAULT")
        enemy.damaged = false
        enemy.dmgToPlayer = 0
        scene.dmgToEnemy = 0
        // scene.player_turn = true
        enemy.clearTint()
        enemy.anims.play(`${enemy.name}_default`, true)
        
        // console.log(`${enemy.name} (boss) defaulting, damage = ${enemy.dmgToPlayer}`)
    }
    execute(scene, enemy) {       
        const { left, right, up, down, space, shift } = scene.keys
        // if the enemy's y is not at the original location move it back

        // Note: might make a brand new state
        
        // if it is not the player's turn and there exists no currently attacking player AND there exists no summon
        if(scene.player_turn == false && enemy.hasAttacked == false && !scene.selectionMenu.attackingPlayer && !scene.selectionMenu.summonSelect){
            console.log("ENEMY ENTERING ATTACK")
            // entered once
            this.stateMachine.transition('single_attack')
            
        }  
        // save the used projectile from the input from selectionmenu
        if (scene.selectionMenu.attackingPlayer){         
            // console.log(scene.selectionMenu.attackingPlayer.projectile.x)      
            scene.physics.add.collider(scene.selectionMenu.attackingPlayer.projectile, enemy, () => {
                let collision = scene.selectionMenu.attackingPlayer.projectile.handleCollision(enemy, scene.dmgToEnemy)
                if ( collision == true){
                    scene.selectionMenu.attackingPlayer.projectile.resetProj(scene.selectionMenu.attackingPlayer.projectile.startX, scene.selectionMenu.attackingPlayer.projectile.startY)
                    this.stateMachine.transition('damaged')
                }
            }, null, scene)
        }

        // check if the summon was selected instead
        if (scene.selectionMenu.summonSelect){
            console.log('summon selected now checking enemy collision')
            scene.physics.add.collider(scene.summon.projectile, enemy, () => {
                let collision = scene.summon.projectile.handleCollision(enemy, scene.dmgToEnemy)
                if ( collision == true){
                    scene.summon.projectile.resetProj(scene.summon.projectile.startX, scene.summon.projectile.startY)
                    // reset the selection menu
                    // for debugging
                    // scene.summon.hasAttacked = true
                    // scene.selectionMenu.summonSelect = false
                    this.stateMachine.transition('damaged')
                }
            }, null, scene)
        }
    }
}

class SingleAttackState extends State {
    // enemy will randomize their attack on a character
    enter (scene, enemy) {
        // turn off player selection
        scene.selectionMenu.allowSelect = false
        // select a character
        enemy.selectedChar = enemy.charAttacking(scene.checkLiving())
        
        // move enemy to the top
        if (enemy.y > centerY){
            enemy.body.setVelocityY(-50)
        }
    }
    execute(scene, enemy) {
        
        // once we have reached the top 
        if (enemy.y <= centerY){
            if (enemy.hasAttacked == false){
                enemy.body.setVelocityY(0)
                // console.log("STOPPED")
                enemy.anims.play(`${enemy.name}_singleAttack`, true)
                enemy.once('animationcomplete', ()=> {
                    enemy.projectile.move(scene.characters[enemy.selectedChar])
                    enemy.hasAttacked = true
                    enemy.dmgToPlayer = enemy.attack_dmg
                })
            }
            else{
                if (enemy.y < enemy.startY){
                    enemy.body.setVelocityY(50)
                }
            }
        }
        else{
            if (enemy.y >= enemy.startY && enemy.hasAttacked == true){
                enemy.body.setVelocity(0)
            }
            if (scene.characters[enemy.selectedChar].hurt == true && enemy.y >= enemy.startY) {
                //selection menu 
                scene.selectionMenu.allowSelect = true
                scene.changeTurn()
                console.log('player turn is ' + scene.player_turn)
                console.log('character has been hurt')
                enemy.hasAttacked = false
                this.stateMachine.transition('default')
                // go back to default
            }   
        }
        
    }
}

class ResetState extends State {

}

class DamagedState extends State {
    // animation play after finished character attack
    enter (scene, enemy) { 
        // scene.choiceMenu.setVisible(false)
        scene.selectionMenu.attackingPlayer = undefined
        let damageTaken
        if (scene.selectionMenu.summonSelect){
            // if the summon was selected then
            damageTaken = scene.summon.damage
        }
        else{
            damageTaken = scene.dmgToEnemy
        }
        enemy.health -= damageTaken
        enemy.setTint(0xFF0000)    
        enemy.anims.play(`${enemy.name}_damaged`, true)
        scene.enemy_hp.match(enemy.health)
        let damage = scene.add.bitmapText(enemy.x, enemy.x + tileSize*1.5, 'font', -damageTaken, 8).setOrigin(0, 0).setTint(0xFF0000)

        enemy.once('animationcomplete', () => {
            damage.setVisible(false)
            scene.selectionMenu.allowSelect = true
            scene.selectionMenu.summonSelect = false

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
        enemy.anims.play(`${enemy.name}_defeat`, true)
        // enemy.setTint('#A020F0')
        scene.active_enemies -= 1
    }
    execute(scene, enemy) {
        
    }
}