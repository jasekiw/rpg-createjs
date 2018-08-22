
export class AutomationJob {
    private pauseMilliseconds;
    private x;
    private y;
    constructor(xParam, yParam, pauseMillisecondsParam) {
        this.pauseMilliseconds = pauseMillisecondsParam;
        this.x = xParam;
        this.y = yParam;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getPauseMilliseconds() {
        return this.pauseMilliseconds;
    }
}
