
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
    textSize(56);
    text(leftscore, 80, 80);
    text(rightscore, width-80, 80);

    // Display winner
    if(leftscore == 3) {
        winner = "Player 1 Won!";
        puck.endGame();
    } else if(rightscore == 3) {
        winner = "Player 2 Won!"
        puck.endGame();
    }
    fill(255);
    textSize(80);
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