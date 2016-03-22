var Game = function() {
    this.NUM_ROWS = 7;    // environment dimension
    this.NUM_COLS= 7;
    this.numEnemies = 7;    // number of enemies
    this.numColllectible = 4;    // number of collectibles
    // y-coordinate for elements to appear squarely
    // for each row in environment
    // 0 index for row 1
    // 1 index for row 2
    // 2 index for row 3, and so on
    this.rowYCoord = [];

    // vertical step
    // for player
    // also height of row
    this.step = 83;
    // width of cell
    // and player's step across
    this.stepAcross = 101;

    // store img link for collectibles
    this.collectibles = {
        "gems": {
            "sapphire": "images/gem_blue.png",
            "emerald": "images/gem_green.png",
            "garnet": "images/gem_orange.png"
        },
        "heart": "images/Heart.png",
        "star": "images/Star.png"
    }

    // list of gem types
    this.gemTypes = ["sapphire", "emerald", "garnet"];

    // array of collectble
    this.collectibleTypes = [];
};

Game.prototype.init = function() {
    /* Function init
     * @description: prepare game entities */

    // add all collectible types to array
    // from collectibles object
    for (type in this.collectibles) {
        if (this.collectibles.hasOwnProperty(type)){
            this.collectibleTypes.push(type);
        }
    }

    // define first row coordinate
    this.rowYCoord.push(-20);

    // populate rowYCoord with row y-coordinates
    for (var i = 1; i < this.NUM_ROWS ; i++) {
        // move up according to redefined step
        this.rowYCoord.push(this.rowYCoord[i-1] + this.step);
    }

    this.player = new Player(this);
    this.allEnemies = [];
    this.allCollectibles = [];

    // create enemies
    this.generateEnemies();

    // create collectibles
    this.generateCollectibles(this.randomIntGen(1,5));

};
Game.prototype.randomIntGen = function(from, to) {
    // return random integer from [from] to [to]
    // [to] not included
    return Math.floor(Math.random() * to) + from;
};

Game.prototype.randomCollectible = function(){
    // generate random collectibleTypes array
    // @return a random Collectible type
    // such as Gem, or Heart etc.
    var index = this.randomIntGen(0, this.collectibleTypes.length);
    switch(this.collectibleTypes[index]) {
        case "gems":
            return new Gem(this);
            break;
        case "heart":
            return new Heart(this);
            break;
        case "star":
            return new Star(this);
            break;
        default:
            return new Gem(this);
            break;
    }
};

Game.prototype.generateEnemies = function(){
    /* @description: generate enemies,
     * append to allEnemies array */
    for (var i = 0; i < this.numEnemies; i++) {
        this.allEnemies.push(new Enemy(this));
    }
};

Game.prototype.generateCollectibles = function(count){
    /* @description: generate collectibles
     * @param {int} count: how many more collectible to add */
    for (var i = 0; i < count; i++) {
        this.allCollectibles.push(this.randomCollectible());
    }
};

var GameChar = function(game) {
    /* Interface GameChar
     * @description: implemented in Enemy and Player classes
     * @param {object} game: game that GameChar belongs to */
    this.game = game;
};

