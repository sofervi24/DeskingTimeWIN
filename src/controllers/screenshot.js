const { BrowserWindow } = require('electron')
const {
    PATH_SCREENSHOT_WINDOW_VIEW,
    PATH_PRELOAD_SCRIPT,
    SCREENSHOT_WINDOW_WIDTH,
    SCREENSHOT_WINDOW_HEIGHT,
    SCREENSHOT_WINDOW_Y,
    SCREENSHOT_WINDOW_TTL,
} = require('../config/global.js')

class ScreenshotController{
    static SCREENSHOT_NUMBER = 0
    constructor({data, screen}){
        this.data = data
        this.screen = screen
        this.window = null
    }

    start(){
        ScreenshotController.SCREENSHOT_NUMBER += 1
        let my = this
        let x = 0
        if(my.screen){
            x = my.screen.size.width - SCREENSHOT_WINDOW_WIDTH
        }
        my.window = new BrowserWindow({
            x,
            y:SCREENSHOT_WINDOW_Y,
            width:SCREENSHOT_WINDOW_WIDTH, 
            height:SCREENSHOT_WINDOW_HEIGHT,
            frame: false,
            show: false,
            webPreferences:{
                preload: `${global.basePath}${PATH_PRELOAD_SCRIPT}`,
            }
        })
        my.window.loadFile(`${global.basePath}${PATH_SCREENSHOT_WINDOW_VIEW}`)
        my.window.setAlwaysOnTop(true)
        my.window.setVisibleOnAllWorkspaces(true,{
            visibleOnFullScreen: true,
        }) 
        my.window.webContents.on('did-finish-load',() => {
            if(my.window){
                my.window.webContents.send('data',{
                    ttl: SCREENSHOT_WINDOW_TTL,
                    image: my.data,
                    id: ScreenshotController.SCREENSHOT_NUMBER,
                })
            }
            setTimeout( () => {
                if(my.window){
                    my.window.destroy()
                }
            },SCREENSHOT_WINDOW_TTL)
        })
        my.window.showInactive()
    }
}

module.exports = {
    ScreenshotController
}

