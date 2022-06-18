export class DomController{
    constructor({
        start,
        test
    }){
        this.actions = {
            start: typeof start == 'function' ? start : () => {},
            test: typeof test == 'function' ? test : () => {},
        }
        this.mediaSource = null
    }

    setMediaSource(source){
        let my = this
        my.mediaSource = source        
    }

    start(){
        let my = this
        my.setListener("#button-start",my.actions.start,'click')
        my.setListener("#button-test",my.actions.test,'click')
        my.updateLastScreenshot()
    }

    setListener(selector, action,type){
        let element = document.querySelector(selector)
        if(!element || !action || !type) return
        if(typeof(action) != 'function') return
        element.addEventListener(type, action)
    }

    trackerStarted(){
        let my = this
        my.html("#button-start",'Stop')
    }

    trackerStopped(){
        let my = this
        my.html("#button-start",'Start')
        my.setTrackerTime(0)
    }

    setTrackerTime(time){
        let my = this
        let time_str = new Date(time * 1000).toISOString().slice(11,19)
        my.html("#clock-label",time_str)
        my.updateLastScreenshotTime()
    }

    takeScreenshot(callback){
        let my = this
        let video = document.querySelector('#screenshot-video')
        video.onloadedmetadata = function () {
            video.play()
            let canvas = document.createElement('canvas')
            canvas.width = this.videoWidth
            canvas.height = this.videoHeight
            let ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            video.srcObject.getTracks().forEach(track => track.stop())
            video.srcObject = null
            let data = canvas.toDataURL('image/jpeg',0.2)
            if(typeof callback == 'function'){
                callback(data)
            }
            my.saveLastScreenshot(data)
        }
        window.navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: my.mediaSource.id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        }).then( stream => {
            video.srcObject = stream
        })
    }

    saveLastScreenshot(data){
        let my = this
        let datetime = (new Date()).toUTCString()
        window.localStorage.setItem('last-screenshot-image',data)
        window.localStorage.setItem('last-screenshot-datetime',datetime)
        my.updateLastScreenshot()
    }

    updateLastScreenshot(){
        let my = this
        let image = window.localStorage.getItem('last-screenshot-image')
        if(image) my.attr('#last-screenshot-image','src',image)
        my.updateLastScreenshotTime()
    }

    updateLastScreenshotTime(){
        let my = this
        let datetime = window.localStorage.getItem('last-screenshot-datetime')
        if(datetime) 
            my.html('#last-screenshot-datetime',my.formatLastScreenshotTime(datetime))
        else 
            my.html('#last-screenshot-datetime','')
    }

    formatLastScreenshotTime(datetime){
        let time = (new Date(datetime)).getTime()
        let now = new Date().getTime()
        let diff = (time - now) / 1000
        return window.api.formatter(diff)
    }

    attr(selector, attrName, value){
        let element = document.querySelector(selector)
        if(!element) return
        element.setAttribute(attrName, value)
    }

    html(selector, content){
        let element = document.querySelector(selector)
        if(!element) return
        element.innerHTML = content
    }

}