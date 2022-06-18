class ScreenshotController{
    constructor(){
        this.progressbar = document.querySelector("#progress-bar")
        this.ttl = 10000
        this.percentage = 100
        this.currentTime = 0
        this.intervalId = null
    }
    start(){
        console.log('start')
        let my = this
        my.progress()
        window.api.listen('data',(data) => {
            console.log('id',data.id)
            console.log('ttl',data.ttl)
            console.log('data',data.image.length)
            let container = document.querySelector("#screenshot-image")
            if(container){
                container.setAttribute('src',data.image)
            }
        })
    }

    progress(){
        let my = this;
        my.startTime = Date.now()
        my.intervalId = setInterval( function(){
            let delta = Date.now() - my.startTime
            let percentage = (1 - (delta / my.ttl)) * 100
            if(my.percentage < 0 ) {
                clearInterval(my.intervalId)
                return
            }
            my.progressbar.style.width = `${percentage}%`
        },100)
    }
}
const controller = new ScreenshotController()
controller.start()
    