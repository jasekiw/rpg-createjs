import {Player} from '../characters/Player';
import {Keys} from './Keys';
import {Keyboard} from './Keyboard';
import {Map} from '../Map';

export class PlayerInput {
    constructor(private keyboard: Keyboard) {}
    public handleInput(player: Player, map: Map) {
        if (this.keyboard.isKeyDown(Keys.KEY_W))
            player.moveUp(map);
        else if (this.keyboard.isKeyDown(Keys.KEY_S))
            player.moveDown(map);
        else if (this.keyboard.isKeyDown(Keys.KEY_D))
            player.moveRight(map);
        else if (this.keyboard.isKeyDown(Keys.KEY_A))
            player.moveLeft(map);
        else if (this.keyboard.isKeyDown(Keys.KEY_J))
            player.attack(map);
        else
            player.resetAnimation();
    }
}
