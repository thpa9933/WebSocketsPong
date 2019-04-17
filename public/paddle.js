class Paddle {
    constructor(isLeft) {
        this.y = height/2;
        this.w = 20;
        this.h = 100;
        this.ychange = 0;

        this.previousSteps = 0;
        
        if (isLeft) {
            this.x = this.w;
        } else {
            this.x = width - this.w;
        }
    }
    
    update() {
        this.y += this.ychange;
        this.y = constrain(this.y, this.h/2, height-this.h/2);
    }
    
    move(currentSteps) {
        this.ychange = (currentSteps - this.previousSteps);
        this.previousSteps = currentSteps;
        console.log("ychange is: " + this.ychange);
    }

    show() {
        fill(255);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h, 8,8,8,8);
    }
}
