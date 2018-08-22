
import {AutomationJob} from "./AutomationJob";
import {Map} from '../../Map';
import {getTime} from '../../utils';
import {LivingEntity} from '../LivingEntity';

export class MoveAutomation {

    private destinationX = 0;
    private destinationY = 0;
    private automationOnX = false;
    private automationOnY = false;
    private jobs = [];
    private lastTime = getTime();
    private time = getTime();
    private preparingX = false;
    private preparingY = false;
    private player: LivingEntity;
    private map;
    constructor(player: LivingEntity, map: Map){
        this.player = player;
        this.map = map;
    }
    addJob(x, y, pause) {
        this.jobs.push(new AutomationJob(x, y, pause));
    }

    automate() {
        if (this.jobs.length > 0 && !this.preparingX && !this.preparingY && !this.automationOnX && !this.automationOnY) {
            if (this.jobs[0].getX() != (this.player.getLocationX(this.map)) && this.jobs[0].getX() != -1) {
                this.destinationX = this.jobs[0].getX();
                this.preparingX = true;
                this.lastTime = getTime();
            }
            if (this.jobs[0].getY() != (this.player.getLocationY(this.map)) && this.jobs[0].getY() != -1) {
                this.destinationY = this.jobs[0].getY();
                this.preparingY = true;
                this.lastTime = getTime();
            }
        }

        if (this.preparingX || this.preparingY) {
            this.time = getTime();
            if ((this.time - this.lastTime) > this.jobs[0].getPauseMilliseconds()) {
                if (this.preparingX) {
                    this.preparingX = false;
                    this.automationOnX = true;
                }
                if (this.preparingY) {
                    this.preparingY = false;
                    this.automationOnY = true;
                }
            }
        }
        let didJob = false;
        if (this.automationOnX) {
            if ((this.destinationX + 0.5) > (this.player.getLocationX(this.map) + this.player.getOffsetX(this.map)))
                this.automateRight();
            else if ((this.destinationX + 0.5) < (this.player.getLocationX(this.map) + this.player.getOffsetX(this.map)))
                this.automateLeft();
            didJob = true;
        }
        else if (this.automationOnY) {
            if ((this.destinationY + 0.5) > (this.player.getLocationY(this.map) + this.player.getOffsetY(this.map)))
                this.automateDown();
            else if ((this.destinationY + 0.5) < (this.player.getLocationY(this.map) + this.player.getOffsetY(this.map)))
                this.automateUp();
            didJob = true;
        }

        if (didJob && !this.automationOnY && !this.automationOnX) {
            this.jobs.splice(0, 1);
            return true;
        }
        else
            return false;


    }


    automateRight() {
        if ((this.player.getLocationX(this.map) + this.player.getOffsetX(this.map) + .1) >= (this.destinationX + 0.5)) {
            this.player.setLocation(this.map, (this.destinationX + 0.5), this.player.getLocationY(this.map) + this.player.getOffsetY(this.map));
            this.automationOnX = false;
            this.player.getSpriteSheet().resetSprite();
            return true;
        }
        else {
            this.player.moveRight(this.map);
            return false;
        }
    }

    automateLeft() {
        if ((this.player.getLocationX(this.map) + this.player.getOffsetX(this.map) - .1) <= (this.destinationX + 0.5)) {
            this.player.setLocation(this.map, (this.destinationX + 0.5), this.player.getLocationY(this.map) + this.player.getOffsetY(this.map));
            this.automationOnX = false;
            this.player.getSpriteSheet().resetSprite();

            return true;
        }
        else {
            this.player.moveLeft(this.map);
            return false;
        }

    }
    automateUp() {
        if ((this.player.getLocationY(this.map) + this.player.getOffsetY(this.map) - .1) <= (this.destinationY + 0.5)) {
            this.player.setLocation(this.map, this.player.getLocationX(this.map) + this.player.getOffsetX(this.map), (this.destinationY + 0.5));
            this.automationOnY = false;
            this.player.getSpriteSheet().resetSprite();
            return true;
        }
        else {
            this.player.moveUp(this.map);
            return false;
        }

    }

    automateDown() {
        if ((this.player.getLocationY(this.map) + this.player.getOffsetY(this.map) + .1) >= (this.destinationY + 0.5)) {
            this.player.setLocation(this.map, this.player.getLocationX(this.map) + this.player.getOffsetX(this.map), (this.destinationY + 0.5));
            this.automationOnY = false;
            this.player.getSpriteSheet().resetSprite();
            return true;
        }
        else {
            this.player.moveDown(this.map);
            return false;
        }
    }
}
