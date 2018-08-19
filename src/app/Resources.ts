/**
 * Resources Static Class
 */
export class Resources  {
    public static imgDir = "assets/img/";
    public static grass = "assets/img/background/grass.png";
    /**
     * gets a skeleton sprite sheet by the id
     * @param {string} id the id of the current sprite sheet
     * @returns {string} the designated skeleton sprite sheet
     */
    public static getSkeleton(id) {
        return Resources.imgDir + "skeleton-sprite-sheet/skeleton_" + id + ".png"
    }
    /**
     * gets a character sprite sheet by the id
     * @param {string} id the id of the current sprite sheet
     * @returns {string} the designated character sprite sheet
     */
    public static getCharacter(id) {
        return Resources.imgDir + "character-sprite-sheet/character-spritesheet_" + id + ".gif"
    }
}
