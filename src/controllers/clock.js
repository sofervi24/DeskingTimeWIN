class ClockController{
    constructor({
        tick
    }){
        this.startTime = null
        this.timerId = null
        this.tick = typeof tick == 'function' ? tick : () => {}
    }

    start(){
        let my = this
        my.startTime = Date.now()
        my.timerId = setInterval( () => {
            let delta = Date.now() - my.startTime
            my.tick(Math.floor(delta/1000))
        },1000)
    }

    stop(){
        clearInterval(this.timerId)
    }
}

module.exports = {
    ClockController
}