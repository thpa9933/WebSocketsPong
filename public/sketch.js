
var socket;
let leftscore = 0;
let rightscore = 0;
var winner = "";
var highScore = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ding = loadSound("data/ding.mp3");
    
    puck = new Puck();
    left = new Paddle(true);
    right = new Paddle(false);

    socket = io.connect('/');

    // When you recieve data from the socket
    socket.on('mouse1', function(data){
        left.move(data.x);
    });
    socket.on('mouse2', function(data){
        right.move(-data.x);
    });

    socket.on('resetSketch', function(data) {
        console.log("sketch has been reset: " + data);
        puck.newGame();
        winner = "";
        leftscore = 0;
        rightscore = 0;
        totalHits = 0;
    });
    
    // recieve all time high score from text file
    socket.on('sendHighScore', function(data) {
        highScore = data;
    });
}

function draw() {
    background(color(125,207,182));
    textFont('Cute Font');

    puck.checkPaddleRight(right);
    puck.checkPaddleLeft(left);

    left.show();
    right.show();
    left.update();
    right.update();
    
    puck.update();
    puck.edges();
    puck.show();
    
    fill(color(49,57,60));
    textSize(76);
    text(leftscore, 80, 80);
    text(rightscore, width-80, 80);

    // Display winner
    if(leftscore == 10) {
        winner = "Player 1 Won!";
        puck.endGame();
    } else if(rightscore == 10) {
        winner = "Player 2 Won!"
        puck.endGame();
    }
    fill(255);
    textSize(124);
    textAlign(CENTER);
    text(winner, (windowWidth/2), (windowHeight/2));

    // show rally on screen
    totalHits = puck.getHits();
    fill(255);
    textSize(140);
    textAlign(CENTER);
    text(totalHits, (windowWidth/2), 100);

    // show highScore on screen
    fill(color(132,28,38));
    textSize(60);
    textAlign(CENTER);
    text("top rally: " + highScore, 180, windowHeight - 50);

    text(".socketPong.", windowWidth - 160, windowHeight - 50);

    // if new high score 
    if (totalHits > highScore) {
        // call sendHighScore() outside the loop!
        sendHighScore(totalHits);
        highScore = totalHits;
    }

    // Show scores on client screen
    data = {
        LS: leftscore,
        RS: rightscore
    };
    console.log(data);
    socket.emit('clientScore', data);
}

// send high score to server
function sendHighScore(hits) {
    socket.emit('resetHighHitScore', hits);
}
