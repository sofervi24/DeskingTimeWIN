import {DomController} from './dom.js'
class RendererController{
    constructor(){
        this.domController = null
        this.trackerRunning = false
        this.id = Math.random().toString(36).substring(2)
        this.console = document.querySelector("#console")
    }

    start(){
        let my = this
        my.domController = new DomController({
            start: () => {
                my.toggleTracker()
            },
            test: () => { //TODO: remove
                my.domController.takeScreenshot( data => {
                    my.emit('screenshot_data',data)
                })
            }
        })        
        my.domController.start()
        my.listen()
        my.emit('renderer_ready','OK')
    }
    
    listen(){
        let my = this
        window.api.listen('media_source',(data) => {
            if(data && typeof data == 'object'){
                my.domController.setMediaSource(data)
            }
        })
        window.api.listen('request_start_tracking_response_ok',() => {
            my.trackerRunning = true
            my.domController.trackerStarted()
        })
        window.api.listen('request_start_tracking_response_error',() => {
            my.trackerRunning = false
            my.domController.trackerStopped()
        })
        window.api.listen('request_stop_tracking_response_ok',() => {
            my.trackerRunning = false
            my.domController.trackerStopped()
        })
        window.api.listen('clock_tick',(time) => {
            my.domController.setTrackerTime(time)
        })
        window.api.listen('request_screenshot',() => {
            my.domController.takeScreenshot( data => {
                my.emit('screenshot_data',data)
            })
        })
    }

    emit(channel, data){
        window.api.emit(channel,data)
    }


    toggleTracker(){
        let my = this
        if(my.trackerRunning){
            my.emit('request_stop_tracking')
        }else{
            my.emit('request_start_tracking')
        }
    }

}

const controller = new RendererController()
controller.start()