GameChar.prototype.render = function() {
     /* @description: draw game character on canvas */
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemy = function(game) {
    /* Enemy class
     * @description: Bugs that player avoid
     * @param {object} game: game that GameChar belongs to */

    // call superclass constructor
    // assign game to enemy
    GameChar.call(this,game);

    // bug's image
    this.sprite = 'images/enemy-bug.png';

    // bug's starting position
    this.x = -100;

    // randomize row to appear in
    this.random();
};

// Enemy inherits from GameChar
Enemy.prototype = Object.create(GameChar.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.random = function() {
    /* @description: create enemy's random attributes,
     * including row placement and speed */

    var rowYCoord = this.game.rowYCoord,
        randomIntGen = this.game.randomIntGen,
        numRows = this.game.NUM_ROWS;

    // range of row to place enemies in
    // 0-based index
    this.y = rowYCoord[randomIntGen(1, numRows - 2)];

    // assign Enemy's row number according to y-coordinate
    this.row = rowYCoord.indexOf(this.y);

    // random speed
    this.speed = randomIntGen(200,500);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // I don't get why multiplying by [dt] will
    // syncrhonize speed across browser

    var numCols = this.game.NUM_COLS,
        stepAcross = this.game.stepAcross; // put enemy at starting position after // running pass the screen
    if (this.x > numCols * stepAcross) {
        this.x = -100;
        // randomize row for bug to appears in
        this.random();
    }
    // automate enemy's movement
    this.x += this.speed * dt;
};

var Player = function(game) {
    /* Player class
     * inherits from GameChar
     * @descriptioon: create player */
    // call superclass constructor
    GameChar.call(this,game);

    var numCols = this.game.NUM_COLS,
        numRows = this.game.NUM_ROWS,
        rowYCoord = this.game.rowYCoord;

    // player's lives count
    // can be refilled by picking up hearts
    this.lives = 0;

    // points
    this.points = 0;

    // player's image
    this.sprite = 'images/char-boy.png';

    // place starting position
    this.startX = Math.floor(numCols / 2) * this.game.stepAcross;
    this.startY = rowYCoord[numRows - 1];

    // place player in starting position
    this.x = this.startX;
    this.y = this.startY;

    // player's row according to
    // start position
    this.update();

    // length of player's step
    this.horizontalStep = this.game.stepAcross;
    this.verticalStep = this.game.step;
};

//Player inherits from GameChar
Player.prototype = Object.create(GameChar.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    // change player's row number according to y-coordinate
    this.row = this.game.rowYCoord.indexOf(this.y);
};

Player.prototype.reset = function() {
    // put player in starting position
    this.x = this.startX;
    this.y = this.startY;
};

Player.prototype.reachBound = function(key) {
    /* @description: check if next movement using [key]
     * will exceed environment's boundary
     * @param {string} key: key correlates to movement direction
     * @return {boolean}: return true if exceed boundary with [key] movement
     */
    // declare boundary
    /* bunch of guess work
     * But do I need to be precise ? */
    var numRows = this.game.NUM_ROWS,
        step = this.game.step,
        stepAcross = this.game.stepAcross;

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
};

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

var Collectible = function(game) {
    /* Class Collectible
     * @description: superclass of all collectibles */
    this.game = game;
};

Collectible.prototype.update = function (){};

Collectible.prototype.render = function (){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Collectible.prototype.randomPos = function() {
    // ranomize gem position
    // any row except first and last
    // any col
    var numCols = this.game.NUM_COLS,
        numRows = this.game.NUM_ROWS,
        rowYCoord = this.game.rowYCoord,
        stepAcross = this.game.stepAcross,
        randomIntGen = this.game.randomIntGen;

    this.x = randomIntGen(0,numCols) * stepAcross;
    this.y = rowYCoord[randomIntGen(1,numRows - 2)];
    this.row = rowYCoord.indexOf(this.y);
};

Collectible.prototype.vanish = function() {
    /* @description: perform routines
     * when user picks up this collectible */
    var index;

    // remove this collectible from
    // allCollectibles
    index = this.game.allCollectibles.indexOf(this);
    this.game.allCollectibles.splice(index,1);
};

var Gem = function(game){
    /* Gem class
     * @game
     * @description: inherits from Collectible interface
     * construct Gem */

    // call superclass constructor
    Collectible.call(this,game);

    // randomly assign gem
    this.random();
    // get right image and points based on
    // randomized gem types
    this.update();
};

// inherits attributes from Collectible
Gem.prototype = Object.create(Collectible.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.random = function() {
    var gemTypes = this.game.gemTypes,
        randomIntGen = this.game.randomIntGen;

    // call randomPos function in Collectible superclass
    this.randomPos();
    // randomize type
    // by picking a random index in game.gemTypes array
    this.type = gemTypes[randomIntGen(0,gemTypes.length)];
};

Gem.prototype.update = function() {
    var collectibles = this.game.collectibles;
    // gem image
    this.sprite = collectibles.gems[this.type];

    // points for picking up gem
    this.points = this.gemValues[this.type];
};

Gem.prototype.gemValues = {
    "sapphire": 100,
    "emerald": 300,
    "garnet": 200
};

var Heart = function(game) {
    /* Heart class
     * inherits from Collectible interface
     * gives player lives to sustain more hits
     * from bugs */

    Collectible.call(this, game);

    // assign image
    this.sprite = this.game.collectibles.heart;

    // randomize heart position
    this.randomPos();
};
// Heart inhefits from Collectible interface
Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Heart;

var Star = function(game) {
    /* Star class
     * Give player points, and 1 life */

    // call Collectible constructor
    Collectible.call(this, game);

    // assign image
    this.sprite = this.game.collectibles.star;

    // star has some points
    this.points = 333;

    // randomize position
    this.randomPos();
};

// Star inhefits from Collectible interface
Star.prototype = Object.create(Collectible.prototype);
Star.prototype.constructor = Star;
