import {EventEmitter} from "@angular/core";

export class KeyState {
    private _event = new EventEmitter();
    private _keyDown : boolean = false;
    constructor(private keyName : string, private keyCode : number) {}
    public get event() {
        return this._event;
    }

    public setKeyStateUp() {
        this._keyDown = false;
        this._event.emit(this._keyDown);
    }

    public setKeyStateDown() {
        this._keyDown = true;
        this._event.emit(this._keyDown);
    }
    public isKeyDown() {
        return this._keyDown;
    }
}