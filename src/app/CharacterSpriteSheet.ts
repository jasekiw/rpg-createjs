import {getTime} from "./GlobalFunctions";
import {Resources} from "./Resources";
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
    private element;
    constructor(element) {
        this.element = element;
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
        var numerator = number < 10 ? "0" + number.toString() : number.toString();
        this.element.src = Resources.getCharacter(numerator);
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


