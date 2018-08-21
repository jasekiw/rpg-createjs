import {getTime} from "./utils";
import {Resources} from "./Resources";
import {Keyboard} from "./keyboard/Keyboard";
import {Keys} from "./keyboard/Keys";
import {Settings} from "./Settings";
import {CharacterSpriteSheet} from "./CharacterSpriteSheet";
import {Map} from './Map';
import {EFacing} from './EFacing';
// import {MoveAutomation} from "./MoveAutomation";
// import {ChatConsole} from "./ChatConsole";


export class Player {
    private imageShape: createjs.Shape;
    private level = 1;
    private experience = 0;
    private hp : number;
    private _alive = true;
    public get alive() { return this._alive; }
    private automationComplete = true;

    // private automation;
    private time = getTime();
    private lastYawnTime = getTime();
    private yawn = false;
    private status = "idle";
    private characterSpriteSheet: CharacterSpriteSheet;



    constructor(characterSpriteSheet: CharacterSpriteSheet) {
        this.hp = this.level * 100;
        this.characterSpriteSheet = characterSpriteSheet;
        let character = new createjs.Shape();
        character.graphics.beginBitmapFill(this.characterSpriteSheet.getDefaultSprite()).drawRect(0, 0, 100, 100);
        character.x = Math.round(((window.innerWidth / 2)) - 50);
        character.y = Math.round(((window.innerHeight / 2))) - 100;
        Settings.stage.addChild(character);
        this.characterSpriteSheet.setShape(character);
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

    getAnimation() {
        return this.characterSpriteSheet;
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
            this.yawn = this.characterSpriteSheet.animateYawn();

            if (!this.yawn) {
                this.characterSpriteSheet.ResetSprite();
                this.resetYawnTimer();
            }
        }
    }


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
            const elem = document.getElementById("character");
            elem.parentNode.removeChild(elem);
        }
    }

    attack(map: Map) {
        const attackDone = !this.characterSpriteSheet.animateAttack();
        if (!attackDone) return;
        const enemy = this.getEnemy(map);
        if (enemy != null) this.attackEnemy(enemy);
    }

    // which direction is the character facing
    public getFacing(): EFacing {
        return this.characterSpriteSheet.getLastDirection();
    }

    public resetAnimation() {
        this.characterSpriteSheet.ResetSprite();
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

    attackEnemy(Monster) {
        const damage = Math.round(Math.random() * (this.level * 30));
        const blockChance = Monster.getLevel() / (this.level * 2);
        if (!((blockChance * 100) > (Math.random() * 100)))
            Monster.takeDamage(damage);
    }

    setLocationOnScreen(x, y) {
        this.imageShape.y = y;
        this.imageShape.x = x;
    }

    setLocation(map: Map, x, y) {
        map.setPlayerLocation(x, y);
    }
    moveUp(map: Map) {
        this.characterSpriteSheet.animateUp();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map), this.getLocationY(map) + this.getOffsetY(map) - .1);
        this.finishMove("moving-up");
    }
    moveDown(map: Map) {
        this.characterSpriteSheet.animateDown();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map), this.getLocationY(map) + this.getOffsetY(map) + .1);
        this.finishMove("moving-down");
    };
    moveRight(map: Map) {
        this.characterSpriteSheet.animateRight();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map) + .1, this.getLocationY(map) + this.getOffsetY(map));
        this.finishMove("moving-right");
    }
    moveLeft(map: Map) {
        this.characterSpriteSheet.animateLeft();
        map.setPlayerLocation(this.getLocationX(map) + this.getOffsetX(map) - .1, this.getLocationY(map) + this.getOffsetY(map));
        this.finishMove("moving-left");
    }

    finishMove(move: string) {
        this.resetYawnTimer();
        this.yawn = false;
        this.status = move;
    }

    getLocationX(map: Map) {
        return map.getPlayerLocationX();
    }
    getLocationY(map: Map) {
        return map.getPlayerLocationY();
    }
    getOffsetX(map: Map) {
        return map.getPlayerOffsetX();
    }
    getOffsetY(map: Map) {
        return map.getPlayerOffsetY();
    }
    resetYawnTimer() {
        this.time = getTime();
        this.lastYawnTime = this.time;
    }
}

