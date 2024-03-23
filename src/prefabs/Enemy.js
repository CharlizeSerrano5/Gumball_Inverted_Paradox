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
        this.dmgToPlayer = 0 // init to allow the dmgToPlayer to change
        this.attack_dmg = power
        this.startY = y
        // boolean values to check
        this.attacking = false
        this.hasAttacked = false
        this.hurt = false

        // setting up the character to attack
        // this.selectedChar = -1

        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height * 1.5, `enemy_projectile`, this).setScale(2)

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
        enemy.hasAttacked = false
        enemy.dmgToPlayer = 0
        scene.dmgToEnemy = 0
        // scene.player_turn = true
        enemy.clearTint()
        enemy.anims.play(`${enemy.name}_default`, true)
        console.log(`player turn: ${scene.player_turn}, enemy hasAttacked: ${enemy.hasAttacked}, selection menu attackingPlayer: ${scene.selectionMenu.attackingPlayer}, selection menu summonSelect: ${scene.selectionMenu.summonSelect}`)
        
        // console.log(`${enemy.name} (boss) defaulting, damage = ${enemy.dmgToPlayer}`)
    }
    execute(scene, enemy) {       
        const { left, right, up, down, space, shift } = scene.keys        
        // if it is not the player's turn and there exists no currently attacking player AND there exists no summon
        if(scene.player_turn == false && enemy.hasAttacked == false && !scene.selectionMenu.attackingPlayer && !scene.selectionMenu.summonSelect){
            console.log("ENEMY ENTERING ATTACK")
            // entered once
            this.stateMachine.transition('single_attack')
            
        }  
        // if a character has been selected to attack
        // if (scene.selectionMenu.attackingPlayer){         
        //     // add a collider to collide with the incoming player projectile
        //     scene.physics.add.collider(scene.selectionMenu.attackingPlayer.projectile, enemy, () => {
        //         // create a collision to transition into damaged
        //         console.log(scene.selectionMenu.attackingPlayer)
        //         let collision = scene.selectionMenu.attackingPlayer.projectile.handleCollision(enemy, scene.dmgToEnemy)
        //         if ( collision == true){
        //             scene.selectionMenu.attackingPlayer.projectile.resetProj(scene.selectionMenu.attackingPlayer.projectile.startX, scene.selectionMenu.attackingPlayer.projectile.startY)
        //             this.stateMachine.transition('damaged')
        //         }
        //     }, null, scene)

        //     if (Object.entries(scene.selectionMenu.characters[scene.selectionMenu.availableChar[scene.selectionMenu.current_player]].attackList)[scene.selectionMenu.current_attack][1][2] == 0) {
        //         if (scene.selectionMenu.characters[scene.selectionMenu.availableChar[scene.selectionMenu.current_player]].hasAttacked == true) {
        //             this.stateMachine.transition('damaged')
        //         }
        //     }
        // }
        if (enemy.hurt == true) {
            this.stateMachine.transition('damaged')
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
        console.log("enemy is attacking")
        scene.selectionMenu.allowSelect = false
        // select a character
        enemy.selectedChar = enemy.charAttacking(scene.checkLiving())
        scene.characters[enemy.selectedChar].body.enable = true
        
        // move enemy to the top
        // if (enemy.y > centerY){
        //     enemy.body.setVelocityY(-50)
        // }
        scene.physics.moveTo(enemy, enemy.x, centerY, 50)
        this.ready = false
        this.animation_played = false
    }
    execute(scene, enemy) {
        
        // once we have reached the top 
        // if (enemy.y <= centerY){
        //     if (enemy.hasAttacked == false){
        //         enemy.body.setVelocityY(0)
        //         // console.log("STOPPED")
        //         enemy.anims.play(`${enemy.name}_singleAttack`, true)
        //         enemy.once('animationcomplete', ()=> {
        //             enemy.projectile.move(scene.characters[enemy.selectedChar])
        //             enemy.hasAttacked = true
        //             enemy.dmgToPlayer = enemy.attack_dmg
        //         })
        //     }
        //     else{
        //         if (enemy.y < enemy.startY){
        //             enemy.body.setVelocityY(50)
        //         }
        //     }
        // }
        // else{
        //     if (enemy.y >= enemy.startY && enemy.hasAttacked == true){
        //         enemy.body.setVelocity(0)
        //         scene.selectionMenu.allowSelect = true
        //         scene.changeTurn()
        //         console.log('player turn is ' + scene.player_turn)
        //         console.log('character has been hurt')
        //         enemy.hasAttacked = false
        //         this.stateMachine.transition('default')
        //         // go back to default
        //     }   
        // }
        
        /*
        make enemy go up
        once enemy hits a certain height
            stop moving up
            perform the attack animation
            after the attack animation is finished
                make the enemy projectile move towards the selected character
                upon the enemy projectile colliding with the selected character
                    have the character play a hurt animation and take damage
                    if character's dies, set it to dead
                have the enemy move back down to beginning height
                when beginning height is reached
                    enter back to normal state
                    bring the turn back to the player's
        */

        if (enemy.y <= centerY) {
            console.log("enemy is at the top")
            enemy.body.setVelocityY(0)
            if (this.animation_played == false) {
                enemy.anims.play(`${enemy.name}_singleAttack`, true)
                enemy.once('animationcomplete', () => {
                    // console.log("enemy finished playing attacking animation")
                    enemy.projectile.move(scene.characters[enemy.selectedChar])
                    enemy.dmgToPlayer = enemy.attack_dmg
                    this.animation_played = true
                })
            }

            if (scene.characters[enemy.selectedChar].hurt == true) {
                console.log("returnin back")
                scene.physics.moveTo(enemy, enemy.x, enemy.startY, 50)
                this.ready = true
            }
        }
        else if (enemy.y >= enemy.startY && this.ready == true) {
            enemy.dmgToPlayer = 0
            enemy.body.setVelocityY(0)
            enemy.hasAttacked = true
            scene.changeTurn()
            console.log("enemy is entering default state from attack state")
            this.stateMachine.transition('default')
        }
    }
}

class ResetState extends State {

}

class DamagedState extends State {
    // animation play after finished character attack
    enter (scene, enemy) {
        console.log("enemy has been damaged")
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
            enemy.hurt = false
            if (enemy.health > 0){
                console.log("enemy is returning to default state from damaged state")
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