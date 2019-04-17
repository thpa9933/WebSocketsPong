class Puck {
    constructor() {
        this.x = width/2;
        this.y = height/2;
        this.xspeed = 0;
        this.yspeed = 0;
        this.r = 10;
        this.speed = 5;
        
        this.reset();
    }
    
    checkPaddleLeft(p) {
        
        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x - this.r < p.x + p.w/2) {
                
            if (this.x > p.x) {
                let diff = this.y - (p.y - p.h/2);
                let rad = radians(45);
                let angle = map(diff, 0, p.h, -rad, rad);
                this.speed++;
                this.xspeed = this.speed * cos(angle);
                this.yspeed = this.speed * sin(angle);
                this.x = p.x + p.w/2 + this.r;
            }
            
        }
    }
    checkPaddleRight(p) {
        
        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x + this.r > p.x - p.w/2) {
                
            if (this.x < p.x) {
                let diff = this.y - (p.y - p.h/2);
                let angle = map(diff, 0, p.h, radians(225), radians(135));
                this.speed++;
                this.xspeed = this.speed * cos(angle);
                this.yspeed = this.speed * sin(angle);
                this.x = p.x - p.w/2 - this.r;
            }
        }
    }
    
    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }
    
    reset() {
        this.x = width/2;
        this.y = height/2;
        let angle = random(-PI/4, PI/4);
        this.speed = 5;
        this.xspeed = this.speed * Math.cos(angle);
        this.yspeed = this.speed * Math.sin(angle);
        
        if (random(1) < 0.5) {
            this.xspeed *= -1;
        }
    }
    
    edges() {
        if (this.y < 0 || this.y > height) {
            this.yspeed *= -1;
        }
        
        if (this.x - this.r > width) {
            ding.play();
            leftscore++;
            this.reset();
        }
        
        if (this.x + this.r < 0) {
            ding.play();
            rightscore++;
            this.reset();
        }
    }
    
    show() {
        fill(255);
        ellipse(this.x, this.y, this.r*2);
    }
}
