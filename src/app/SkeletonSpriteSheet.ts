import {getTime} from "./Util";
import {Resources} from "./Resources";
/**
 * SkeletonSpriteSheet Class
 * @param element
 * @constructor
 */
export class SkeletonSpriteSheet {
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
        var low = 37;
        this.animateSprite(low, 6);
        this.lastDirection = "up"
    }

    animateDown() {
        var low = 1;
        this.animateSprite(low, 6);
        this.lastDirection = "down"
    }

    animateLeft() {
        var low = 19;
        this.animateSprite(low, 6);
        this.lastDirection = "left"
    }
    animateRight() {
        var low = 55;
        this.animateSprite(low, 6);
        this.lastDirection = "right"
    }

    animateAttack() {
        var response = true;
        if (this.lastDirection.indexOf("up") > -1)
            response = this.animateSprite(46, 8);
        else if (this.lastDirection.indexOf("down") > -1)
            response = this.animateSprite(10, 8);
        else if (this.lastDirection.indexOf("left") > -1)
            response = this.animateSprite(28, 8);
        else if (this.lastDirection.indexOf("right") > -1)
            response = this.animateSprite(64, 8);
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
        this.element.src = Resources.getSkeleton(numerator);
    }
    ResetSprite() {
        if (this.lastDirection.indexOf("up") > -1)
            this.changeSprite(37);
        else if (this.lastDirection.indexOf("down") > -1)
            this.changeSprite(1);
        else if (this.lastDirection.indexOf("left") > -1)
            this.changeSprite(19);
        else if (this.lastDirection.indexOf("right") > -1)
            this.changeSprite(55);
    }
    /**
     *
     * @returns {boolean}
     */
    DeathSprite() {
        var response = true;
        this.speed = 300;
        if (this.lastDirection.indexOf("up") > -1)
            response = this.animateSprite(44, 1);
        else if (this.lastDirection.indexOf("down") > -1)
            response = this.animateSprite(8, 1);
        else if (this.lastDirection.indexOf("left") > -1)
            response = this.animateSprite(26, 1);
        else if (this.lastDirection.indexOf("right") > -1)
            response = this.animateSprite(62, 1);
        this.speed = 100;
        return response;
    }

    getLastDirection() {
        return this.lastDirection;
    }
}
