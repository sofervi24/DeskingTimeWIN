class ActivityModel{
    constructor({second, keyboard, mouse}){
        this.second = second
        this.keyboard = keyboard
        this. mouse = mouse
    }
    toJSON(){
        return {
            second: this.second,
            keyboard: this.keyboard,
            mouse: this.mouse,
        }
    }
}

module.exports = {ActivityModel}