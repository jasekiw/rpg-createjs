import {getTime} from "./utils";
import {Resources} from "./Resources";
import {Settings} from "./Settings";
/**
 * CharacterSpriteSheet Class
 * @param element
 * @constructor
 */
export class CharacterSpriteSheet {
    private lastTime = getTime();
    private time = getTime();
    private frame = 131;
    private lastDirection = "down";
    private speed = 100;
    private element: createjs.Shape;
    private sprites = {};

    loadSprites() {
        let sprites = {};
        for(let i =1 ; i< 273; i++)
        {
            sprites["character_" + i] = Settings.loader.getResult("character_" + i);
        }
        this.sprites = sprites;
    }

    public getSprite(number: number) {
        return this.sprites["character_" + number];
    }
    public setShape(shape: createjs.Shape) {
        this.element = shape;
    }

    public getDefaultSprite() {
        return this.sprites["character_" + 131];
    }

    animateUp() {
        var low = 105;
        this.animateSprite(low, 8);
        this.lastDirection = "up"
    }
    animateDown() {
        var low = 131;
        this.animateSprite(low, 8);
        this.lastDirection = "down"
    }
    animateLeft() {
        var low = 118;
        this.animateSprite(low, 8);
        this.lastDirection = "left"
    }
    animateRight() {

        var low = 144;
        this.animateSprite(low, 8);
        this.lastDirection = "right"
    }
    animateYawn() {
        var response = true;
        if (this.lastDirection.indexOf("up") > -1)
            response = this.animateSprite(1, 6);
        else if (this.lastDirection.indexOf("down") > -1)
            response = this.animateSprite(27, 6);
        else if (this.lastDirection.indexOf("left") > -1)
            response = this.animateSprite(14, 6);
        else if (this.lastDirection.indexOf("right") > -1)
            response = this.animateSprite(40, 6);
        return response;
    }
    animateAttack() {
        var response = false;
        if (this.lastDirection.indexOf("up") > -1)
            response = this.animateSprite(157, 5);
        else if (this.lastDirection.indexOf("down") > -1)
            response = this.animateSprite(183, 5);
        else if (this.lastDirection.indexOf("left") > -1)
            response = this.animateSprite(170, 5);
        else if (this.lastDirection.indexOf("right") > -1)
            response = this.animateSprite(196, 5);

        return response;
    }
    animateSprite(number, length) {
        this.time = getTime();
        var low = number;
        var high = low + length;
        var base = low + 1;
        if ((this.frame < low) || (this.frame > high)) {
            this.lastTime = this.time;
            this.changeSprite(base);
        }

        if ((this.time - this.lastTime) > this.speed) {
            this.lastTime = this.time;
            this.frame++;
            this.changeSprite(this.frame);
            if (!(this.frame < high)) {
                this.changeSprite(base);
                return false;
            }
        }
        return true;
    }
    changeSprite(number) {
        this.frame = number;
        this.element.graphics.clear();
        this.element.graphics.beginBitmapFill(this.getSprite(number)).drawRect(0, 0, 100, 100);
    }
    ResetSprite() {
        if (this.lastDirection.indexOf("up") > -1)
            this.changeSprite(106);
        else if (this.lastDirection.indexOf("down") > -1)
            this.changeSprite(131);
        else if (this.lastDirection.indexOf("left") > -1)
            this.changeSprite(118);
        else if (this.lastDirection.indexOf("right") > -1)
            this.changeSprite(144);
    }
    getLastDirection() {
        return this.lastDirection;
    }

}


