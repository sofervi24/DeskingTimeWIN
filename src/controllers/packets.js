const { 
    CLOCK_SCREENSHOT_MIN_TIME,
    CLOCK_SCREENSHOT_MAX_TIME,
    PACKET_TIME
} = require('../config/global.js')
const { random } = require('../config/utils.js')
const { PackageModel } = require('../models/package.js')
const { ClockController } = require('./clock.js')
const { MonitorController } = require('./monitor.js')
const { ServerController } = require('./server.js')
class PacketsController{
    constructor({
        tick,
        error
    }){
        let my = this
        my.nextPacketTime = PACKET_TIME
        my.current = null
        my.second = 0
        my.mainControllerTick =  typeof tick == 'function' ? tick : () => {}
        my.errorMessage =  typeof error == 'function' ? error : () => {}
        my.clock = new ClockController({
            tick: (time, screenshot) => {
                my.clockTick(time,screenshot)
            }
        })
        my.monitor = new MonitorController({
            message: (type,msg) => {
                my.messageFromMonitor(type,msg)
            }
        })
        my.server = new ServerController()
    }

    screenshotData(data){
        this.current.setScreenshot(data)
    }

    startTracking(){
        let my = this
        my.nextScreenshot = random(CLOCK_SCREENSHOT_MIN_TIME,CLOCK_SCREENSHOT_MAX_TIME)
        my.current = new PackageModel({length: PACKET_TIME})
        my.second = 0
        my.clock.start()
        my.monitor.start()
        return true
    }
    stopTracking(){
        let my = this
        my.clock.stop()
        my.monitor.stop()
        my.server.sendPacket(my.current.toJSON())
        my.current = null
    }

    clockTick(time){
        let my = this
        let screenshot = false
        my.second += 1
        my.nextPacketTime -= 1
        my.nextScreenshot -= 1
        if(my.nextScreenshot == 0){
            screenshot = true
        }
        if(my.nextPacketTime <= 0){
            my.nextPacketTime = PACKET_TIME
            my.nextScreenshot = random(CLOCK_SCREENSHOT_MIN_TIME,CLOCK_SCREENSHOT_MAX_TIME)
            my.server.sendPacket(my.current.toJSON())
            my.current = new PackageModel({length: PACKET_TIME})
            my.second = 0
        }
        my.monitor.requestValues()
        my.mainControllerTick(time,screenshot)
    }

    messageFromMonitor(type, msg){
        let my = this
        switch(type){
            case MonitorController.MESSAGE_TYPE_VALUES:
                try{
                    //TODO: check status from msg == true
                    const data = JSON.parse(msg)
                    my.current.addActivity({
                        second: my.second,
                        keyboard: data.keyboard,
                        mouse: data.mouse
                    })
                }catch(error){
                    //TODO: handle error
                }
                break
            case MonitorController.MESSAGE_TYPE_ERROR:
                my.errorMessage(msg)
                break
            default:
                break
        }
    }



}

module.exports = {
    PacketsController
}