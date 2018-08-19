/// <reference path="../typings/index.d.ts" />
import {Settings} from "./Settings";
import Stage = createjs.Stage;
import {Map} from "./Map";
import {Player} from "./Player";
import {CharacterSpriteSheet} from "./CharacterSpriteSheet";
import {KeyboardHandler} from "./keyboard/KeyboardHandler";
import {padLeft} from "./utils";



class App {

    private loader : createjs.LoadQueue;
    private stage : Stage;
    private player : Player;

    private aKBHandler : KeyboardHandler;
    private map : Map;

    constructor() {
        this.stage = new createjs.Stage("gameCanvas");
        this.aKBHandler = new KeyboardHandler();
        Settings.stage = this.stage;
        (<HTMLCanvasElement>this.stage.canvas).width = window.innerWidth;
        (<HTMLCanvasElement>this.stage.canvas).height = window.innerHeight;
        Settings.width = (<HTMLCanvasElement>this.stage.canvas).width;
        Settings.height = (<HTMLCanvasElement>this.stage.canvas).height;

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

    init(event : Event) {
        window.addEventListener('resize', (event : Event) => {

            (<HTMLCanvasElement>this.stage.canvas).width = window.innerWidth;
            (<HTMLCanvasElement>this.stage.canvas).height = window.innerHeight;
            Settings.width = window.innerWidth;
            Settings.height = window.innerHeight;
        });
        this.map = new Map(50,50);
        var characterSpriteSheet = new CharacterSpriteSheet();
        characterSpriteSheet.loadSprites();
        this.player = new Player(this.map, characterSpriteSheet, this.aKBHandler);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", (e : Event) => this.tick(e));
    }

    tick(event : Event) {
        this.player.update();
        this.stage.update(event);
    }
}

new App();