/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    // create elements to display scores
    var scoreBoard,
        scoreSpan;
    scoreBoard = doc.createElement('p');
    scoreSpan = doc.createElement('span');
    scoreSpan.setAttribute('id', 'scoreBoard');
    scoreBoard.appendChild(doc.createTextNode("Score: "));
    scoreBoard.appendChild(scoreSpan);

    // create elements to display hearts count
    var heartBoard,
        heartImg,
        heartCount;
    heartBoard = doc.createElement('div');
    heartImg = doc.createElement('img');
    heartImg.setAttribute('src', 'images/Heart.png');
    heartSpan = doc.createElement('span');
    heartSpan.setAttribute('id', 'heart-count');
    heartBoard.appendChild(heartImg);
    heartBoard.appendChild(heartSpan);
    heartBoard.setAttribute('id', 'heartBoard');

    // div to place player's stats
    var statDiv = doc.createElement('div');
    statDiv.setAttribute('id', "stat");

    // add elements to page's body
    statDiv.appendChild(heartBoard);
    statDiv.appendChild(scoreBoard);
    doc.body.appendChild(statDiv);
    doc.body.appendChild(canvas);

    canvas.width = 707;
    canvas.height = 700;

    /* create new game and start */
    var game = new Game();
    game.init();
    // allowing methods here to see game's namespace
    var allEnemies = game.allEnemies,
        player = game.player,
        allCollectibles = game.allCollectibles,
        allEnemies = game.allEnemies,
        randomIntGen = game.randomIntGen,
        numRows = game.NUM_ROWS,
        numCols = game.NUM_COLS,
        stepAcross = game.stepAcross,
        generateCollectibles = game.generateCollectibles,
        step = game.step;

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        game.player.handleInput(allowedKeys[e.keyCode]);
    });

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        reachRiver();
        // update player's score
        doc.getElementById('scoreBoard').innerHTML = player.points;
        // update player's heart count
        doc.getElementById('heart-count').innerHTML = player.lives;
    }

    /* Loop through all enemies
     * Check if their coordinates approaches player coordinates
     * close enough to resemble collision
     * call reset if collision detected
     * First, check if enemy are in the same row with Player
     * if that's the case, check if enemy is close enough to player
     * Loop through all gems, see if player picks up the gem,
     * add points to player */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            // check if in the same row
            // and enemy hits player
            if (enemy.row == player.row && collide(enemy)) {
                // if no more lives count
                if (player.lives === 0) {
                    reset();
                }
                // if lives count not 0
                else player.lives--;
            }
        });
        allCollectibles.forEach(function(item) {
            // see if itemthe same row
            // and if close enough to player
            if (item.row == player.row && collide(item)) {
                // add points or lives count
                // according to item's type
                if (item instanceof Star){
                    player.lives ++;
                    player.points += item.points;
                }
                if (item instanceof Heart){
                    player.lives += 1;
                }
                if (item instanceof Gem){
                    player.points += item.points;
                }
                // make item disappear
                item.vanish();
            }
        });
    }

    /* Check if player is close enough to enemy
     * to be determined as hit by enemy, or close enough to item
     * for player to pick up */
    function collide(entity) {
        /* @return true: if player touches bug */
        if (Math.abs(player.x - entity.x) <= 50) return true;
        else return false;
    }

    function reachRiver() {
        /* @description: if player reaches river
         * reset game */
        if(player.row == 0) reset();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allCollectibles.forEach(function(item) {
            item.update();
        });
        player.update();

        // refill collectible
        if (allCollectibles.length == randomIntGen(0,3)){
            game.generateCollectibles(randomIntGen(1,5));
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 5 of stone
                'images/stone-block.png',   // Row 2 of 5 of stone
                'images/stone-block.png',   // Row 3 of 5 of stone
                'images/stone-block.png',   // Row 4 of 5 of stone
                'images/stone-block.png',   // Row 5 of 5 of grass
                'images/grass-block.png'    // Row 1 of 1 of grass
            ],
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * stepAcross, row * step);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allCollectibles.forEach(function(item){
            item.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        // clear canvas, redraw elements
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // reset Player
        player.reset();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/gem_blue.png',
        'images/gem_green.png',
        'images/gem_orange.png',
        'images/Heart.png',
        'images/Rock.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
