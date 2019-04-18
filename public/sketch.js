
var socket;
let leftscore = 0;
let rightscore = 0;
var winner = "";

function setup() {
    createCanvas(windowWidth, windowHeight);
    ding = loadSound("data/ding.mp3");
    puck = new Puck();
    left = new Paddle(true);
    right = new Paddle(false);

    socket = io.connect('/');

    // When you recieve data from the socket
    socket.on('mouse', function(data) {
        console.log("Recieved mouse data from server: " + data.x + " " + data.y );
    });

    socket.on('mouse1', function(data){
        left.move(data.x);
    });
    socket.on('mouse2', function(data){
        right.move(-data.x);
    });

    socket.on('resetSketch', function(data) {
        console.log("sketch has been reset: " + data);
        leftscore = 0;
        rightscore = 0;
    });
    
}

function draw() {
    background(0);
    
    puck.checkPaddleRight(right);
    puck.checkPaddleLeft(left);

    left.show();
    right.show();
    left.update();
    right.update();
    
    puck.update();
    puck.edges();
    puck.show();
    
    fill(255);
    textSize(32);
    text(leftscore, 32, 40);
    text(rightscore, width-64, 40);

    // Display winner
    if(leftscore == 3) {
        winner = "Player 1 Won!";
        puck.endGame();
    } else if(rightscore == 3) {
        winner = "Player 2 Won!"
        puck.endGame();
    }
    fill(255);
    textSize(60);
    textAlign(CENTER);
    text(winner, (windowWidth/2), (windowHeight/2));

    // Show scores on client screen
    data = {
        LS: leftscore,
        RS: rightscore
    };
    console.log(data);
    socket.emit('clientScore', data);
}

function keyReleased() {
    left.move(0);
    right.move(0);
}

function keyPressed() {
    if (key == 'A') {
        left.move(-10);
    } else if (key == 'Z') {
        left.move(10);
    }

    if (key == 'J') {
        right.move(-10);
    } else if (key == 'M') {
        right.move(10);
    }
    socket.emit('keyData',key);
}
