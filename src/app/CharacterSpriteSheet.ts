import {getTime} from "./utils";
import {Settings} from "./Settings";
import {EFacing} from './EFacing';
/**
 * CharacterSpriteSheet Class
 * @param element
 * @constructor
 */
export class CharacterSpriteSheet {
    private lastTime = getTime();
    private time = getTime();
    private frame = 131;
    private lastDirection = EFacing.DOWN;
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
        this.animateDirection(105, EFacing.UP);
    }
    animateDown() {
        this.animateDirection(131, EFacing.DOWN);
    }
    animateLeft() {
        this.animateDirection(118, EFacing.LEFT);
    }
    animateRight() {
        this.animateDirection(144, EFacing.RIGHT);
    }

    animateDirection(base: number, direction: EFacing) {
        this.animateSprite(base, 8);
        this.lastDirection = direction
    }
    animateYawn() {
        return this.animate4Directions(1, 27, 14, 40, 6, true);
    }
    animateAttack() {
        return this.animate4Directions(157, 183, 170, 196, 5, false);
    }

    animate4Directions(upBase, DownBase, leftBase, rightBase, length, defaultReturn) {
        switch(this.lastDirection) {
            case EFacing.UP: return this.animateSprite(upBase, length);
            case EFacing.DOWN: return this.animateSprite(DownBase, 5);
            case EFacing.LEFT: return this.animateSprite(leftBase, 5);
            case EFacing.RIGHT: return this.animateSprite(rightBase, length);
            default: return defaultReturn;
        }
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
        switch(this.lastDirection) {
            case EFacing.UP:  this.changeSprite(106); break;
            case EFacing.DOWN: this.changeSprite(131); break;
            case EFacing.LEFT: this.changeSprite(118); break;
            case EFacing.RIGHT: this.changeSprite(144); break;
            default: this.changeSprite(131); break;
        }
    }

    getLastDirection(): EFacing {
        return this.lastDirection;
    }

}


