const { MainController } = require('./src/controllers/main')
global.basePath = __dirname;
const main = new MainController()
main.start()