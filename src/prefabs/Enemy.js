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
        // enemy.selectedChar = -1
        console.log("ENEMY ENTERING DEFAULT")
        enemy.damaged = false
        // ensure enemy is not attacking in this scene
        // enemy.hasAttacked = false
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
        if (enemy.y < enemy.startY){
            enemy.body.setVelocityY(10)
        }
        else if (enemy.y >= enemy.startY){
            enemy.body.setVelocityY(0)
        }
        
        // if it is not the player's turn and there exists no currently attacking player
        if(scene.player_turn == false && enemy.hasAttacked == false && !scene.selectionMenu.attackingPlayer){
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
    }
}

class SingleAttackState extends State {
    // enemy will randomize their attack on a character
    enter (scene, enemy) {
        // turn off player selection
        scene.selectionMenu.allowSelect = false
        enemy.anims.play(`${enemy.name}_singleAttack`, true)
        // select a character
        enemy.selectedChar = enemy.charAttacking(scene.checkLiving())
        
        console.log('character x is ' + scene.characters[enemy.selectedChar].x + 'enemy X' + enemy.x)
    }
    execute(scene, enemy) {
        // move enemy to the top
        if (enemy.y > centerY){
            enemy.body.setVelocityY(-50)
        }
        // once we have reached the top 
        if (enemy.y <= centerY){
            // set the position
            enemy.body.setVelocityY(0)
            // move a projectile
            enemy.projectile.move(scene.characters[enemy.selectedChar].x, scene.characters[enemy.selectedChar].y + scene.characters[enemy.selectedChar].height)
            enemy.hasAttacked = true
            enemy.dmgToPlayer = enemy.attack_dmg
            // console.log('projectile is moving towards ' + scene.characters[enemy.selectedChar].name + 'at the y coordinate ' + scene.characters[enemy.selectedChar].y)
        }

        // if the character has been hit
        if (scene.characters[enemy.selectedChar].hurt == true) {
            //selection menu 
            scene.selectionMenu.allowSelect = true
            // scene.changeTurn()
            console.log(scene.player_turn)
            console.log('character has been hurt')
            // enemy.hasAttacked = false
            this.stateMachine.transition('default')
            // go back to default
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
        enemy.health -= scene.dmgToEnemy
        enemy.setTint(0xFF0000)    
        enemy.anims.play(`${enemy.name}_damaged`, true)
        scene.enemy_hp.match(enemy.health)
        let damage = scene.add.bitmapText(enemy.x, enemy.x + tileSize*1.5, 'font', -scene.dmgToEnemy, 8).setOrigin(0, 0).setTint(0xFF0000)

        enemy.once('animationcomplete', () => {
            damage.setVisible(false)
            scene.selectionMenu.allowSelect = true
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