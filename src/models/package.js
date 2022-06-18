const { ActivityModel } = require("./activity.js")
const { uuid } = require('../config/utils.js')
class PackageModel{
    constructor({length}){
        this.id = uuid()
        this.date = new Date()
        this.offset = this.date.getTimezoneOffset()
        this.length = length
        this.screenshot = null
        this.activity = []
    }

    setScreenshot(data){
        this.screenshot = data
    }

    addActivity({second, keyboard, mouse}){
        this.activity.push(new ActivityModel({second,keyboard,mouse}))
    }

    toJSON(){
        return {
            date: this.date.toISOString(),
            offset: this.offset,
            length: this.length,
            activity: this.activity.map( item => item.toJSON()),
            screenshot: {
                data: this.screenshot,
                ext: 'jpeg'
            },
        }
    }
}

module.exports = { PackageModel }