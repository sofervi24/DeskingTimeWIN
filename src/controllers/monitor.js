const child = require('child_process')
const {
    getMonitorPath,
    MONITOR_CODE_REQUEST_TERMINATE,
    MONITOR_CODE_REQUEST_VALUES
} = require('../config/global.js')
class MonitorController{
    static MESSAGE_TYPE_DISCONNECT = 1
    static MESSAGE_TYPE_ERROR = 2
    static MESSAGE_TYPE_EXIT = 3
    static MESSAGE_TYPE_VALUES = 4
    constructor({message}){
        this.path = getMonitorPath()
        this.sendMessage = typeof message == 'function' ? message : (type,msg) => {}
        try{
            this.spawn = child.spawn(this.path)
        }catch(error){
            this.sendMessage(MonitorController.MESSAGE_TYPE_ERROR,error.message)
            this.spawn = null
        }
    }

    start(){
        let my = this
        if(!my.spawn) return
        my.spawn.on('disconnect',function(){
            my.spawn = null
            my.sendMessage(MonitorController.MESSAGE_TYPE_DISCONNECT)
        })
        my.spawn.on('error',function(error){
            my.spawn = null
              my.sendMessage(MonitorController.MESSAGE_TYPE_ERROR,error)
        })
        my.spawn.on('exit',function(code,signal){
            my.spawn = null
              my.sendMessage(MonitorController.MESSAGE_TYPE_EXIT,`{"code": ${code},"signal": ${signal}}`)
        })
        my.spawn.stdout.on('data', (data) => {
              my.sendMessage(MonitorController.MESSAGE_TYPE_VALUES,data)
        })
        my.spawn.stderr.on('data', (data) => {
              my.sendMessage(MonitorController.MESSAGE_TYPE_ERROR,data)
        })	
    }

    stop(){
        let my = this
        if(!my.spawn) return
        my.spawn.stdin.write(`${MONITOR_CODE_REQUEST_TERMINATE}`)
    }

    requestValues(){
        let my = this
        if(!my.spawn) return
        my.spawn.stdin.write(`${MONITOR_CODE_REQUEST_VALUES}`)
    }
}

module.exports = {
    MonitorController
}