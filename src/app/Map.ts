import {Settings} from "./Settings";
import {Player} from './characters/Player';
import {LivingEntity} from './characters/LivingEntity';
import {Monster} from './characters/Monster';
/**
 * The Map Class
 * @param width
 * @param height
 * @constructor
 */
export class Map {
    private tileWidth = 100;
    private tileHeight = 100;
    // the middle of the screen x
    private readonly middleScreenX : number;
    // the middle of the screen y
    private readonly middleScreenY : number;
    private enemies: Monster[] = [];
    private player;
    public readonly width: number;
    public readonly height: number;
    private backgroundArr : createjs.Shape[][] = [];
    private groundImg : HTMLImageElement;

    constructor(width, height) {
        this.middleScreenX = Math.round(((window.innerWidth / 2)));
        this.middleScreenY = Math.round(((window.innerHeight / 2)));
        this.width = width;
        this.height = height;
        this.groundImg = <HTMLImageElement>Settings.loader.getResult("grass");

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.backgroundArr[y] == null) this.backgroundArr[y] = [];
                this.backgroundArr[y][x] = this.addBackgroundElement(x, y);
            }
        }
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

    getPlayer(): Player {
        return this.player
    }

    addEnemy(enemy: Monster) {
        this.enemies.push(enemy);
        enemy.setMap(this);
        enemy.addToScreen();
        enemy.setId(this.enemies.length - 1);
    }

    getEnemyIn(x, y) {
        for (let i = 0; i < this.enemies.length; i++)
            if (this.enemies[i].getLocationX() == x && this.enemies[i].getLocationY() == y)
                return this.enemies[i];
        return null;
    }
    removeEnemy(id) {
        for (let i = 0; i < this.enemies.length; i++)
            if (this.enemies[i].getId() == id)
                this.enemies.splice(i, 1);
    }

    getTileWidth() {
        return this.tileWidth;
    }

    getTile(x: number, y: number) {
        return this.backgroundArr[y][x];
    }

    getTileHeight() {
        return this.tileHeight;
    }

    setPlayerLocation(moveX, moveY) {
        const left = this.middleScreenX;
        const top = this.middleScreenY;

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let elem = this.backgroundArr[y][x];
                elem.x = (x * 100) + (moveX * -100) + left ;
                elem.y = (y * 100) + (moveY * -100) + top;
            }
        }
        for (let i = 0; i < this.enemies.length; i++)
            this.enemies[i].updatePosition();
    }
    setPlayerTile(moveX, moveY) {
        const left = this.middleScreenX;
        const top = this.middleScreenY;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let elem = this.backgroundArr[y][x];
                elem.x = (x * 100) + (moveX * -this.tileWidth) + left - (this.tileWidth / 2);
                elem.y = (y * 100) + (moveY * -this.tileHeight) + top - (this.tileHeight / 2);
            }
        }
    };

    public update() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].update()) {
                this.enemies.splice(i, 1);
            }
        }
    }

    getPlayerTileX() {
        const topLeftTile = this.backgroundArr[0][0];
        return Math.floor( (topLeftTile.x - this.middleScreenX) / -100)
    }
    getPlayerTileY() {
        const topLeftTile = this.backgroundArr[0][0];
        return Math.floor( (topLeftTile.y - this.middleScreenY) / -100)
    }
    getPlayerTileOffsetX() {
        const left = this.middleScreenX;
        const topLeftTile = this.backgroundArr[0][0];
        //
        return ( (topLeftTile.x - left) / -100) -
            Math.floor( (topLeftTile.x - left) / -100);
    }
    getPlayerTileOffsetY() {
        const top = this.middleScreenY;
        const elem = this.backgroundArr[0][0];
        return ( (elem.y - top) / -100) - Math.floor( (elem.y - top) / -100);
    }

}





