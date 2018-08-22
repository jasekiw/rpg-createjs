import {MoveAutomation} from "./automation/MoveAutomation";
import {ChatConsole} from "../ChatConsole";
import {SpriteSheet} from './animation/SpriteSheet';
import {LivingEntity} from './LivingEntity';
import {Map} from '../Map';
import {Settings} from '../Settings';

export class Monster extends LivingEntity {
    private map;
    private offsetX : number;
    private offsetY : number;
    private automationComplete = true;
    private locationX : number;
    private locationY : number;
    private id : number;
    getId() { return this.id; }
    private attacking = false;

    /**
     *
     * @param level
     * @param locationX
     * @param locationY
     * @param map
     * @param spriteSheet
     */
    constructor(level: number, locationX: number, locationY: number, map, spriteSheet: SpriteSheet) {
        super();
        this.map = map;
        this.hp = level * 80;
        this.level = level;
        this.locationX = locationX;
        this.locationY = locationY;
        this.offsetX = (this.map.getTileWidth() / 2);
        this.offsetY = (this.map.getTileHeight() / 2);
        this.id = this.map.addEnemy(this);
        this.spriteSheet = spriteSheet;
    }

    getXRelativeToScreen(map: Map) {
        const tile = map.getTile(this.locationX, this.locationY);
        return tile.x + this.offsetX;
    }

    getYRelativeToScreen(map: Map) {
        const tile = map.getTile(this.locationX, this.locationY);
        return tile.y + this.offsetY;
    }

    updatePosition(map: Map) {
        this.imageShape.x = (this.getXRelativeToScreen(map) - 50);
        this.imageShape.y = (this.getYRelativeToScreen(map) - 100);
    }

    public addToScreen(map: Map) {
        let character = new createjs.Shape();
        character.graphics.beginBitmapFill(this.spriteSheet.getDefaultSprite()).drawRect(0, 0, 100, 100);
        character.x = this.getXRelativeToScreen(map);
        character.y = this.getYRelativeToScreen(map);
        Settings.stage.addChild(character);
        this.spriteSheet.setShape(character);
        this.imageShape = character;
    }



    getAnimation() {
        return this.spriteSheet;
    }

    update(automation?: MoveAutomation) {
        if (this._alive) {
            if ((this.map.getPlayerTileX() - this.locationX <= 1 && this.map.getPlayerTileX() - this.locationX >= -1) &&
                (this.map.getPlayerTileY() - this.locationY <= 1 && this.map.getPlayerTileY() - this.locationY >= -1)) {
                this.attacking = true;
            }
            if (this.attacking)
                this.attack();
            if(automation)
            this.automationComplete = automation.automate();
        }
        else {
            const deathCompleted = !this.spriteSheet.animateDeath();
            if (deathCompleted) {
                this.map.removeEnemy(this.id);
                this.removeFromMap();
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

    takeDamage(damage: number) {
        this.hp = this.hp - damage < 0 ? 0 : this.hp - damage;
        ChatConsole.LogThis("You hit the monster with " + damage + " damage. Monster's health: " + this.hp);
        if (this.hp <= 0) {
            this._alive = false;
            ChatConsole.LogThis("You killed the monster!");
        }
    }

    attack() {
        const attackDone = !this.spriteSheet.animateAttack();
        if (attackDone) {
            if ((this.map.getPlayerTileX() - this.locationX <= 1 && this.map.getPlayerTileX() - this.locationX >= -1) &&
                (this.map.getPlayerTileY() - this.locationY <= 1 && this.map.getPlayerTileY() - this.locationY >= -1)) {
                this.attackEnemy(this.map.getPlayer());
            }
            else {
                this.attacking = false;
                this.spriteSheet.resetSprite();
            }
        }
    }

    attackEnemy(player: LivingEntity) {
        if (player.getAlive()) {
            const damage = Math.round(Math.random() * (this.level * 30));
            const blockChance = player.getLevel() / (this.level * 2);
            if (!((blockChance * 100) > (Math.random() * 100)))
                player.takeDamage(damage);
            // else
            //     ChatConsole.LogThis("You blocked the attack!");
        }
    }

    setLocationOnScreen(x, y) {
        this.imageShape.x = x;
        this.imageShape.y = y;
    }

    setLocation(map: Map, x: number, y: number) {
        this.locationX = x;
        this.locationY = y;
    }

    moveUp() {
        this.spriteSheet.animateUp();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() - .1);
        status = "moving-up";
    }
    moveDown() {
        this.spriteSheet.animateDown();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() + .1);
        status = "moving-down";
    }
    moveRight() {
        this.spriteSheet.animateRight();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX() + .1, this.getLocationY() + this.getOffsetY());
        status = "moving-right";
    }
    moveLeft() {
        this.spriteSheet.animateLeft();
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

