// Charlize Serrano
// Title: Inverted Paradox
// Hours: 30+ hours 

// Notes:
    // For Friday: Submit the fighting scene
    // Each character should have a fight animation + hurt animation
    // Once a character is knocked out they should be removed from game
    // when all characters die game is over
    // enemy should be able to attack one character at a time


    // For playtest: Add one summon


//'use strict'

let tileSize = 32
let config = {
    type: Phaser.AUTO,
    width: 352,
    height: 220,
    backgroundColor: '#CDC7FF',
    pixelArt: true,
    zoom: 3,
    // see: https://phaser.discourse.group/t/how-do-i-move-phaser-game-to-the-center-of-a-browser/8577/9
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH},
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
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


