import {getTime} from "./Util";
import {AutomationJob} from "./AutomationJob";

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
    private Player;
    private Map;
    constructor(Player, Map){
        this.Player = Player;
        this.Map = Map;
    }
    addJob(x, y, pause) {
        this.jobs.push(new AutomationJob(x, y, pause));
    }

    automate() {
        if (this.jobs.length > 0 && !this.preparingX && !this.preparingY && !this.automationOnX && !this.automationOnY) {
            if (this.jobs[0].getX() != (this.Player.getLocationX()) && this.jobs[0].getX() != -1) {
                this.destinationX = this.jobs[0].getX();
                this.preparingX = true;
                this.lastTime = getTime();
            }
            if (this.jobs[0].getY() != (this.Player.getLocationY()) && this.jobs[0].getY() != -1) {
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
        var didJob = false;
        if (this.automationOnX) {
            if ((this.destinationX + 0.5) > (this.Player.getLocationX() + this.Player.getOffsetX()))
                this.automateRight();
            else if ((this.destinationX + 0.5) < (this.Player.getLocationX() + this.Player.getOffsetX()))
                this.automateLeft();
            didJob = true;
        }
        else if (this.automationOnY) {
            if ((this.destinationY + 0.5) > (this.Player.getLocationY() + this.Player.getOffsetY()))
                this.automateDown();
            else if ((this.destinationY + 0.5) < (this.Player.getLocationY() + this.Player.getOffsetY()))
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
        if ((this.Player.getLocationX() + this.Player.getOffsetX() + .1) >= (this.destinationX + 0.5)) {
            this.Player.setLocation((this.destinationX + 0.5), this.Player.getLocationY() + this.Player.getOffsetY());
            this.automationOnX = false;
            this.Player.getAnimation().ResetSprite();
            return true;
        }
        else {
            this.Player.moveRight();
            return false;
        }
    }

    automateLeft() {
        if ((this.Player.getLocationX() + this.Player.getOffsetX() - .1) <= (this.destinationX + 0.5)) {
            this.Player.setLocation((this.destinationX + 0.5), this.Player.getLocationY() + this.Player.getOffsetY());
            this.automationOnX = false;
            this.Player.getAnimation().ResetSprite();

            return true;
        }
        else {
            this.Player.moveLeft();
            return false;
        }

    }
    automateUp() {
        if ((this.Player.getLocationY() + this.Player.getOffsetY() - .1) <= (this.destinationY + 0.5)) {
            this.Player.setLocation(this.Player.getLocationX() + this.Player.getOffsetX(), (this.destinationY + 0.5));
            this.automationOnY = false;
            this.Player.getAnimation().ResetSprite();
            return true;
        }
        else {
            this.Player.moveUp();
            return false;
        }

    }

    automateDown() {
        if ((this.Player.getLocationY() + this.Player.getOffsetY() + .1) >= (this.destinationY + 0.5)) {
            this.Player.setLocation(this.Player.getLocationX() + this.Player.getOffsetX(), (this.destinationY + 0.5));
            this.automationOnY = false;
            this.Player.getAnimation().ResetSprite();
            return true;
        }
        else {
            this.Player.moveDown();
            return false;
        }
    }
}
