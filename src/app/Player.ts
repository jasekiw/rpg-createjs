import {getTime} from "./utils";
import {Resources} from "./Resources";
import {KeyboardHandler} from "./keyboard/KeyboardHandler";
import {Keys} from "./keyboard/Keys";
import {Settings} from "./Settings";
import {CharacterSpriteSheet} from "./CharacterSpriteSheet";
// import {MoveAutomation} from "./MoveAutomation";
// import {ChatConsole} from "./ChatConsole";


export class Player {
    private imgId = "character_131";
    private element: createjs.Shape;
    private level = 1;
    private experience = 0;
    private hp : number;
    private alive = true;
    private map;
    private automationComplete = true;

    // private automation;
    private time = getTime();
    private lastTime = getTime();
    private yawn = false;
    private status = "idle";
    private characterSpriteSheet: CharacterSpriteSheet;
    private kbHandler : KeyboardHandler;



    constructor(mapParam, characterSpriteSheet: CharacterSpriteSheet, keyboardHander : KeyboardHandler) {
        this.map = mapParam;

        this.hp = this.level * 100;
        this.characterSpriteSheet = characterSpriteSheet;
        this.kbHandler = keyboardHander;
        // this.automation = new MoveAutomation(this, this.map);
        this.map.setPlayerTile(0, 0);
        this.map.addPlayer(this);
        // this.element.style.left = Math.round(((window.innerWidth / 2)) - 50) + 'px';
        // this.element.style.top = Math.round(((window.innerHeight / 2))) - 100 + 'px';
        // this.element.setAttribute('src', this.imgId);


        let character = new createjs.Shape();
        character.graphics.beginBitmapFill(this.characterSpriteSheet.getDefaultSprite()).drawRect(0, 0, 100, 100);
        character.x = Math.round(((window.innerWidth / 2)) - 50);
        character.y = Math.round(((window.innerHeight / 2))) - 100;
        Settings.stage.addChild(character);
        this.characterSpriteSheet.setShape(character);
        this.element = character;
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
        this.handleInput();
        if (!this.yawn) {
            this.time = getTime();
        }
        if ((this.time - this.lastTime) > Math.round(Math.random() * 10000) + 20000) {
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


    handleInput() {
        if (this.kbHandler.isKeyDown(Keys.KEY_W))
            this.moveUp();
        else if (this.kbHandler.isKeyDown(Keys.KEY_S))
            this.moveDown();
        else if (this.kbHandler.isKeyDown(Keys.KEY_D))
            this.moveRight();
        else if (this.kbHandler.isKeyDown(Keys.KEY_A))
            this.moveLeft();
        else if (this.kbHandler.isKeyDown(Keys.KEY_J))
            this.attack();
        else
            this.characterSpriteSheet.ResetSprite();
    }

    healFull() {
        this.hp = this.level * 100;
    }

    heal(number) {
        this.hp += number;
    }
    getAlive() {
        return this.alive;
    }
    takeDamage(number) {
        this.hp -= number;
        // ChatConsole.LogThis("You took " + number + " damage. Your hp is: " + this.hp);
        if (this.hp <= 0) {
            // ChatConsole.LogThis("Oh Dear, You are dead!");
            this.alive = false;
            var elem = document.getElementById("character");
            elem.parentNode.removeChild(elem);
        }
    }

    attack() {
        var attackDone = !this.characterSpriteSheet.animateAttack();
        if (!attackDone)
            return;
        var lastDirection = this.characterSpriteSheet.getLastDirection();
        if (lastDirection.indexOf("up") > -1) {
            var enemy = this.map.getEnemyIn(this.getLocationX(), this.getLocationY() - 1);
            if (enemy != null)
                this.attackEnemy(enemy);
        }
        else if (lastDirection.indexOf("down") > -1) {
            var enemy = this.map.getEnemyIn(this.getLocationX(), this.getLocationY() + 1);
            if (enemy != null)
                this.attackEnemy(enemy);
        }
        else if (lastDirection.indexOf("left") > -1) {
            var enemy = this.map.getEnemyIn(this.getLocationX() - 1, this.getLocationY());
            if (enemy != null)
                this.attackEnemy(enemy);
        }
        else if (lastDirection.indexOf("right") > -1) {
            var enemy = this.map.getEnemyIn(this.getLocationX() + 1, this.getLocationY());
            if (enemy != null)
                this.attackEnemy(enemy);
        }
    }

    attackEnemy(Monster) {
        var damage = Math.round(Math.random() * (this.level * 30));
        var blockChance = Monster.getLevel() / (this.level * 2);
        if (!((blockChance * 100) > (Math.random() * 100)))
            Monster.takeDamage(damage);
    }

    setLocationOnScreen(x, y) {
        this.element.y = y;
        this.element.x = x;
    }
    setLocation(x, y) {
        this.map.setPlayerLocation(x, y);
    }
    moveUp() {
        this.characterSpriteSheet.animateUp();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() - .1);
        this.resetYawnTimer();
        this.yawn = false;
        status = "moving-up";
    }
    moveDown() {
        this.characterSpriteSheet.animateDown();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX(), this.getLocationY() + this.getOffsetY() + .1);
        this.resetYawnTimer();
        this.yawn = false;
        status = "moving-down";
    };
    moveRight() {
        this.characterSpriteSheet.animateRight();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX() + .1, this.getLocationY() + this.getOffsetY());
        this.resetYawnTimer();
        this.yawn = false;
        status = "moving-right";
    }
    moveLeft() {

        this.characterSpriteSheet.animateLeft();
        this.map.setPlayerLocation(this.getLocationX() + this.getOffsetX() - .1, this.getLocationY() + this.getOffsetY());
        this.resetYawnTimer();
        this.yawn = false;
        status = "moving-left";
    }

    getLocationX() {
        return this.map.getPlayerLocationX();
    }
    getLocationY() {
        return this.map.getPlayerLocationY();
    }
    getOffsetX() {
        return this.map.getPlayerOffsetX();
    }
    getOffsetY() {
        return this.map.getPlayerOffsetY();
    }
    resetYawnTimer() {
        this.time = getTime();
        this.lastTime = this.time;
    }
}

