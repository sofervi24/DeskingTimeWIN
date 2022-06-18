const MAIN_WINDOW_WIDTH =  300 
const MAIN_WINDOW_HEIGHT =  265
const CLOCK_SCREENSHOT_MIN_TIME = 60
const CLOCK_SCREENSHOT_MAX_TIME = 540
const PACKET_TIME = 600
const SCREENSHOT_WINDOW_TTL = 10500
const PATH_MAIN_WINDOW_VIEW = '/src/views/main.html'
const PATH_SCREENSHOT_WINDOW_VIEW = '/src/views/screenshot.html'
const PATH_PRELOAD_SCRIPT = '/src/ipc/preload.js'
const SCREENSHOT_WINDOW_WIDTH =  300 
const SCREENSHOT_WINDOW_HEIGHT =  215
const SCREENSHOT_WINDOW_Y =  0
const MONITOR_CODE_REQUEST_TERMINATE = 0
const MONITOR_CODE_REQUEST_VALUES = 1
const SERVER_SAVE_PACKETS_URL = 'http://191.96.165.106:3001/packets/'

const getMonitorPath = () => {
    let path = global.basePath
    //Uncomment for production
    let asar = 'app.asar'
    path = path.substring(0, path.length - asar.length)
    path += 'res/./monitor'
    return path
}

module.exports = {
    MAIN_WINDOW_WIDTH,
    MAIN_WINDOW_HEIGHT,
    CLOCK_SCREENSHOT_MIN_TIME,
    CLOCK_SCREENSHOT_MAX_TIME,
    PACKET_TIME,
    SCREENSHOT_WINDOW_TTL,
    PATH_MAIN_WINDOW_VIEW,
    PATH_SCREENSHOT_WINDOW_VIEW,
    PATH_PRELOAD_SCRIPT,
    SCREENSHOT_WINDOW_WIDTH,
    SCREENSHOT_WINDOW_HEIGHT,
    SCREENSHOT_WINDOW_Y,
    MONITOR_CODE_REQUEST_TERMINATE,
    MONITOR_CODE_REQUEST_VALUES,
    SERVER_SAVE_PACKETS_URL,
    getMonitorPath,
}