import {getTime, getLeftOfElement, getTopOfElement} from "./utils";
import {SkeletonSpriteSheet} from "./SkeletonSpriteSheet";
import {Resources} from "./Resources";
import {MoveAutomation} from "./MoveAutomation";
import {ChatConsole} from "./ChatConsole";

export class Monster {
    private level : number;
    private experience : number = 0;
    private hp : number;
    private alive = true;
    private map;
    private offsetX : number;
    private offsetY : number;
    private automationComplete = true;
    private automation ;
    private time = getTime();
    private lastTime = getTime();
    private status = "idle";
    private locationX : number;
    private locationY : number;
    private id : number;
    private element : HTMLElement;
    private skeletonSpriteSheet ;
    private attacking = false;

    /**
     *
     * @param level
     * @param locationX
     * @param locationY
     * @param map
     */
    constructor(level, locationX, locationY, map) {
        this.map = map;
        this.hp = level * 80;
        this.level = level;
        this.locationX = locationX;
        this.locationY = locationY;
        this.offsetX = (this.map.getTileWidth() / 2);
        this.offsetY = (this.map.getTileHeight() / 2);
        this.automation = new MoveAutomation(this, this.map);
        this.id = this.map.addEnemy(this);
        this.element = this.addToScreen();
        this.skeletonSpriteSheet = new SkeletonSpriteSheet(this.element);
    }
    getXRelativeToScreen() {
        var realX = getLeftOfElement(document.getElementById("img" + this.locationX + ";" + this.locationY));
        realX = realX + this.offsetX;
        return realX;
    }
    getYRelativeToScreen() {
        var realY = getTopOfElement(document.getElementById("img" + this.locationX + ";" + this.locationY));
        realY += this.offsetY;
        return realY;
    }
    updatePosition() {
        this.element.style.left = (this.getXRelativeToScreen() - 50).toString() + 'px';
        this.element.style.top = (this.getYRelativeToScreen() - 100).toString() + 'px';
    }

    addToScreen() {

        var ni = document.getElementById('gameViewer');
        var newdiv = document.createElement('img');
        var divIdName = 'skeleton-' + this.id;
        newdiv.setAttribute('id', divIdName);
        newdiv.setAttribute('src', Resources.getSkeleton("01"));
        newdiv.setAttribute('width', '100px');
        newdiv.setAttribute('height', '100px');
        newdiv.style.position = 'absolute';
        newdiv.style.left = "" + this.getXRelativeToScreen().toString() + 'px';
        newdiv.style.top = "" + this.getYRelativeToScreen().toString() + 'px';
        ni.appendChild(newdiv);
        return newdiv;
    }



    getAlive() {
        return this.alive;
    }
    getId() {
        return this.id;
    }

    getAutomation() {
        return this.automation;
    }
    getAnimation() {
        return this.skeletonSpriteSheet;
    }

    update() {
        if (this.alive) {
            if ((this.map.getPlayerLocationX() - this.locationX <= 1 && this.map.getPlayerLocationX() - this.locationX >= -1) &&
                (this.map.getPlayerLocationY() - this.locationY <= 1 && this.map.getPlayerLocationY() - this.locationY >= -1)) {
                this.attacking = true;
            }
            if (this.attacking)
                this.attack();
            this.automationComplete = this.automation.automate();
        }
        else {
            var deathCompleted = !this.skeletonSpriteSheet.DeathSprite();
            if (deathCompleted) {
                this.map.removeEnemy(this.id);
                var elem = document.getElementById("skeleton-" + this.id);
                elem.parentNode.removeChild(elem);
            }
            return deathCompleted;
        }
        return false; // return true to dispose of object
    }
    getLevel() {
        return this.level;
    }

    healFull() {
        this.hp = this.level * 100;
    }

    heal(number) {
        this.hp += number;
    }
    takeDamage(number) {
        this.hp = this.hp - number < 0 ? 0 : this.hp - number;
        ChatConsole.LogThis("You hit the monster with " + number + " damage. Monster's health: " + this.hp);
        if (this.hp <= 0) {
            this.alive = false;
            ChatConsole.LogThis("You killed the monster!");
        }
    }

    attack() {
        var attackDone = !this.skeletonSpriteSheet.animateAttack();
        if (attackDone) {
            if ((this.map.getPlayerLocationX() - this.locationX <= 1 && this.map.getPlayerLocationX() - this.locationX >= -1) &&
                (this.map.getPlayerLocationY() - this.locationY <= 1 && this.map.getPlayerLocationY() - this.locationY >= -1)) {
                this.attackEnemy(this.map.getPlayer());
            }
            else {
                this.attacking = false;
                this.skeletonSpriteSheet.ResetSprite();
            }
        }
    }

    attackEnemy(Player) {
        if (Player.getAlive()) {
            var damage = Math.round(Math.random() * (this.level * 30));
            var blockChance = Player.getLevel() / (this.level * 2);
            if (!((blockChance * 100) > (Math.random() * 100)))
                Player.takeDamage(damage);
            else
                ChatConsole.LogThis("You blocked the attack!");
        }
    }

    setLocationOnScreen(x, y) {
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    }

    setLocation(x, y) {
        this.locationX = x;
        this.locationY = y;
    }
    moveUp() {
        this.skeletonSpriteSheet.animateUp();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() - .1);
        status = "moving-up";
    }
    moveDown() {
        this.skeletonSpriteSheet.animateDown();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() + .1);
        status = "moving-down";
    }
    moveRight() {
        this.skeletonSpriteSheet.animateRight();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX() + .1, this.getLocationY() + this.getOffsetY());
        status = "moving-right";
    }
    moveLeft() {

        this.skeletonSpriteSheet.animateLeft();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX() - .1, this.getLocationY() + this.getOffsetY());
        status = "moving-left";
    }

    getLocationX() {
        return this.locationX;
    }
    getLocationY() {
        return this.locationY;
    }
    getOffsetX() {
        return this.offsetX;
    }
    getOffsetY() {
        return this.offsetY;
    }
}

