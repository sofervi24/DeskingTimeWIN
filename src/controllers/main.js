const { app, BrowserWindow, ipcMain, desktopCapturer, screen, dialog } = require('electron')
const { PacketsController } = require('./packets.js')
const { ScreenshotController } = require('./screenshot.js')
const {
    PATH_MAIN_WINDOW_VIEW,
    PATH_PRELOAD_SCRIPT,
    MAIN_WINDOW_WIDTH,
    MAIN_WINDOW_HEIGHT,
    getMonitorPath
} = require('../config/global.js')
class MainController{
    constructor(){
        let my = this
        my.mainWindow = null
        my.clientScreen = null
        my.packetsController = new PacketsController({
            tick: (time, screenshot) => {
                my.tick(time, screenshot)
            },
            error: (message) => {
                dialog.showMessageBox(my.mainWindow,{
                    title: 'Monitor Error',
                    type: 'error',
                    message 
                })
            }
        })
    }

    createWindow(){
        let my = this
        my.mainWindow = new BrowserWindow({
            width:MAIN_WINDOW_WIDTH,
            height:MAIN_WINDOW_HEIGHT,
            resizable:false,
            webPreferences:{
                contextIsolation: true,
                preload: `${global.basePath}${PATH_PRELOAD_SCRIPT}`,
            }
        })
        my.mainWindow.loadFile(`${global.basePath}${PATH_MAIN_WINDOW_VIEW}`)
        my.mainWindow.once('show',() => {
            my.clientScreen = screen.getPrimaryDisplay()            
        })
        my.mainWindow.on('closed',() => {
            app.quit()
        })

    }

    listen(){
        let my = this
        ipcMain.once('renderer_ready',(event) => {
            my.captureMediaSource()
        })

        ipcMain.on('request_start_tracking',(event) => {
            if(my.packetsController.startTracking()){
                my.emit('request_start_tracking_response_ok')
            }else{
                my.emit('request_start_tracking_response_error')
            }
        })

        ipcMain.on('request_stop_tracking',(event) => {
            my.packetsController.stopTracking()
            my.emit('request_stop_tracking_response_ok')
        })

        ipcMain.on('screenshot_data',(event, data) => {
            (new ScreenshotController({data,screen: my.clientScreen})).start()
            my.packetsController.screenshotData(data)
        })
    }


    emit(channel, data){
        let my = this
        my.mainWindow.webContents.send(channel,data)
    }

    start(){
        let my = this
        app.whenReady()
            .then( () => {
                my.listen()
                my.createWindow()
            })
    }

    captureMediaSource(){
        let my = this
        desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
            let source = null
            for (const s of sources) {
                if (s.name === "Entire Screen") {
                    source = s
                    break
                }
            }
            if(!source) throw "No source found!"
            my.emit('media_source',source)
        }).catch( error => {
            console.log('captureMediaSource::getSources[error]', error)
        })
    }

    tick(time, screenshot){
        let my = this
        my.emit('clock_tick',time)
        if(screenshot === true){
            my.emit('request_screenshot')
        }
    }
}

module.exports = {
    MainController
}