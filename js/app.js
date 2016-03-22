// environment dimension
var numRows = 7,
    numCols = 7;

// number of enemies
var numEnemies = 6;

// number of collectibles
var numColllectible = 4;
// y-coordinate for elements to appear squarely
// for each row in environment
// 0 index for row 1
// 1 index for row 2
// 2 index for row 3, and so on
var rowYCoord = [];

// vertical step
// for player
// also height of row
var step = 83;
var stepAcross = 101;

// store img link for collectibles
var collectibles = {
    "gems": {
        "sapphire": "images/gem_blue.png",
        "emerald": "images/gem_green.png",
        "garnet": "images/gem_orange.png"
    },
    "heart": "images/Heart.png",
    "star": "images/Star.png"
}

// list of gem types
var gemTypes = ["sapphire", "emerald", "garnet"];

// array of collectble
// add all collectible types to array
// from collectibles object
var collectibleTypes = [];
for (type in collectibles) {
    if (collectibles.hasOwnProperty(type)){
        collectibleTypes.push(type);
    }
}

// define first row coordinate
rowYCoord.push(-20);

// populate rowYCoord with row y-coordinates
for (var i = 1; i < numRows; i++) {
    // move up according to redefined step
    rowYCoord.push(rowYCoord[i-1] + step);
}

function randomIntGen(from, to) {
    // return random integer from [from] to [to]
    // [to] not included
    return Math.floor(Math.random() * to) + from;
}

function randomCollectible(){
    // generate random collectibleTypes array
    // @return a random Collectible type
    // such as Gem, or Heart etc.
    var index = randomIntGen(0, collectibleTypes.length);
    switch(collectibleTypes[index]) {
        case "gems":
            return new Gem();
            break;
        case "heart":
            return new Heart();
            break;
        case "star":
            return new Star();
            break;
        default:
            return new Gem();
            break;
    }
}

function generateEnemies(){
    /* @description: generate enemies */
    for (var i = 0; i < numEnemies; i++) {
        allEnemies.push(new Enemy());
    }
}

function generateCollectibles(count){
    /* @description: generate collectibles
     * @param {int} count: how many more collectible to add */
    for (var i = 0; i < count; i++) {
        allCollectibles.push(randomCollectible());
    }
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // enemy starting position
    this.x = -100;

    // randomize row to appear in
    this.random();
};

Enemy.prototype.random = function() {
    /* @description: create enemy's random attributes,
     * including row placement and speed */

    // range of row to place enemies in
    // 0-based index
    this.y = rowYCoord[randomIntGen(1, numRows - 2)];

    // assign Enemy's row number according to y-coordinate
    this.row = rowYCoord.indexOf(this.y);

    // random speed
    this.speed = randomIntGen(200,500);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // put enemy at starting position after
    // running pass the screen
    if (this.x > numCols * stepAcross) {
        this.x = -100;
        // randomize row for bug to appears in
        this.random();
    }

    // automate enemy's movement
    this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // player's lives count
    // can be refilled by picking up hearts
    this.lives = 0;

    // points
    this.points = 0;

    // player's image
    this.sprite = 'images/char-boy.png';

    // place starting position
    this.startX = Math.floor(numCols / 2) * stepAcross;
    this.startY = rowYCoord[numRows-1];

    // place player in starting position
    this.x = this.startX;
    this.y = this.startY;

    // player's row according to
    // start position
    this.update();

    // length of player's step
    this.horizontalStep = stepAcross;
    this.verticalStep = step;
};

Player.prototype.update = function() {
    // change player's row number according to y-coordinate
    this.row = rowYCoord.indexOf(this.y);
}

Player.prototype.reset = function() {
    // put player in starting position
    this.x = this.startX;
    this.y = this.startY;
};

Player.prototype.render = function() {
    // draw player on screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reachBound = function(key) {
    /* @description: check if next movement using [key]
     * will exceed environment's boundary
     * @param {string} key: key correlates to movement direction
     * @return {boolean}: return true if exceed boundary with [key] movement
     */
    // declare boundary
    /* bunch of guess work here
     * But do I need to be precise here ? */
    var upBound = -50,
    lowBound = (numRows -1 ) * step,
    leftBound = -50,
    rightBound = numRows * stepAcross;

    switch(key) {
        case "left":
            return (this.x - this.horizontalStep <= leftBound) ? true : false;
            break;
        case "right":
            return (this.x + this.horizontalStep >= rightBound) ? true : false;
            break;
        case "up":
            return (this.y - this.verticalStep <= upBound) ? true : false;
            break;
        case "down":
            return (this.y + this.verticalStep >= lowBound) ? true : false;
            break;
    }
}

Player.prototype.handleInput = function(key) {
    /* @description: move player according to key
     * as long as the player doesn't go out of bound
     * @param {string} key: keycode for user's input */
    switch (key) {
        case "left":
            if(!this.reachBound("left")) this.x -= this.horizontalStep;
            break;
        case "right":
            if(!this.reachBound("right")) this.x += this.horizontalStep;
            break;
        case "up":
            if(!this.reachBound("up")) this.y -= this.verticalStep;
            break;
        case "down":
            if(!this.reachBound("down")) this.y += this.verticalStep;
            break;
    }
};

var Collectible = function() {
    /* Class Collectible
     * @description: superclass of all collectibles */
 }

Collectible.prototype.update = function (){};

Collectible.prototype.render = function (){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Collectible.prototype.randomPos = function() {
    // ranomize gem position
    // any row except first and last
    // any col
    this.x = randomIntGen(0,numCols) * stepAcross;
    this.y = rowYCoord[randomIntGen(1,numRows - 2)];
    this.row = rowYCoord.indexOf(this.y);
}

Collectible.prototype.vanish = function() {
    /* @description: perform routines
     * when user picks up this collectible */
    var index;

    // hide this collectible
     this.x = -200;
     this.y = -200;

    // remove this collectible from
    // allCollectibles
    index = allCollectibles.indexOf(this);
    allCollectibles.splice(index,1);
}

var Gem = function(){
    /* Gem class */

    // randomly assign gem
    this.random();
    // get right image and points based on
    // randomized gem types
    this.update();
}

// inherits attributes from Collectible
Gem.prototype = Object.create(Collectible.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.random = function() {
    // call randomPos function in Collectible superclass
    this.randomPos();
    // randomize type
    this.type = gemTypes[randomIntGen(0,gemTypes.length)];
}

Gem.prototype.update = function() {
    // gem image
    this.sprite = collectibles.gems[this.type];

    // points for picking up gem
    this.points = this.gemValues[this.type];
}

Gem.prototype.gemValues = {
    "sapphire": 100,
    "emerald": 300,
    "garnet": 200
}

var Heart = function() {
    /* Heart class
     * gives player lives to sustain more hits
     * from bugs */
    this.sprite = collectibles.heart;

    // randomize heart position
    this.randomPos();
}
// Heart inhefits from Collectible interface
Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Heart;

var Star = function() {
    /* Star class
     * Give player points, and 1 life */
    this.sprite = collectibles.star;

    // star has some points
    this.points = 333;

    // randomize position
    this.randomPos();
}
// Star inhefits from Collectible interface
Star.prototype = Object.create(Collectible.prototype);
Star.prototype.constructor = Star;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
var allCollectibles = [];

// create enemies
generateEnemies();

// create collectibles
generateCollectibles(randomIntGen(1,5));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
