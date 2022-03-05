var canvas = document.getElementById('my_canvas');
var ctx = canvas.getContext('2d');
//height and width of the element
var cW = canvas.width;
var cH = canvas.height;

//Canvas for Live
var cv = document.getElementById('my_masken');
var context = cv.getContext('2d');


//Images
var images = {};
//moving background src
var bg = new Image();
bg.src = '../images/bg.png';
//static background src
var bgStatic = new Image();
bgStatic.src ='../images/bgStatic.png';
//player
images.playerPic = new Image();
images.playerPic.src = '../images/charakterNew1.png';
//enemy
images.enemyPic = new Image();
images.enemyPic.src = '../images/gegner.png';
//Masks
images.masken = new Image();
images.masken.src = '../images/maske.png';

var gamePlaying = false;
var collision = false;
var gameOver = false;
var isJumping = false;


//Speed of background
var speed = 4;
// counter rander
var index=0;
//enemy speed
var playerSpeed =5;
//Score 
var score = 0; 
//life counter
var life =0;
//Gravity
var gravity= 0.5;
var jump = -13;
var base =246;
var jumpHeight;



//myPlayer
function person(w, h, x, y){
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.crash = function(other){
        var left = this.x;
        var right = this.x + this.w;
        var bottom = this.y + this.h;
    
        var otherLeft = other.x;
        var otherRight = other.x + other.w;
        var otherTop = other.y;
        
        if(otherLeft < right && otherTop < bottom  && left < otherRight ){
               collision = true;
            }
            return collision;
        };
}

function drawWithAnimation(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function draw(image, dx, dy){
    ctx.drawImage(image, dx, dy);
}

function whrite (msg,myfont, color, alignText, dx, dy){
    ctx.font = myfont;
    ctx.fillStyle = color;
    ctx.textAlign = alignText;
    ctx.fillText(msg, dx, dy);
}

function sound(src, volum) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
   //this.sound.volume = .1;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.volume = volum;
        this.sound.play();
    };
    this.playLoop = function(){
         this.sound.loop = true;
         this.sound.volume = volum;
         this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}

//Objekt sound erzeungen und abspielen
var song = new sound('../audio/Song.mp3', 0.02);
var player = new person(71.6,105, 70, NaN);
var enemy = new person(67, 92, cW+5,263);

function render() {
    index++;
    //static background draw
    draw(bgStatic, 0, 0);
    //When game start
    if (gamePlaying) {
        if (!gameOver) {
            song.playLoop();
            //moving background draw
            drawWithAnimation(bg, 0, 0, cW, cH, -(index * (speed / 2) % cW) + cW, 0, cW, cH);
            drawWithAnimation(bg, 0, 0, cW, cH, -(index * (speed / 2) % cW), 0, cW, cH);

            //draw player jump or run movie
            if (isJumping) {
                images.playerPic.src = '../images/charakterSprung.png';
                draw(images.playerPic, player.x, player.y, player.w, player.h);
            } else {
                drawWithAnimation(images.playerPic, Math.floor((index % 16) / 4) * player.w, player.h * 0, player.w, player.h, player.x, player.y, player.w, player.h);
            }

            //gravity
            jumpHeight += gravity;
            player.y = Math.min(player.y + jumpHeight, base);

            // run movie replace
            if (player.y >= 235) {
                images.playerPic.src = '../images/charakterNew1.png';
                isJumping = false;
            }

            //Check the collision
            player.crash(enemy);

            //draw enemy
            if (collision === false) {
                drawWithAnimation(images.enemyPic, Math.floor((index % 9) / 3) * enemy.w, enemy.h * 0, enemy.w, enemy.h, enemy.x, enemy.y, enemy.w, enemy.h);
            }

            //enemy run 
            //Level
            if (enemy.x < cW + enemy.w) {
              if (index == 1500) { playerSpeed += 1; speed += 1; }
              if (index == 2500) { playerSpeed += 2; speed += 2; }
              if (index == 3500) { playerSpeed += 2; speed += 2; }
              if (index == 4500) { playerSpeed += 2; speed += 3; }
              if (index == 5500) { playerSpeed += 2; speed += 3; }
              if (index == 6500) { playerSpeed += 2; speed += 3; }

                enemy.x -= playerSpeed;
            }

            //When crash
            if (collision === true) {
                life++;
                enemy.x = cW - enemy.w;
                collision = false;
                if (life < 4) {
                    new sound('../audio/crashSound.mp3', 0.3).play();
                } else {
                    new sound('../audio/playertot.mp3', 0.3).play();
                }
            } else {
                if (enemy.x < -100) {
                    enemy.x = cW - enemy.w;
                    // SCORE +2 Points
                    score++;
                }
            }
        } else {
            whrite('GAME OVER', 'bold 50px courier', 'red', 'center', cW / 2, cH / 2);
            whrite('Best score '+score , 'yellow', 'center', cW / 2, 50);

            draw(bg, 0, 0);
            whrite('Neustarten F5', 'bold 40px courier', 'yellow', 'center', cW / 2, 400);
        }


    } else {
        player.y = base;
        draw(bg, 0, 0);
        whrite("Klicken Sie die Leertaste,", 'bold 40px courier', 'orange', 'center', cW / 2, cH / 3);
        whrite("um zu starten!!", 'bold 50px courier', 'orange', 'center', cW / 2, cH / 2);
    }
    context.clearRect(0, 0, cv.width, cv.height);

    switch (life) {
        case 0:
            context.drawImage(images.masken, 0, 0);
            context.drawImage(images.masken, 72, 0);
            context.drawImage(images.masken, 144, 0);
            context.drawImage(images.masken, 216, 0);
            break;
        case 1:
            context.drawImage(images.masken, 0, 0);
            context.drawImage(images.masken, 72, 0);
            context.drawImage(images.masken, 144, 0);
            break;
        case 2:
            context.drawImage(images.masken, 0, 0);
            context.drawImage(images.masken, 72, 0);
            break;
        case 3:
            context.drawImage(images.masken, 0, 0);
            break;
        case 4:
            gameOver = true;
            song.stop();
    }

    var el = document.getElementById('my_score');
    el.textContent = score;

    window.requestAnimationFrame(render);
}
//Background laden
bg.onload = render;


//EventListener
document.addEventListener('keydown', function(event){
    var key_press = String.fromCharCode(event.keyCode);
   
    if ((key_press == '&' || key_press == 'W' || event.keyCode == 32)&& player.y == base) {
        isJumping = true;
        gamePlaying =true;
        jumpHeight = jump;
    }
   
});

