// Charlize Serrano
// Title: Inverted Paradox
// Hours: Currently ~15 Hours 

// Notes for myself:
    // For Friday: Submit the fighting scene
    // Each character should have a fight animation + hurt animation
    // Once a character is knocked out they should be removed from game
    // when all characters die game is over
    // enemy should be able to attack one character at a time
    // For playtest: Add one summon

// For GRADER 3/8/2024 Submission:
    // For this current submission, I have implemented a working health bar and attack scene
    // For this attack scene, I have implemented a selection menu where the player can move up and down to change their choice
        // As of now, the player can only use the character's ability listed at the bottom of the menu (Example: 'MAGIC', 'SCIENCE', 'SUPPORT')
        // To play the character's ability the player will have to hover over the ability and press 'SPACE'
        // This current menu is only able to change characters if the player's cursor is on top of it
        // This feature may seem confusing so I will refine this mechanic later and check how much the player will understand through the playtesting
    // I am also in the middle of implementing projectiles
        // These projectiles are not properly manuevering along the x axis but for now they do teleport onto the enemy and each character has their own projectile
        // Anais's projectile (SCIENCE) is the only projectile with an animation
        // Because of my FSM machine for character and enemy I think I will need to clean up my code first in order to get the projectiles and attack timing working.
        // As of right now, when the character attacks the enemy will attack at the same time
        // As a result I have made the enemy's idle animation their attack animation as temporary because attacks aren't working properly for the enemy
    // Also, it is important to note that I have implemented randomized attacks for the enemy as well
    // In terms of visuals, I only have temporary assets
    // I hope to rework the character designs but for now I have left a vague structure of how I want the movement to be (at least for the enemy)

//'use strict'

let tileSize = 32
let config = {
    type: Phaser.AUTO,
    width: 352,
    height: 220,
    backgroundColor: '#c7caf4',
    pixelArt: true,
    zoom: 3,
    // see: https://phaser.discourse.group/t/how-do-i-move-phaser-game-to-the-center-of-a-browser/8577/9
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH},
    physics: {
        default: "arcade",
        arcade: {
            // debug: true,
            // gravity not needed
            // gravity: {
            //     x: 0,
            //     y: 0
            // }
        }
    },
    scene: [ Menu, Fighting]

}

const game = new Phaser.Game(config)
// global variables

const centerX = game.config.width / 2
const centerY = game.config.height / 2
// set the floor to be around 40%
const floorY = game.config.height / 10 * 6
const leftPos = game.config.width / 5
const rightPos = game.config.width / 5 * 4
const HP = 999
const MP = 99
const temp_timer = 400

// // initialize a boolean value to check if player has attacked 
// let player_attack = false
// // check if it is the player's turn (start off with the player going first)
// let player_turn = true
// let cursors = null


