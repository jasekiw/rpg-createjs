/// <reference path="../typings/index.d.ts" />
import {Settings} from "./Settings";
import Stage = createjs.Stage;
import {Map} from "./Map";
import {Player} from "./Player";
import {CharacterSpriteSheet} from "./CharacterSpriteSheet";
import {Keyboard} from "./keyboard/Keyboard";
import {padLeft} from "./utils";
import {PlayerInput} from './PlayerInput';

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
        for(let i =1; i < 273; i++)
            sprites.push({src: "img/character-sprite-sheet/character-spritesheet_" + padLeft(i) + ".gif", id: "character_" + i })

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
        const characterSpriteSheet = new CharacterSpriteSheet();
        characterSpriteSheet.loadSprites();
        this.player = new Player(characterSpriteSheet);
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
}

new App();
