/// <reference path="../typings/index.d.ts" />
import {Settings} from "./Settings";
import Stage = createjs.Stage;
import {Map} from "./Map";
import {Player} from "./characters/Player";
import {Keyboard} from "./input/Keyboard";
import {padLeft} from "./utils";
import {PlayerInput} from './input/PlayerInput';
import {SpriteSheet} from './characters/animation/SpriteSheet';

class App {

    private loader : createjs.LoadQueue;
    private stage : Stage;
    private player : Player;
    private playerInput: PlayerInput;
    private keyboard : Keyboard;
    private map : Map;

    constructor() {
        this.stage = new createjs.Stage("gameCanvas");
        this.keyboard = new Keyboard();
        this.playerInput = new PlayerInput(this.keyboard);
        Settings.stage = this.stage;
        this.setScreenSize();
        this.loader = new createjs.LoadQueue(false);
        Settings.loader = this.loader;
        this.loader.addEventListener("complete", (e : Event) => this.init(e));
        this.loader.loadManifest(this.createManifest(), true, "./assets/");
    }

    createManifest() {
        const sprites = [];
        for(let i =1; i < 273; i++) {
            sprites.push({src: "img/character-sprite-sheet/character-spritesheet_" + padLeft(i) + ".gif", id: "character_" + i});
            if(i <= 72)
                sprites.push({src: "img/skeleton-sprite-sheet/skeleton_" + padLeft(i) + ".png", id: "skeleton_" + i});
        }
        return [
            {src: "img/background/grass.png", id: "grass"},
            ... sprites
        ];
    }

    setScreenSize() {
        (<HTMLCanvasElement>this.stage.canvas).width = window.innerWidth;
        (<HTMLCanvasElement>this.stage.canvas).height = window.innerHeight;
        Settings.width = window.innerWidth;
        Settings.height = window.innerHeight;
    }

    init(event : Event) {
        window.addEventListener('resize', () => this.setScreenSize());
        this.map = new Map(50,50);
        let characterAnimations = {
            walk:   { up: 105, down: 131, left: 118, right: 144, length: 8},
            attack: { up: 157, down: 183, left: 170, right: 196, length: 5},
            yawn:   { up: 1,   down: 27,  left: 14,  right: 40,  length: 6}
        };

        let skeletonAnimations = {
            walk:   { up: 37, down: 1, left: 19, right: 55, length: 6},
            attack: { up: 46, down: 10, left: 28, right: 64, length: 5},
            death: { up: 44, down: 8, left: 26, right: 62, length: 1},
        };
        const characterSpriteSheet = new SpriteSheet(characterAnimations, characterAnimations.walk.down, this.loadSprite("character_", 237));
        this.player = new Player(characterSpriteSheet);
        this.player.addToScreen();
        // this.automation = new MoveAutomation(this, this.map);
        this.map.setPlayerTile(0, 0);
        this.map.addPlayer(this.player);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", (e : Event) => this.tick(e));
    }

    tick(event : Event) {
        this.playerInput.handleInput(this.player,this.map);
        this.player.update();
        this.stage.update(event);
    }

    loadSprite(prefix: string = "", max = 273) {
        let sprites = {};
        for(let i =1 ; i < max; i++)
            sprites[i] = Settings.loader.getResult(prefix + i);
       return sprites;
    }
}

new App();
