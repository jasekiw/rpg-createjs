import {EFacing} from './EFacing';
import {Map} from '../Map';
import {SpriteSheet} from './animation/SpriteSheet';
import {Settings} from '../Settings';

export abstract class LivingEntity {
    protected imageShape: createjs.Shape;
    protected level = 1;
    getLevel() { return this.level; }
    protected experience = 0;
    protected hp : number = 100;
    protected _alive = true;
    public get alive() { return this._alive; }
    protected spriteSheet: SpriteSheet;


    giveXp(xpToAdd) {
        this.experience += xpToAdd;
        if (this.experience > (((this.level + 1) * (this.level + 1)) * 10)) {
            this.level = Math.floor(Math.sqrt(this.experience / 10));
            // @todo ChatConsole.LogThis("congratulations, you've leveled up to " + this.level + "!");
        }
    };

    getSpriteSheet() {
        return this.spriteSheet;
    };

    abstract update();


    healFull() {
        this.hp = this.level * 100;
    }

    heal(number) {
        this.hp += number;
    }
    getAlive() {
        return this._alive;
    }
    takeDamage(number) {
        this.hp -= number;
        // ChatConsole.LogThis("You took " + number + " damage. Your hp is: " + this.hp);
        if (this.hp <= 0) {
            // ChatConsole.LogThis("Oh Dear, You are dead!");
            this._alive = false;
            this.removeFromMap();
        }
    }
    abstract setLocation(map: Map, x: number, y: number);

    attack(map: Map) {
        const attackDone = !this.spriteSheet.animateAttack();
        if (!attackDone) return;
        const enemy = this.getEnemy(map);
        if (enemy != null) this.attackEnemy(enemy);
    }

    // which direction is the character facing
    public getFacing(): EFacing {
        return this.spriteSheet.getLastDirection();
    }

    public resetAnimation() {
        this.spriteSheet.resetSprite();
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

    attackEnemy(enemy: LivingEntity) {
        const damage = Math.round(Math.random() * (this.level * 30));
        const blockChance = enemy.getLevel() / (this.level * 2);
        if (!((blockChance * 100) > (Math.random() * 100)))
            enemy.takeDamage(damage);
    }

    setLocationOnScreen(x, y) {
        this.imageShape.y = y;
        this.imageShape.x = x;
    }

    abstract getLocationX(map: Map);
    abstract getLocationY(map: Map);
    abstract getOffsetX(map: Map);
    abstract getOffsetY(map: Map);

    protected removeFromMap() {
        this.imageShape.graphics.clear();
        Settings.stage.removeChild(this.imageShape);
    }

    abstract moveUp(map: Map);
    abstract moveDown(map: Map);
    abstract moveRight(map: Map);
    abstract moveLeft(map: Map);


}
