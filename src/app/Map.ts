import {Settings} from "./Settings";
/**
 * The Map Class
 * @param width
 * @param height
 * @constructor
 */
export class Map {
    private tileWidth = 100;
    private tileHeight = 100;
    private screenMiddleXPx : number;
    private screenMiddleYPx : number;
    private enemies = [];
    private player;
    private width: number;
    private height: number;
    private backgroundArr : createjs.Shape[][] = [];
    private groundImg : HTMLImageElement;
    constructor(width, height) {
        this.groundImg = <HTMLImageElement>Settings.loader.getResult("grass");
        this.screenMiddleXPx = Math.round(((window.innerWidth / 2)));
        this.screenMiddleYPx = Math.round(((window.innerHeight / 2)));
        this.width = width;
        this.height = height;
        for (var x = 0; x < width; x++)
            for (var y = 0; y < height; y++)
            {
                let elem = this.addBackgroundElement(x, y);
                if(this.backgroundArr[y] == null)
                    this.backgroundArr[y] = [];
                this.backgroundArr[y][x] = elem;
            }


    }
    public getWidth() {
        return this.width;
    }
    public getHeight() {
        return this.height;
    }
    addPlayer(player) {
        this.player = player;
    }

    protected addBackgroundElement(x, y) {
        let background = new createjs.Shape();
        background.graphics.beginBitmapFill(this.groundImg).drawRect(0, 0, this.tileWidth, this.tileHeight);
        background.x = (x * this.tileWidth);
        background.y = (y * this.tileHeight);
        Settings.stage.addChild(background);
        return background;
    }

    getPlayer() {
        return this.player
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
        return this.enemies.length - 1;
    }

    getEnemyIn(x, y) {
        for (var i = 0; i < this.enemies.length; i++)
            if (this.enemies[i].getLocationX() == x && this.enemies[i].getLocationY() == y)
                return this.enemies[i];
        return null;
    }
    removeEnemy(id) {
        for (var i = 0; i < this.enemies.length; i++)
            if (this.enemies[i].getId() == id)
                this.enemies.splice(i, 1);
    }

    getTileWidth() {
        return this.tileWidth;
    }

    getTileHeight() {
        return this.tileHeight;
    }

    setPlayerLocation(moveX, moveY) {
        var left = this.screenMiddleXPx;
        var top = this.screenMiddleYPx;

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var elem = this.backgroundArr[y][x];
                elem.x = (x * 100) + (moveX * -100) + left ;
                elem.y = (y * 100) + (moveY * -100) + top;
            }
        }
        for (var i = 0; i < this.enemies.length; i++)
            this.enemies[i].updatePosition();
    }
    setPlayerTile(moveX, moveY) {
        var left = this.screenMiddleXPx;
        var top = this.screenMiddleYPx;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var elem = this.backgroundArr[y][x];
                elem.x = (x * 100) + (moveX * -this.tileWidth) + left - (this.tileWidth / 2);
                elem.y = (y * 100) + (moveY * -this.tileHeight) + top - (this.tileHeight / 2);
            }
        }
    };

    getPlayerLocationX() {
        var left = this.screenMiddleXPx;
        var elem = this.backgroundArr[0][0];
        console.log("returnX", Math.floor( (elem.x - left) / -100));
        return Math.floor( (elem.x - left) / -100)
    }
    getPlayerOffsetX() {
        var left = this.screenMiddleXPx;
        var top = this.screenMiddleYPx;
        var elem = this.backgroundArr[0][0];
        return ( (elem.x - left) / -100) - Math.floor( (elem.x - left) / -100);
    }
    getPlayerLocationY() {
        var left = this.screenMiddleXPx;
        var top = this.screenMiddleYPx;
        var elem = this.backgroundArr[0][0];
        console.log("returnY", Math.floor( (elem.y - top) / -100));
        return Math.floor( (elem.y - top) / -100)
    };
    getPlayerOffsetY() {
        var left = this.screenMiddleXPx;
        var top = this.screenMiddleYPx;
        var elem = this.backgroundArr[0][0];
        return ( (elem.y - top) / -100) - Math.floor( (elem.y - top) / -100);
    }

}





