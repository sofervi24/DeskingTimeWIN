const axios = require('axios')
const { SERVER_SAVE_PACKETS_URL } = require('../config/global.js')
class ServerController{

    sendPacket(data){
        let options = {
            method:'post',
            url:SERVER_SAVE_PACKETS_URL,
            data,
        };
        axios(options).then(resp => {
            console.log('ServerController::sendPacket[SUCCESS]',resp.status)
        })
        .catch( err => {
            console.log('ServerController::sendPacket[ERROR]',err)
        })
    }

}

module.exports = {ServerController}