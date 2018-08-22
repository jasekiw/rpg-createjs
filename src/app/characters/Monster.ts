import {MoveAutomation} from "./automation/MoveAutomation";
import {ChatConsole} from "../ChatConsole";
import {SpriteSheet} from './animation/SpriteSheet';
import {LivingEntity} from './LivingEntity';
import {Map} from '../Map';
import {Settings} from '../Settings';

export class Monster extends LivingEntity {
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
    constructor(level: number, locationX: number, locationY: number,  spriteSheet: SpriteSheet) {
        super();
        this.hp = level * 80;
        this.level = level;
        this.locationX = locationX;
        this.locationY = locationY;
        this.spriteSheet = spriteSheet;
    }

    public setMap(map: Map) {
        this.map = map;
        this.offsetX = (this.map.getTileWidth() / 2);
        this.offsetY = (this.map.getTileHeight() / 2);
    }

    public setId(id: number) {
        this.id = id;
    }

    getXRelativeToScreen() {
        const tile = this.map.getTile(this.locationX, this.locationY);
        return tile.x + this.offsetX;
    }

    getYRelativeToScreen() {
        const tile = this.map.getTile(this.locationX, this.locationY);
        return tile.y + this.offsetY;
    }

    updatePosition() {
        this.imageShape.x = (this.getXRelativeToScreen() - 50);
        this.imageShape.y = (this.getYRelativeToScreen() - 100);
    }

    public addToScreen() {
        let character = new createjs.Shape();
        character.graphics.beginBitmapFill(this.spriteSheet.getDefaultSprite(), "no-repeat", ).drawRect(0, 0, 64, 64);
        character.scaleX = 1.5625;
        character.scaleY = 1.5625;
        character.x = this.getXRelativeToScreen();
        character.y = this.getYRelativeToScreen();
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
            else
                this.attacking = false;

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
                this.giveDamage(this.map.getPlayer());
            }
            else {
                this.attacking = false;
                this.spriteSheet.resetSprite();
            }
        }
    }

    giveDamage(player: LivingEntity) {
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

    }
    moveDown() {

    }
    moveRight() {

    }
    moveLeft() {

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

