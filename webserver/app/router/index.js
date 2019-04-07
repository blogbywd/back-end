const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
module.exports = class initRouter {
    constructor(router) {
        this.router = router;
        this.start();
    }
    start() {
        this.readFile('', __dirname);
    }
    requireFile(filePath) {
        const routers = require(filePath);
        routers(this.router);
        console.log(path.basename(filePath, '.js'), 'router init success');
    }

    readFile(fileName, dirname) {
        // const self = this
        var filePath = path.join(dirname, fileName);
        if (fileName.indexOf('.') === -1 && fs.statSync(filePath).isDirectory()) {
            fs.readdirSync(filePath).forEach(file => {
                this.readFile(file, filePath);
            });
        } else if (
            (fileName.endsWith('.js') || fileName.endsWith('.js')) &&
            fileName !== basename
        ) {
            this.requireFile(filePath);
        }
    }
};
