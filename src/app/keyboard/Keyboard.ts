
import {KeyState} from "./KeyState";
import {Keys} from "./Keys";
/**
 *
 */
export class Keyboard {

    private keyMap : KeyState[] = [];
    private inputEnabled : boolean = true;
    constructor() {
        document.addEventListener('keydown', (event) => this.keyDownListener(event.keyCode));
        document.addEventListener('keyup', (event) => this.keyUpListener(event.keyCode));
        Object.keys(Keys).forEach( (key) => this.keyMap[Keys[key]] = new KeyState(key, Keys[key]));
    }

    /**
     * The listener that gets called when a key is down
     * @param key
     */
    protected keyDownListener(key : number) {
        if(this.inputEnabled && this.keyMap[key])
            this.keyMap[key].setKeyStateDown();
    }
    /**
     * The listener that gets called when a key is up
     * @param key
     */
    protected keyUpListener(key : number) {
        if(this.inputEnabled && this.keyMap[key])
            this.keyMap[key].setKeyStateUp();
    }

    /**
     * Binds a listener to key
     * @param key
     * @returns {EventEmitter}
     */
    public getEventFromKey(key : number)
    {
        return this.keyMap[key].event;
    }

    /**
     *
     * @param key The key code to check
     * @returns {boolean}
     */
    public isKeyDown(key : number)
    {
        return this.keyMap[key].isKeyDown();
    }

    /**
     * Disables input from the user
     */
    public disableInput() {
        this.inputEnabled = false;
        Object.keys(Keys).forEach( (key) => this.keyMap[Keys[key]].setKeyStateUp());

    }

    /**
     * Enabled input from the user
     */
    public enableInput() {
        this.inputEnabled = true;
    }
}
