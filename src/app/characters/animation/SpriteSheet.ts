import {EFacing} from '../EFacing';
import {getTime} from '../../utils';
import {Animation, AnimationCollection} from './AnimationCollection';

export class SpriteSheet {
    protected lastTime = getTime();
    protected time = getTime();
    protected frame: number;
    protected lastDirection = EFacing.DOWN;
    protected speed = 100;
    protected shape: createjs.Shape;
    protected sprites = {};
    protected scaleTo?: number;
    protected originalSize?: number;

    constructor(protected animations: AnimationCollection, protected defaultFrame: number, loadedSprites: Object, originalSize: number = 100, scaleTo: number = 100) {
        this.sprites = loadedSprites;
        this.frame = defaultFrame;
        this.scaleTo = scaleTo;
        this.originalSize = originalSize;
    }

    public getSprite(number: number) {
        return this.sprites[number];
    }
    public setShape(shape: createjs.Shape) {
        this.shape = shape;
    }

    public getDefaultSprite() {
        return this.sprites[this.defaultFrame];
    }

    animateUp() {
        this.animateDirection(this.animations.walk.up, EFacing.UP, this.animations.walk.length);
    }
    animateDown() {
        this.animateDirection(this.animations.walk.down, EFacing.DOWN, this.animations.walk.length);
    }
    animateLeft() {
        this.animateDirection(this.animations.walk.left, EFacing.LEFT, this.animations.walk.length);
    }
    animateRight() {
        this.animateDirection(this.animations.walk.right, EFacing.RIGHT, this.animations.walk.length);
    }

    animateDirection(base: number, direction: EFacing, animationLength = 8) {
        this.animateSprite(base, animationLength);
        this.lastDirection = direction
    }

    animateYawn() {
        if(this.animations.yawn)
            return this.animate4Directions(this.animations.yawn, true);
        return true;
    }

    animateAttack() {
        return this.animate4Directions(this.animations.attack, false);
    }

    /**
     * @returns {boolean}
     */
    animateDeath() {
        if(this.animations.death)
            return this.animate4Directions(this.animations.death, true);
        return true;
    }

    animate4Directions(animation: Animation, defaultReturn: boolean, speed = this.speed) {
        const reset = <Animation>(animation.reset || {});
        switch(this.lastDirection) {
            case EFacing.UP: return this.animateSprite(animation.up, animation.length, speed, reset.up);
            case EFacing.DOWN: return this.animateSprite(animation.down, animation.length, speed, reset.down);
            case EFacing.LEFT: return this.animateSprite(animation.left, animation.length, speed, reset.left);
            case EFacing.RIGHT: return this.animateSprite(animation.right, animation.length, speed, reset.right);
            default: return defaultReturn;
        }
    }
    animateSprite(number, length, speed = this.speed, reset = null) {
        this.time = getTime();
        const low = number;
        const high = low + length;
        const base = low + 1;
        if ((this.frame < low) || (this.frame > high)) {
            this.lastTime = this.time;
            this.changeSprite(base);
        }

        if ((this.time - this.lastTime) > speed) {
            this.lastTime = this.time;
            this.frame++;
            this.changeSprite(this.frame);
            if (!(this.frame < high)) {
                this.changeSprite(base);
                return false;
            }
        }
        if(reset) this.changeSprite(reset);
        return true;
    }

    changeSprite(number) {
        this.frame = number;
        this.shape.graphics.clear();
        this.shape.graphics.beginBitmapFill(this.getSprite(number)).drawRect(0, 0, this.originalSize, this.originalSize);
        if((this.scaleTo / this.originalSize) !== 1) {
            this.shape.scaleX = this.scaleTo / this.originalSize;
            this.shape.scaleY = this.scaleTo / this.originalSize;
        }

    }

    resetSprite() {
        const animation = this.animations.walk;
        switch(this.lastDirection) {
            case EFacing.UP:  this.changeSprite(animation.up); break;
            case EFacing.DOWN: this.changeSprite(animation.down); break;
            case EFacing.LEFT: this.changeSprite(animation.left); break;
            case EFacing.RIGHT: this.changeSprite(animation.right); break;
            default: this.changeSprite(131); break;
        }
    }

    getLastDirection(): EFacing {
        return this.lastDirection;
    }
}
