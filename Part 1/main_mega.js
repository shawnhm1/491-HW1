function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) { 
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    // if (index == 0) {
    //     this.reverse = true;
    // } else if (index == this.frames - 1) {
    //     this.reverse = false;
    // }
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y - this.frameHeight * scaleBy;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}


//function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
function MegaMan(game) {
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    this.jumpLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 939, 1064, 60, 60, 0.1, 7, false, true);
    this.jumpRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 939, 1153, 60, 60, 0.1, 7, false, true);
    this.walkingLeft = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 937, 1377, 60, 42, 0.1, 11, true, true);
    this.walkingRight = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 938, 1275, 60, 42, 0.1, 11, true, true);
    this.StandLeft = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 1404, 1175, 60, 42, 0.15, 6, true, true);
    this.StandRight = new Animation(ASSET_MANAGER.getAsset("./img/MegaSheetShawn.gif"), 1403, 1082, 60, 42, 0.15, 6, true, true);

    Entity.call(this, game, 0, 400);
}

MegaMan.prototype = new Entity();
MegaMan.prototype.constructor = MegaMan;

MegaMan.prototype.update = function () {
    if (this.game.space) {
        this.jumping = true;
    }

    if (this.jumping) {
        
        if (window.currentOrientation === "right") {
            if (this.jumpRightAnimation.isDone()) {
                this.jumpRightAnimation.elapsedTime = 0;
                this.jumping = false;
            }
            var jumpDistance = this.jumpRightAnimation.elapsedTime / this.jumpRightAnimation.totalTime;
            var totalHeight = 200;

            if (jumpDistance > 0.8)
                jumpDistance = 1 - jumpDistance;

            //var height = jumpDistance * 2 * totalHeight;
            var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
            this.y = this.ground - height;
        }
        else if (window.currentOrientation === "left") {
            
            if (this.jumpLeftAnimation.isDone()) {
                this.jumpLeftAnimation.elapsedTime = 0;
                this.jumping = false;
            }
            var jumpDistance = this.jumpLeftAnimation.elapsedTime / this.jumpLeftAnimation.totalTime;
            var totalHeight = 200;

            console.log(jumpDistance);
            if (jumpDistance > 0.8)
                jumpDistance = 1 - jumpDistance;

            //var height = jumpDistance * 2 * totalHeight;
            var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
            this.y = this.ground - height;
        }
    }
    

    if (this.game.right) {
        this.x += 5;
    }
    if (this.game.left) {
        this.x -= 5;
    }  
    if (this.x > 800) this.x = -100;
    if (this.x < -100) this.x = 800;
    if (this.y < -100) this.y = 800;

    Entity.prototype.update.call(this);
}

MegaMan.prototype.draw = function (ctx) {
    //draw jump 
    if (this.jumping) {
        //draw jump right
        if (window.currentOrientation === "right")
        {
            this.jumpRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
        }
        //draw jump left
        else if (window.currentOrientation === "left")
        {
            this.jumpLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
        }
    }
    //draw walk right
    else if (this.game.right){
        this.walkingRight.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2 );
    }
    //draw walk left
    else if (this.game.left) {
        this.walkingLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    }
        //Draw standing
    else
    {
        //draw right standing
        if (window.currentOrientation === "right")
        {
            this.StandRight.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
        }
         //draw left standing
        else if (window.currentOrientation === "left")
        {
            this.StandLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
        }
    }
    Entity.prototype.draw.call(this);

}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/MegaSheetShawn.gif");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    //var unicorn = new Unicorn(gameEngine);
    var megaMan = new MegaMan(gameEngine);

    gameEngine.addEntity(bg);
   //gameEngine.addEntity(unicorn);
    gameEngine.addEntity(megaMan);
 
    gameEngine.init(ctx);
    gameEngine.start();


});
