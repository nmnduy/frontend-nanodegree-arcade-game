// environment dimension
var numRows = 7,
    numCols = 7;

// y-coordinate for elements to appear squarely
// for each row in environment
// 0 index for row 1
// 1 index for row 2
// 2 index for row 3, and so on
var rowYCoord = [];

// vertical step
// for player and height of row
var step = 83;

var collectibles = {
    "gems": {
        "sapphire": "images/Gem\ Blue.png",
        "emerald": "images/Gem\ Green.png",
        "garnet": "images/Gem\ Orange.png"
    },
    "heart": "images/Heart.png",
    "star": "images/Star.png"
}

// define first row coordinate
rowYCoord.push(-20);

for (var i = 1; i < numRows; i++) {
    // move up according to redefined step
    rowYCoord.push(rowYCoord[i-1] + step);
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
    var fromRow = 1;
    var toRow = 5;

    // random row from row 2 to 5
    index = Math.floor(Math.random() * toRow) + fromRow;
    this.y = rowYCoord[index];

    // assign Enemy's row number according to y-coordinate
    this.row = rowYCoord.indexOf(this.y);

    // random speed
    this.speed = Math.floor(Math.random() * 500) + 200;
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // put enemy at starting position after
    // running pass the screen
    if (this.x > 600) {
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
    // points
    this.points = 0;

    // player's image
    this.sprite = 'images/char-boy.png';

    // place starting position
    this.startX = 303;
    this.startY = rowYCoord[6];

    // place player in starting position
    this.x = this.startX;
    this.y = this.startY;

    // player's row according to
    // start position
    this.update();

    // length of player's step
    this.horizontalStep = 101;
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
    lowBound = 505,
    leftBound = -50,
    rightBound = 707;

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

var Gem = function(){
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
player = new Player();

allEnemies = [];

// create enemies
for (var i = 0; i < 6; i++) {
    allEnemies.push(new Enemy());
}

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
