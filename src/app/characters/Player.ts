import {getTime} from "../utils";
import {Settings} from "../Settings";
import {Map} from '../Map';
import {LivingEntity} from './LivingEntity';
import {SpriteSheet} from './animation/SpriteSheet';
import {EFacing} from './EFacing';

export class Player extends LivingEntity {
    private time = getTime();
    private lastYawnTime = getTime();
    private yawn = false;
    private status = "idle";

    constructor(characterSpriteSheet?: SpriteSheet) {
        super();
        this.spriteSheet = characterSpriteSheet;
    }

    public addToScreen() {
        let character = new createjs.Shape();
        character.graphics.beginBitmapFill(this.spriteSheet.getDefaultSprite()).drawRect(0, 0, 100, 100);
        character.x = Math.round(((window.innerWidth / 2)) - 50);
        character.y = Math.round(((window.innerHeight / 2))) - 100;
        Settings.stage.addChild(character);
        this.spriteSheet.setShape(character);
        this.imageShape = character;
    }

    getLevel() {
        return this.level;
    };

    giveXp(xpToAdd) {
        this.experience += xpToAdd;
        if (this.experience > (((this.level + 1) * (this.level + 1)) * 10)) {
            this.level = Math.floor(Math.sqrt(this.experience / 10));
            // ChatConsole.LogThis("congratulations, you've leveled up to " + this.level + "!");
        }
    };

    update() {
        if (!this.yawn) {
            this.time = getTime();
        }
        if ((this.time - this.lastYawnTime) > Math.round(Math.random() * 10000) + 20000) {
            this.yawn = true;
            this.resetYawnTimer();
        }
        if (this.yawn) {
            this.yawn = this.spriteSheet.animateYawn();

            if (!this.yawn) {
                this.spriteSheet.resetSprite();
                this.resetYawnTimer();
            }
        }
    }

    public resetAnimation() {
        this.spriteSheet.resetSprite();
    }

    attack(map: Map) {
        const attackDone = !this.spriteSheet.animateAttack();
        if (!attackDone) return;
        const enemy = this.getEnemy(map);
        if (enemy != null) this.giveDamage(enemy);
    }

    private getEnemy(map: Map) {
        switch(this.getFacing()) {
            case EFacing.UP:   return map.getEnemyIn(this.getLocationX(map), this.getLocationY(map) - 1);
            case EFacing.DOWN: return map.getEnemyIn(this.getLocationX(map), this.getLocationY(map) + 1);
            case EFacing.LEFT: return map.getEnemyIn(this.getLocationX(map) - 1, this.getLocationY(map));
            case EFacing.RIGHT: return map.getEnemyIn(this.getLocationX(map) + 1, this.getLocationY(map));
            default: return null;
        }
    }


    giveDamage(monster: LivingEntity) {
        const damage = Math.round(Math.random() * (this.level * 30));
        const blockChance = monster.getLevel() / (this.level * 2);
        if (!((blockChance * 100) > (Math.random() * 100)))
            monster.takeDamage(damage);
    }

    setLocation(map: Map, x, y) {
        map.setPlayerLocation(x, y);
    }

    moveUp(map: Map) {
        this.spriteSheet.animateUp();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map), this.getLocationY(map) + this.getOffsetY(map) - .1);
        this.finishMove("moving-up");
    }
    moveDown(map: Map) {
        this.spriteSheet.animateDown();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map), this.getLocationY(map) + this.getOffsetY(map) + .1);
        this.finishMove("moving-down");
    };
    moveRight(map: Map) {
        this.spriteSheet.animateRight();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map) + .1, this.getLocationY(map) + this.getOffsetY(map));
        this.finishMove("moving-right");
    }
    moveLeft(map: Map) {
        this.spriteSheet.animateLeft();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map) - .1, this.getLocationY(map) + this.getOffsetY(map));
        this.finishMove("moving-left");
    }

    finishMove(move: string) {
        this.resetYawnTimer();
        this.yawn = false;
        this.status = move;
    }

    getLocationX(map: Map) {
        return map.getPlayerTileX();
    }
    getLocationY(map: Map) {
        return map.getPlayerTileY();
    }
    getOffsetX(map: Map) {
        return map.getPlayerTileOffsetX();
    }
    getOffsetY(map: Map) {
        return map.getPlayerTileOffsetY();
    }
    resetYawnTimer() {
        this.time = getTime();
        this.lastYawnTime = this.time;
    }
}

